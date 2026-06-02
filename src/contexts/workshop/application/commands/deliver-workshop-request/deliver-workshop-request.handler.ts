import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DeliverWorkshopRequestCommand } from './deliver-workshop-request.command';
import { IWorkshopRequestRepository } from '../../../domain/repositories/iworkshop-request.repository';
import { IMaterialMovementRepository } from '../../../domain/repositories/imaterial-movement.repository';
import { IToolRepository } from '../../../domain/repositories/itool.repository';
import { IToolMovementRepository } from '../../../domain/repositories/itool-movement.repository';
import { WorkshopRequestId } from '../../../domain/value-objects/workshop-request-id';
import { ToolId } from '../../../domain/value-objects/tool-id';
import { MaterialMovement } from '../../../domain/entities/material-movement.entity';
import { ToolMovement } from '../../../domain/entities/tool-movement.entity';
import { MaterialMovementReason } from '../../../domain/enums/material-movement-reason.enum';
import { RequestType } from '../../../domain/enums/request-type.enum';
import { ToolStatus } from '../../../domain/enums/tool-status.enum';
import { InsufficientMaterialStockException } from '../../../domain/errors/workshop.errors';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { MaterialMovementPersistenceMapper } from '../../../infrastructure/persistence/typeorm/mappers/material-movement-persistence.mapper';
import { ToolPersistenceMapper } from '../../../infrastructure/persistence/typeorm/mappers/tool-persistence.mapper';
import { ToolMovementPersistenceMapper } from '../../../infrastructure/persistence/typeorm/mappers/tool-movement-persistence.mapper';
import { WorkshopRequestPersistenceMapper } from '../../../infrastructure/persistence/typeorm/mappers/workshop-request-persistence.mapper';
import { MaterialMovementTypeormEntity } from '../../../infrastructure/persistence/typeorm/entities/material-movement.typeorm.entity';
import { ToolTypeormEntity } from '../../../infrastructure/persistence/typeorm/entities/tool.typeorm.entity';
import { ToolMovementTypeormEntity } from '../../../infrastructure/persistence/typeorm/entities/tool-movement.typeorm.entity';
import { WorkshopRequestTypeormEntity } from '../../../infrastructure/persistence/typeorm/entities/workshop-request.typeorm.entity';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@CommandHandler(DeliverWorkshopRequestCommand)
export class DeliverWorkshopRequestHandler implements ICommandHandler<DeliverWorkshopRequestCommand> {
  constructor(
    @Inject(WORKSHOP_TOKENS.REQUEST_REPOSITORY)
    private readonly requestRepository: IWorkshopRequestRepository,
    @Inject(WORKSHOP_TOKENS.MATERIAL_MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMaterialMovementRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_REPOSITORY)
    private readonly toolRepository: IToolRepository,
    @Inject(WORKSHOP_TOKENS.TOOL_MOVEMENT_REPOSITORY)
    private readonly toolMovementRepository: IToolMovementRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: DeliverWorkshopRequestCommand): Promise<void> {
    const request = await this.requestRepository.findById(
      WorkshopRequestId.create(command.requestId),
    );
    if (!request) {
      throw new ResourceNotFoundException('WorkshopRequest', command.requestId);
    }

    if (request.requestType === RequestType.MATERIAL) {
      const deliveredQty = request.approvedQuantity ?? request.quantity!;
      const currentStock = await this.movementRepository.getStockForMaterial(
        request.itemId,
      );
      if (currentStock < deliveredQty) {
        throw new InsufficientMaterialStockException(
          currentStock,
          deliveredQty,
        );
      }

      const movement = MaterialMovement.create(
        request.itemId,
        -deliveredQty,
        MaterialMovementReason.USO_JOB,
        command.deliveredBy,
        request.jobId ?? undefined,
        `Delivered for request ${request.id.getValue()}`,
      );

      request.deliver(command.deliveredBy);

      await this.dataSource.transaction(async (manager) => {
        await manager.save(
          MaterialMovementTypeormEntity,
          MaterialMovementPersistenceMapper.toPersistence(movement),
        );
        await manager.save(
          WorkshopRequestTypeormEntity,
          WorkshopRequestPersistenceMapper.toPersistence(request),
        );
      });
    } else {
      const tool = await this.toolRepository.findById(
        ToolId.create(request.itemId),
      );
      if (!tool) {
        throw new NotFoundException(`Tool ${request.itemId} not found`);
      }

      const previousStatus = tool.status;
      tool.update(command.deliveredBy, undefined, undefined, ToolStatus.IN_USE);

      const toolMovement = ToolMovement.create(
        tool.id.getValue(),
        previousStatus,
        ToolStatus.IN_USE,
        command.deliveredBy,
        request.jobId ?? undefined,
        `Delivered for request ${request.id.getValue()}`,
      );

      request.deliver(command.deliveredBy);

      await this.dataSource.transaction(async (manager) => {
        await manager.save(
          ToolTypeormEntity,
          ToolPersistenceMapper.toPersistence(tool),
        );
        await manager.save(
          ToolMovementTypeormEntity,
          ToolMovementPersistenceMapper.toPersistence(toolMovement),
        );
        await manager.save(
          WorkshopRequestTypeormEntity,
          WorkshopRequestPersistenceMapper.toPersistence(request),
        );
      });
    }
  }
}
