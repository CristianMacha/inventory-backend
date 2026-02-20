export const Permissions = {
  USERS: {
    CREATE: 'users.create',
    READ: 'users.read',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
  },
  ROLES: {
    CREATE: 'roles.create',
    READ: 'roles.read',
    UPDATE: 'roles.update',
    DELETE: 'roles.delete',
  },
  BRANDS: {
    CREATE: 'brands.create',
    READ: 'brands.read',
    UPDATE: 'brands.update',
    DELETE: 'brands.delete',
  },
  CATEGORIES: {
    CREATE: 'categories.create',
    READ: 'categories.read',
    UPDATE: 'categories.update',
    DELETE: 'categories.delete',
  },
  PRODUCTS: {
    CREATE: 'products.create',
    READ: 'products.read',
    UPDATE: 'products.update',
    DELETE: 'products.delete',
  },
  PERMISSIONS: {
    CREATE: 'permissions.create',
    READ: 'permissions.read',
    UPDATE: 'permissions.update',
    DELETE: 'permissions.delete',
  },
  BUNDLES: {
    CREATE: 'bundles.create',
    READ: 'bundles.read',
    UPDATE: 'bundles.update',
    DELETE: 'bundles.delete',
    LIST: 'bundles.list',
  },
  SLABS: {
    CREATE: 'slabs.create',
    READ: 'slabs.read',
    UPDATE: 'slabs.update',
    DELETE: 'slabs.delete',
    LIST: 'slabs.list',
  },
  FINISHES: {
    LIST: 'finishes.list',
  },
  LEVELS: {
    LIST: 'levels.list',
  },
  SUPPLIERS: {
    LIST: 'suppliers.list',
  },
} as const;

export type PermissionType =
  (typeof Permissions)[keyof typeof Permissions][keyof (typeof Permissions)[keyof typeof Permissions]];
