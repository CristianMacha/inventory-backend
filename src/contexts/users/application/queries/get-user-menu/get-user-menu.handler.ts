import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserMenuQuery } from './get-user-menu.query';
import { MenuResponseDto } from '../../dtos/menu-response.dto';
import { IUserRepository } from '@contexts/users/domain/repositories/user.repository';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import { MENU_ITEMS } from '@shared/menu/menu-items';
import { MenuItem } from '@shared/menu/menu-item.interface';
import { USERS_TOKENS } from '@contexts/users/users.tokens';

@QueryHandler(GetUserMenuQuery)
export class GetUserMenuHandler implements IQueryHandler<GetUserMenuQuery> {
  constructor(
    @Inject(USERS_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserMenuQuery): Promise<MenuResponseDto> {
    // Obtener el usuario con sus roles y permisos
    const user = await this.userRepository.findById(
      UserId.create(query.userId),
    );

    if (!user) {
      return { menus: [] };
    }

    // Extraer todos los permisos del usuario
    const userPermissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name),
    );

    // Filtrar el menú según los permisos
    const filteredMenu = this.filterMenuByPermissions(
      MENU_ITEMS,
      userPermissions,
    );

    return { menus: filteredMenu };
  }

  private filterMenuByPermissions(
    menuItems: MenuItem[],
    userPermissions: string[],
  ): MenuItem[] {
    return menuItems
      .filter((item) => userPermissions.includes(item.permission))
      .map((item) => {
        // Si tiene hijos, filtrarlos recursivamente
        if (item.children && item.children.length > 0) {
          const filteredChildren = this.filterMenuByPermissions(
            item.children,
            userPermissions,
          );

          // Solo incluir el item padre si tiene hijos visibles
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          // Si no tiene hijos visibles pero el padre tiene path, incluirlo sin hijos
          if (item.path) {
            const { children, ...itemWithoutChildren } = item;
            return itemWithoutChildren;
          }
          // Si no tiene path ni hijos visibles, no incluirlo
          return null;
        }

        return item;
      })
      .filter((item): item is MenuItem => item !== null);
  }
}
