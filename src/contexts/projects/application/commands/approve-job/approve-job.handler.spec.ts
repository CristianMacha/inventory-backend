import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { ApproveJobHandler } from './approve-job.handler';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { ApproveJobCommand } from './approve-job.command';
import { PROJECTS_TOKENS } from '../../projects.tokens';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Job } from '../../../domain/entities/job';
import { InvalidJobTransitionException } from '../../../domain/errors/invalid-job-transition.exception';
import { EmptyJobItemsException } from '../../../domain/errors/empty-job-items.exception';

const makeJob = (overrides: Partial<ReturnType<typeof Job.create>> = {}) => {
  const job = Job.create(
    'Test Project',
    'Client Name',
    '555-0000',
    'client@example.com',
    '123 Main St',
    '',
    'user-1',
  );
  return Object.assign(job, overrides);
};

describe('ApproveJobHandler', () => {
  let handler: ApproveJobHandler;
  let jobRepository: jest.Mocked<IJobRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApproveJobHandler,
        {
          provide: PROJECTS_TOKENS.JOB_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findPaginated: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publishAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<ApproveJobHandler>(ApproveJobHandler);
    jobRepository = module.get(PROJECTS_TOKENS.JOB_REPOSITORY);
    eventBus = module.get(EventBus);
  });

  it('should throw ResourceNotFoundException when job not found', async () => {
    jobRepository.findById.mockResolvedValue(null);
    const command = new ApproveJobCommand('non-existent-id', 'user-1');

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(jobRepository.save).not.toHaveBeenCalled();
  });

  it('should throw EmptyJobItemsException when job has no items', async () => {
    const job = makeJob();
    jobRepository.findById.mockResolvedValue(job);
    const command = new ApproveJobCommand(job.id.getValue(), 'user-1');

    await expect(handler.execute(command)).rejects.toThrow(
      EmptyJobItemsException,
    );
    expect(jobRepository.save).not.toHaveBeenCalled();
  });

  it('should throw InvalidJobTransitionException when approving a non-quoted job', async () => {
    const job = makeJob();
    // Add an item then approve to move status, then try to approve again
    job.addItem('slab-1', 'desc', 100, 'user-1');
    job.approve('user-1');
    jobRepository.findById.mockResolvedValue(job);
    const command = new ApproveJobCommand(job.id.getValue(), 'user-1');

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidJobTransitionException,
    );
  });

  it('should approve job, save, and publish events', async () => {
    const job = makeJob();
    job.addItem('slab-1', 'Marble slab', 500, 'user-1');
    jobRepository.findById.mockResolvedValue(job);
    const command = new ApproveJobCommand(job.id.getValue(), 'user-1');

    await handler.execute(command);

    expect(jobRepository.save).toHaveBeenCalledWith(job);
    expect(eventBus.publishAll).toHaveBeenCalled();
  });
});
