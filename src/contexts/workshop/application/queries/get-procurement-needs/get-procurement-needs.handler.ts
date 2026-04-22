import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProcurementNeedsQuery } from './get-procurement-needs.query';
import { IMaterialRepository } from '../../../domain/repositories/imaterial.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { ToolStatus } from '../../../domain/enums/tool-status.enum';
import {
  ProcurementNeedsDto,
  MaterialBelowMinStockDto,
  ApprovedRequestStockGapDto,
  ToolInRepairDto,
} from '../../dtos/procurement-needs.dto';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

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
      .filter((m) => {
        const current = stockMap.get(m.id.getValue()) ?? 0;
        return current < m.minStock;
      })
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

    const approvedRequestsWithInsufficientStock: ApprovedRequestStockGapDto[] =
      approvedRequests
        .filter((req) => {
          const current = stockMap.get(req.itemId) ?? 0;
          return current < (req.quantity ?? 0);
        })
        .map((req) => {
          const material = materialMap.get(req.itemId);
          const current = stockMap.get(req.itemId) ?? 0;
          const requestedQty = req.quantity ?? 0;
          return {
            requestId: req.id.getValue(),
            materialId: req.itemId,
            materialName: material?.name ?? req.itemId,
            unit: material?.unit ?? '',
            requestedQuantity: requestedQty,
            currentStock: current,
            shortfall: requestedQty - current,
            priority: req.priority,
            requestedBy: req.requestedBy,
            createdAt: req.createdAt.toISOString(),
          };
        });

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
