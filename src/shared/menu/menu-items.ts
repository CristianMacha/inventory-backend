import { MenuItem } from './menu-item.interface';
import { Permissions } from '@shared/authorization/permissions';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/dashboard',
    permission: Permissions.DASHBOARD.VIEW,
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
        id: 'finishes',
        label: 'Finishes',
        icon: 'finish',
        path: '/finishes',
        permission: Permissions.FINISHES.LIST,
      },
      {
        id: 'levels',
        label: 'Levels',
        icon: 'level',
        path: '/levels',
        permission: Permissions.LEVELS.LIST,
      },
      {
        id: 'suppliers',
        label: 'Suppliers',
        icon: 'supplier',
        path: '/suppliers',
        permission: Permissions.SUPPLIERS.LIST,
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
    id: 'purchasing',
    label: 'Purchasing',
    icon: 'receipt',
    permission: Permissions.PURCHASE_INVOICES.READ,
    children: [
      {
        id: 'purchase-invoices',
        label: 'Invoices',
        icon: 'receipt-long',
        path: '/purchase-invoices',
        permission: Permissions.PURCHASE_INVOICES.READ,
      },
      {
        id: 'supplier-returns',
        label: 'Supplier Returns',
        icon: 'assignment-return',
        path: '/purchasing/supplier-returns',
        permission: Permissions.SUPPLIER_RETURNS.LIST,
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'construction',
    permission: Permissions.JOBS.READ,
    children: [
      {
        id: 'jobs',
        label: 'Jobs',
        icon: 'work',
        path: '/jobs',
        permission: Permissions.JOBS.READ,
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
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    permission: Permissions.SETTINGS.READ,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'person',
    path: '/profile',
    permission: Permissions.PROFILE.READ,
  },
];
