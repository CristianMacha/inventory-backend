import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedInfrastructureModule } from '@shared/infrastructure/shared-infrastructure.module';
import { PROJECTS_TOKENS } from './application/projects.tokens';

import { JobEntity } from './infrastructure/persistence/typeorm/entities/job.entity';
import { JobItemEntity } from './infrastructure/persistence/typeorm/entities/job-item.entity';
import { TypeOrmJobRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-job.repository';

import { CreateJobHandler } from './application/commands/create-job/create-job.handler';
import { AddJobItemHandler } from './application/commands/add-job-item/add-job-item.handler';
import { RemoveJobItemHandler } from './application/commands/remove-job-item/remove-job-item.handler';
import { ApproveJobHandler } from './application/commands/approve-job/approve-job.handler';
import { StartJobHandler } from './application/commands/start-job/start-job.handler';
import { CompleteJobHandler } from './application/commands/complete-job/complete-job.handler';
import { CancelJobHandler } from './application/commands/cancel-job/cancel-job.handler';

import { GetJobsHandler } from './application/queries/get-jobs/get-jobs.handler';
import { GetJobByIdHandler } from './application/queries/get-job-by-id/get-job-by-id.handler';

import { JobsController } from './infrastructure/http/controllers/jobs.controller';

const CommandHandlers = [
  CreateJobHandler,
  AddJobItemHandler,
  RemoveJobItemHandler,
  ApproveJobHandler,
  StartJobHandler,
  CompleteJobHandler,
  CancelJobHandler,
];

const QueryHandlers = [GetJobsHandler, GetJobByIdHandler];

const PersistenceProviders: Provider[] = [
  {
    provide: PROJECTS_TOKENS.JOB_REPOSITORY,
    useClass: TypeOrmJobRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([JobEntity, JobItemEntity]),
    SharedInfrastructureModule,
  ],
  controllers: [JobsController],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
  exports: [...PersistenceProviders],
})
export class ProjectsModule {}
