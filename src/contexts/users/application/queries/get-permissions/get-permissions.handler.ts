import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetPermissionsQuery } from './get-permissions.query';
import { PermissionOutputDto } from '../../dtos/permission.output.dto';
import { IPermissionRepository } from '@contexts/users/domain/repositories/permission.repository';
import { PermissionResponseMapper } from '@contexts/users/application/mappers/permission-response.mapper';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetPermissionsQuery)
export class GetPermissionsHandler implements IQueryHandler<GetPermissionsQuery> {
  constructor(
    @Inject(USERS_TOKENS.PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(): Promise<PermissionOutputDto[]> {
    const permissions = await this.permissionRepository.findAll();

    return permissions.map((e) => PermissionResponseMapper.toResponse(e));
  }
}
