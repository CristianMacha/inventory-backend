import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetPermissionsQuery } from './get-permissions.query';
import { PermissionOutputDto } from '../../dtos/permission.output.dto';
import { IPermissionRepository } from '@contexts/users/domain/repositories/permission.repository';
import { PermissionResponseMapper } from '@contexts/users/application/mappers/permission-response.mapper';

@QueryHandler(GetPermissionsQuery)
export class GetPermissionsHandler implements IQueryHandler<GetPermissionsQuery> {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: GetPermissionsQuery): Promise<PermissionOutputDto[]> {
    const permissions = await this.permissionRepository.findAll();

    return permissions.map((e) => PermissionResponseMapper.toResponse(e));
  }
}
