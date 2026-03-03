import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AddBulkJobItemsCommand } from './add-bulk-job-items.command';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { ISlabRepository } from '@contexts/inventory/domain/repositories/slab.repository';
import { SlabStatus } from '@contexts/inventory/domain/enums/slab-status.enum';
import { JobId } from '../../../domain/value-objects/job-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { DomainException } from '@shared/domain/domain.exception';
import { JobItemOutputDto } from '../../dtos/job-output.dto';
import { PROJECTS_TOKENS } from '../../projects.tokens';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { HttpStatus } from '@nestjs/common';
import { SlabNotAvailableException } from '../../../domain/errors/slab-not-available.exception';

@CommandHandler(AddBulkJobItemsCommand)
export class AddBulkJobItemsHandler implements ICommandHandler<AddBulkJobItemsCommand> {
  constructor(
    @Inject(PROJECTS_TOKENS.JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
    @Inject(INVENTORY_TOKENS.SLAB_REPOSITORY)
    private readonly slabRepository: ISlabRepository,
  ) {}

  async execute(command: AddBulkJobItemsCommand): Promise<JobItemOutputDto[]> {
    const { jobId, items, userId } = command;

    // 1. Validate no duplicate slabIds in the request
    const slabIds = items.map((i) => i.slabId);
    const uniqueSlabIds = new Set(slabIds);
    if (uniqueSlabIds.size !== slabIds.length) {
      throw new DomainException(
        'Duplicate slabIds in request. Each slab can only be added once.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // 2. Load job
    const job = await this.jobRepository.findById(JobId.create(jobId));
    if (!job) {
      throw new ResourceNotFoundException('Job', jobId);
    }

    // 3. Load all slabs in one query and validate existence + availability
    const slabs = await this.slabRepository.findByIds(slabIds);

    const foundIds = new Set(slabs.map((s) => s.id.getValue()));
    const missingIds = slabIds.filter((id) => !foundIds.has(id));
    if (missingIds.length > 0) {
      throw new ResourceNotFoundException('Slabs', missingIds.join(', '));
    }

    const unavailableSlabs = slabs.filter(
      (s) => s.status !== SlabStatus.AVAILABLE,
    );
    if (unavailableSlabs.length > 0) {
      throw new SlabNotAvailableException(
        unavailableSlabs.map((s) => s.id.getValue()),
      );
    }

    // 4. Add all items to job aggregate and collect created items
    const inputBySlabId = new Map(items.map((i) => [i.slabId, i]));
    const createdItems = slabs.map((slab) => {
      const input = inputBySlabId.get(slab.id.getValue())!;
      return job.addItem(
        slab.id.getValue(),
        input.description ?? '',
        input.unitPrice,
        userId,
      );
    });

    // 5. Mark slabs as RESERVED
    slabs.forEach((slab) => slab.updateStatus(SlabStatus.RESERVED, userId));

    // 6. Persist job + slabs (both inside a logical unit — no native transaction
    //    needed since save() uses TypeORM upsert which is atomic per entity)
    await Promise.all([
      this.jobRepository.save(job),
      this.slabRepository.saveMany(slabs),
    ]);

    // 7. Return created items from in-memory aggregate (no extra query)
    const slabById = new Map(slabs.map((s) => [s.id.getValue(), s]));
    return createdItems.map((item) => ({
      id: item.id.getValue(),
      slabId: item.slabId,
      slabCode: slabById.get(item.slabId)?.code ?? '',
      productName: '',
      description: item.description,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));
  }
}
