import { MenuItem } from './menu-item.interface';
import { Permissions } from '@shared/authorization/permissions';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    permission: 'dashboard.view',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'warehouse',
    permission: Permissions.PRODUCTS.READ,
    children: [
      {
        id: 'products',
        label: 'Products',
        icon: 'box',
        path: '/products',
        permission: Permissions.PRODUCTS.READ,
      },
      {
        id: 'brands',
        label: 'Brands',
        icon: 'tag',
        path: '/brands',
        permission: Permissions.BRANDS.READ,
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: 'category',
        path: '/categories',
        permission: Permissions.CATEGORIES.READ,
      },
      {
        id: 'bundles',
        label: 'Bundles',
        icon: 'package',
        path: '/bundles',
        permission: Permissions.BUNDLES.LIST,
      },
      {
        id: 'slabs',
        label: 'Slabs',
        icon: 'layers',
        path: '/slabs',
        permission: Permissions.SLABS.LIST,
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'people',
    permission: Permissions.USERS.READ,
    children: [
      {
        id: 'users-list',
        label: 'Users List',
        icon: 'person',
        path: '/users',
        permission: Permissions.USERS.READ,
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: 'shield',
        path: '/users/roles',
        permission: Permissions.ROLES.READ,
      },
    ],
  },
];
