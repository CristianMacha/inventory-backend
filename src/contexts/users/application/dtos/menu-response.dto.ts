import { ApiProperty } from '@nestjs/swagger';

class MenuItemDto {
  @ApiProperty({
    example: 'dashboard',
    description: 'Unique identifier for the menu item',
  })
  id: string;

  @ApiProperty({
    example: 'Dashboard',
    description: 'Display label for the menu item',
  })
  label: string;

  @ApiProperty({
    example: 'dashboard',
    description: 'Icon name',
    required: false,
  })
  icon?: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'Navigation path',
    required: false,
  })
  path?: string;

  @ApiProperty({
    example: 'dashboard.view',
    description: 'Required permission to view this item',
  })
  permission: string;

  @ApiProperty({
    type: [MenuItemDto],
    description: 'Nested menu items',
    required: false,
  })
  children?: MenuItemDto[];
}

export class MenuResponseDto {
  @ApiProperty({
    type: [MenuItemDto],
    description: 'Filtered menu items based on user permissions',
  })
  menus: MenuItemDto[];
}
