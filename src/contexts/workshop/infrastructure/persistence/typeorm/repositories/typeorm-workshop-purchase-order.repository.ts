import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  IWorkshopPurchaseOrderRepository,
  FindPurchaseOrdersFilter,
} from '../../../../domain/repositories/iworkshop-purchase-order.repository';
import { PurchaseOrderStatus } from '../../../../domain/enums/purchase-order-status.enum';
import { WorkshopPurchaseOrderItemTypeormEntity } from '../entities/workshop-purchase-order-item.typeorm.entity';
import { WorkshopPurchaseOrder } from '../../../../domain/entities/workshop-purchase-order.entity';
import { WorkshopPurchaseOrderId } from '../../../../domain/value-objects/workshop-purchase-order-id';
import { WorkshopPurchaseOrderTypeormEntity } from '../entities/workshop-purchase-order.typeorm.entity';
import { WorkshopPurchaseOrderPersistenceMapper } from '../mappers/workshop-purchase-order-persistence.mapper';
import {
  PaginatedResult,
  buildPaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmWorkshopPurchaseOrderRepository implements IWorkshopPurchaseOrderRepository {
  constructor(
    @InjectRepository(WorkshopPurchaseOrderTypeormEntity)
    private readonly repository: Repository<WorkshopPurchaseOrderTypeormEntity>,
    @InjectRepository(WorkshopPurchaseOrderItemTypeormEntity)
    private readonly itemRepository: Repository<WorkshopPurchaseOrderItemTypeormEntity>,
  ) {}

  async findAll(
    filter: FindPurchaseOrdersFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<WorkshopPurchaseOrder>> {
    const { page, limit } = pagination;
    const qb = this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filter.status) {
      qb.andWhere('order.status = :status', { status: filter.status });
    }
    if (filter.supplierId) {
      qb.andWhere('order.supplierId = :supplierId', {
        supplierId: filter.supplierId,
      });
    }

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map(WorkshopPurchaseOrderPersistenceMapper.toDomain),
      total,
      page,
      limit,
    );
  }

  async findById(
    id: WorkshopPurchaseOrderId,
  ): Promise<WorkshopPurchaseOrder | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
      relations: ['items'],
    });
    return entity
      ? WorkshopPurchaseOrderPersistenceMapper.toDomain(entity)
      : null;
  }

  async findActivePurchaseQuantityByMaterial(): Promise<Map<string, number>> {
    const activeOrders = await this.repository.find({
      where: {
        status: In([PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.SENT]),
      },
      select: ['id'],
    });

    if (activeOrders.length === 0) return new Map();

    const orderIds = activeOrders.map((o) => o.id);
    const rows = await this.itemRepository
      .createQueryBuilder('item')
      .select('item.materialId', 'materialId')
      .addSelect('SUM(item.purchaseQuantity)', 'total')
      .where('item.purchaseOrderId IN (:...orderIds)', { orderIds })
      .groupBy('item.materialId')
      .getRawMany<{ materialId: string; total: string }>();

    const result = new Map<string, number>();
    for (const row of rows) {
      result.set(row.materialId, Number(row.total));
    }
    return result;
  }

  async save(order: WorkshopPurchaseOrder): Promise<void> {
    const exists = await this.repository.existsBy({ id: order.id.getValue() });
    if (exists) {
      await this.repository.update(order.id.getValue(), {
        status: order.status,
        notes: order.notes,
        updatedAt: order.updatedAt,
      });
    } else {
      await this.repository.save(
        WorkshopPurchaseOrderPersistenceMapper.toPersistence(order),
      );
    }
  }
}
