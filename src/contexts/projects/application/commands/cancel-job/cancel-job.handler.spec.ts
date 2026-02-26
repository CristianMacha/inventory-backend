import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { CancelJobHandler } from './cancel-job.handler';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { CancelJobCommand } from './cancel-job.command';
import { PROJECTS_TOKENS } from '../../projects.tokens';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { Job } from '../../../domain/entities/job';
import { InvalidJobTransitionException } from '../../../domain/errors/invalid-job-transition.exception';

const makeJob = () =>
  Job.create(
    'Test Project',
    'Client Name',
    '555-0000',
    'client@example.com',
    '123 Main St',
    '',
    'user-1',
  );

describe('CancelJobHandler', () => {
  let handler: CancelJobHandler;
  let jobRepository: jest.Mocked<IJobRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelJobHandler,
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

    handler = module.get<CancelJobHandler>(CancelJobHandler);
    jobRepository = module.get(PROJECTS_TOKENS.JOB_REPOSITORY);
    eventBus = module.get(EventBus);
  });

  it('should throw ResourceNotFoundException when job not found', async () => {
    jobRepository.findById.mockResolvedValue(null);
    const command = new CancelJobCommand('non-existent-id', 'user-1');

    await expect(handler.execute(command)).rejects.toThrow(
      ResourceNotFoundException,
    );
    expect(jobRepository.save).not.toHaveBeenCalled();
  });

  it('should cancel a quoted job successfully', async () => {
    const job = makeJob();
    jobRepository.findById.mockResolvedValue(job);
    const command = new CancelJobCommand(job.id.getValue(), 'user-1');

    await handler.execute(command);

    expect(jobRepository.save).toHaveBeenCalledWith(job);
    expect(eventBus.publishAll).toHaveBeenCalled();
  });

  it('should throw InvalidJobTransitionException when cancelling a completed job', async () => {
    const job = makeJob();
    job.addItem('slab-1', 'desc', 100, 'user-1');
    job.approve('user-1');
    job.start('user-1');
    job.complete('user-1');
    jobRepository.findById.mockResolvedValue(job);
    const command = new CancelJobCommand(job.id.getValue(), 'user-1');

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidJobTransitionException,
    );
    expect(jobRepository.save).not.toHaveBeenCalled();
  });
});
