import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProcurementNeedsQuery } from './get-procurement-needs.query';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import { ToolStatus } from '../../../domain/enums/tool-status.enum';
import {
  ProcurementNeedsDto,
  MaterialBelowMinStockDto,
  ApprovedRequestStockGapDto,
  UnfulfilledRequestDto,
  ToolInRepairDto,
} from '../../dtos/procurement-needs.dto';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetProcurementNeedsQuery)
export class GetProcurementNeedsHandler implements IQueryHandler<GetProcurementNeedsQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    _query: GetProcurementNeedsQuery,
  ): Promise<ProcurementNeedsDto> {
    const [materials, approvedRequests, toolsInRepair] = await Promise.all([
      this.materialRepository.findAllUnpaginated(),
      this.requestRepository.findApprovedMaterialRequests(),
      this.toolRepository.findByStatus(ToolStatus.IN_REPAIR),
    ]);

    const stockMap = new Map<string, number>();
    await Promise.all(
      materials.map(async (material) => {
        const stock = await this.movementRepository.getStockForMaterial(
          material.id.getValue(),
        );
        stockMap.set(material.id.getValue(), stock);
      }),
    );

    const materialsBelowMinStock: MaterialBelowMinStockDto[] = materials
      .filter((m) => (stockMap.get(m.id.getValue()) ?? 0) < m.minStock)
      .map((m) => {
        const current = stockMap.get(m.id.getValue()) ?? 0;
        return {
          materialId: m.id.getValue(),
          materialName: m.name,
          unit: m.unit,
          currentStock: current,
          minStock: m.minStock,
          deficit: m.minStock - current,
          supplierId: m.supplierId,
        };
      });

    const materialMap = new Map(materials.map((m) => [m.id.getValue(), m]));

    // FIFO: consume stock per material across approved requests (ordered by createdAt ASC)
    const remainingStockMap = new Map<string, number>(stockMap);
    const unfulfilledByMaterial = new Map<
      string,
      {
        req: (typeof approvedRequests)[0];
        shortfall: number;
        available: number;
      }[]
    >();

    for (const req of approvedRequests) {
      const requestedQty = req.quantity ?? 0;
      const available = remainingStockMap.get(req.itemId) ?? 0;

      if (available < requestedQty) {
        const existing = unfulfilledByMaterial.get(req.itemId) ?? [];
        existing.push({ req, shortfall: requestedQty - available, available });
        unfulfilledByMaterial.set(req.itemId, existing);
        remainingStockMap.set(req.itemId, 0);
      } else {
        remainingStockMap.set(req.itemId, available - requestedQty);
      }
    }

    // Batch-resolve user names for unfulfilled requests
    const userIds = new Set<string>();
    for (const entries of unfulfilledByMaterial.values()) {
      for (const { req } of entries) userIds.add(req.requestedBy);
    }
    const userNames = new Map<string, string>();
    await Promise.all(
      [...userIds].map(async (id) => {
        const user = await this.userRepository.findById(UserId.create(id));
        if (user) userNames.set(id, user.name);
      }),
    );

    const approvedRequestsWithInsufficientStock: ApprovedRequestStockGapDto[] =
      [];
    for (const [materialId, entries] of unfulfilledByMaterial) {
      const material = materialMap.get(materialId);
      const unfulfilledRequests: UnfulfilledRequestDto[] = entries.map(
        ({ req, shortfall, available }) => ({
          requestId: req.id.getValue(),
          requestedQuantity: req.quantity ?? 0,
          availableStock: available,
          shortfall,
          priority: req.priority,
          requestedBy: req.requestedBy,
          requestedByName: userNames.get(req.requestedBy) ?? req.requestedBy,
          createdAt: req.createdAt.toISOString(),
        }),
      );

      approvedRequestsWithInsufficientStock.push({
        materialId,
        materialName: material?.name ?? materialId,
        unit: material?.unit ?? '',
        currentStock: stockMap.get(materialId) ?? 0,
        totalShortfall: unfulfilledRequests.reduce(
          (sum, r) => sum + r.shortfall,
          0,
        ),
        unfulfilledRequests,
      });
    }

    const toolsInRepairDto: ToolInRepairDto[] = toolsInRepair.map((tool) => ({
      toolId: tool.id.getValue(),
      toolName: tool.name,
      categoryId: tool.categoryId,
    }));

    return {
      materialsBelowMinStock,
      approvedRequestsWithInsufficientStock,
      toolsInRepair: toolsInRepairDto,
    };
  }
}
