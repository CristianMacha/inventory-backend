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
    CREATE: 'finishes.create',
    UPDATE: 'finishes.update',
    LIST: 'finishes.list',
  },
  LEVELS: {
    CREATE: 'levels.create',
    UPDATE: 'levels.update',
    LIST: 'levels.list',
  },
  SUPPLIERS: {
    CREATE: 'suppliers.create',
    UPDATE: 'suppliers.update',
    LIST: 'suppliers.list',
  },
  PURCHASE_INVOICES: {
    CREATE: 'purchase-invoices.create',
    READ: 'purchase-invoices.read',
    UPDATE: 'purchase-invoices.update',
    DELETE: 'purchase-invoices.delete',
  },
  JOBS: {
    CREATE: 'jobs.create',
    READ: 'jobs.read',
    UPDATE: 'jobs.update',
    DELETE: 'jobs.delete',
  },
  SETTINGS: {
    READ: 'settings.read',
  },
  PROFILE: {
    READ: 'profile.read',
  },
  DASHBOARD: {
    VIEW: 'dashboard.view',
  },
  SUPPLIER_RETURNS: {
    CREATE: 'supplier-returns.create',
    READ: 'supplier-returns.read',
    LIST: 'supplier-returns.list',
    UPDATE: 'supplier-returns.update',
    CANCEL: 'supplier-returns.cancel',
  },
  INVOICE_PAYMENTS: {
    CREATE: 'invoice-payments.create',
    READ: 'invoice-payments.read',
  },
  JOB_PAYMENTS: {
    CREATE: 'job-payments.create',
    READ: 'job-payments.read',
  },
  ACCOUNTING: {
    VIEW: 'accounting.view',
  },
  GENERAL_PAYMENTS: {
    CREATE: 'general-payments.create',
    READ: 'general-payments.read',
  },
} as const;

export type PermissionType =
  (typeof Permissions)[keyof typeof Permissions][keyof (typeof Permissions)[keyof typeof Permissions]];
