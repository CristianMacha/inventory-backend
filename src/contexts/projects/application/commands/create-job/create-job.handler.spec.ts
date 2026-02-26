import { Test, TestingModule } from '@nestjs/testing';
import { CreateJobHandler } from './create-job.handler';
import { IJobRepository } from '../../../domain/repositories/job.repository';
import { CreateJobCommand } from './create-job.command';
import { PROJECTS_TOKENS } from '../../projects.tokens';
import { InvalidProjectNameException } from '../../../domain/errors/invalid-project-name.exception';

describe('CreateJobHandler', () => {
  let handler: CreateJobHandler;
  let jobRepository: jest.Mocked<IJobRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateJobHandler,
        {
          provide: PROJECTS_TOKENS.JOB_REPOSITORY,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findPaginated: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateJobHandler>(CreateJobHandler);
    jobRepository = module.get(PROJECTS_TOKENS.JOB_REPOSITORY);
  });

  it('should create a job and return its id', async () => {
    const command = new CreateJobCommand(
      'Kitchen Renovation',
      'John Doe',
      'user-1',
      '555-1234',
      'john@example.com',
      '123 Main St',
      'Some notes',
    );

    const id = await handler.execute(command);

    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect(jobRepository.save).toHaveBeenCalledTimes(1);
    expect(jobRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ projectName: 'Kitchen Renovation' }),
    );
  });

  it('should throw InvalidProjectNameException for empty project name', async () => {
    const command = new CreateJobCommand('', 'John Doe', 'user-1');

    await expect(handler.execute(command)).rejects.toThrow(
      InvalidProjectNameException,
    );
    expect(jobRepository.save).not.toHaveBeenCalled();
  });
});
