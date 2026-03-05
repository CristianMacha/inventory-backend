import { v4 as uuidv4 } from 'uuid';
import AppDataSource from '../../ormconfig';
import { PermissionEntity } from '@contexts/users/infrastructure/persistence/typeorm/entities/permission.entity';
import { RoleEntity } from '@contexts/users/infrastructure/persistence/typeorm/entities/role.entity';
import { Permissions } from '../shared/authorization/permissions';

const ADMIN_ROLE_NAME = 'admin';

const PERMISSIONS = [
  // Users
  { name: Permissions.USERS.CREATE, description: 'Create new users' },
  { name: Permissions.USERS.READ, description: 'View users list' },
  { name: Permissions.USERS.UPDATE, description: 'Update user details' },
  { name: Permissions.USERS.DELETE, description: 'Delete users' },
  // Roles
  { name: Permissions.ROLES.CREATE, description: 'Create new roles' },
  { name: Permissions.ROLES.READ, description: 'View roles list' },
  { name: Permissions.ROLES.UPDATE, description: 'Update role details' },
  { name: Permissions.ROLES.DELETE, description: 'Delete roles' },
  // Brands
  { name: Permissions.BRANDS.CREATE, description: 'Create new brands' },
  { name: Permissions.BRANDS.READ, description: 'View brands list' },
  { name: Permissions.BRANDS.UPDATE, description: 'Update brand details' },
  { name: Permissions.BRANDS.DELETE, description: 'Delete brands' },
  // Categories
  { name: Permissions.CATEGORIES.CREATE, description: 'Create new categories' },
  { name: Permissions.CATEGORIES.READ, description: 'View categories list' },
  {
    name: Permissions.CATEGORIES.UPDATE,
    description: 'Update category details',
  },
  { name: Permissions.CATEGORIES.DELETE, description: 'Delete categories' },
  // Products
  { name: Permissions.PRODUCTS.CREATE, description: 'Create new products' },
  { name: Permissions.PRODUCTS.READ, description: 'View products list' },
  { name: Permissions.PRODUCTS.UPDATE, description: 'Update product details' },
  { name: Permissions.PRODUCTS.DELETE, description: 'Delete products' },
  // Permissions
  {
    name: Permissions.PERMISSIONS.CREATE,
    description: 'Create new permissions',
  },
  { name: Permissions.PERMISSIONS.READ, description: 'View permissions list' },
  {
    name: Permissions.PERMISSIONS.UPDATE,
    description: 'Update permission details',
  },
  { name: Permissions.PERMISSIONS.DELETE, description: 'Delete permissions' },
  // Bundles
  { name: Permissions.BUNDLES.CREATE, description: 'Create new bundles' },
  { name: Permissions.BUNDLES.READ, description: 'View bundles details' },
  { name: Permissions.BUNDLES.UPDATE, description: 'Update bundle details' },
  { name: Permissions.BUNDLES.DELETE, description: 'Delete bundles' },
  { name: Permissions.BUNDLES.LIST, description: 'List bundles' },
  // Slabs
  { name: Permissions.SLABS.CREATE, description: 'Create new slabs' },
  { name: Permissions.SLABS.READ, description: 'View slabs details' },
  { name: Permissions.SLABS.UPDATE, description: 'Update slab details' },
  { name: Permissions.SLABS.DELETE, description: 'Delete slabs' },
  { name: Permissions.SLABS.LIST, description: 'List slabs' },
  // Finishes
  { name: Permissions.FINISHES.LIST, description: 'List finishes' },
  { name: Permissions.FINISHES.CREATE, description: 'Create new finishes' },
  { name: Permissions.FINISHES.UPDATE, description: 'Update finish details' },
  // Levels
  { name: Permissions.LEVELS.LIST, description: 'List levels' },
  { name: Permissions.LEVELS.CREATE, description: 'Create new levels' },
  { name: Permissions.LEVELS.UPDATE, description: 'Update level details' },
  // Suppliers
  { name: Permissions.SUPPLIERS.LIST, description: 'List suppliers' },
  { name: Permissions.SUPPLIERS.CREATE, description: 'Create new suppliers' },
  {
    name: Permissions.SUPPLIERS.UPDATE,
    description: 'Update supplier details',
  },
  // Purchase Invoices
  {
    name: Permissions.PURCHASE_INVOICES.CREATE,
    description: 'Create purchase invoices',
  },
  {
    name: Permissions.PURCHASE_INVOICES.READ,
    description: 'View purchase invoices',
  },
  {
    name: Permissions.PURCHASE_INVOICES.UPDATE,
    description: 'Update purchase invoices',
  },
  {
    name: Permissions.PURCHASE_INVOICES.DELETE,
    description: 'Delete purchase invoices',
  },
  // Jobs
  { name: Permissions.JOBS.CREATE, description: 'Create jobs' },
  { name: Permissions.JOBS.READ, description: 'View jobs' },
  { name: Permissions.JOBS.UPDATE, description: 'Update jobs' },
  { name: Permissions.JOBS.DELETE, description: 'Delete jobs' },
  // Supplier Returns
  {
    name: Permissions.SUPPLIER_RETURNS.CREATE,
    description: 'Create supplier returns',
  },
  {
    name: Permissions.SUPPLIER_RETURNS.READ,
    description: 'View supplier return details',
  },
  {
    name: Permissions.SUPPLIER_RETURNS.LIST,
    description: 'List supplier returns',
  },
  {
    name: Permissions.SUPPLIER_RETURNS.UPDATE,
    description: 'Update supplier returns',
  },
  {
    name: Permissions.SUPPLIER_RETURNS.CANCEL,
    description: 'Cancel supplier returns',
  },
  // Invoice Payments
  {
    name: Permissions.INVOICE_PAYMENTS.CREATE,
    description: 'Record payments for purchase invoices',
  },
  {
    name: Permissions.INVOICE_PAYMENTS.READ,
    description: 'View invoice payment history',
  },
  // Job Payments
  {
    name: Permissions.JOB_PAYMENTS.CREATE,
    description: 'Record client payments for jobs',
  },
  {
    name: Permissions.JOB_PAYMENTS.READ,
    description: 'View job payment history',
  },
  // General Payments
  {
    name: Permissions.GENERAL_PAYMENTS.CREATE,
    description: 'Record general payments (income or expense)',
  },
  {
    name: Permissions.GENERAL_PAYMENTS.READ,
    description: 'View general payments history',
  },
  // Accounting
  {
    name: Permissions.ACCOUNTING.VIEW,
    description: 'View cashflow and accounting summary',
  },
  // Settings
  { name: Permissions.SETTINGS.READ, description: 'Read settings' },
  // Profile
  { name: Permissions.PROFILE.READ, description: 'Read profile' },
  // Dashboard
  { name: Permissions.DASHBOARD.VIEW, description: 'View dashboard summary' },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding...');

  try {
    const permissionRepo = AppDataSource.getRepository(PermissionEntity);
    const roleRepo = AppDataSource.getRepository(RoleEntity);

    // Upsert all permissions
    const permissionEntities: PermissionEntity[] = [];
    for (const p of PERMISSIONS) {
      let entity = await permissionRepo.findOneBy({ name: p.name });
      if (!entity) {
        entity = await permissionRepo.save(
          permissionRepo.create({
            id: uuidv4(),
            name: p.name,
            description: p.description,
          }),
        );
        console.log(`Created permission: ${p.name}`);
      } else {
        console.log(`Permission already exists: ${p.name}`);
      }
      permissionEntities.push(entity);
    }

    // Upsert admin role with all permissions
    let adminRole = await roleRepo.findOne({
      where: { name: ADMIN_ROLE_NAME },
      relations: ['permissions'],
    });

    if (!adminRole) {
      adminRole = roleRepo.create({ id: uuidv4(), name: ADMIN_ROLE_NAME });
      console.log(`Created role: ${ADMIN_ROLE_NAME}`);
    } else {
      console.log(`Role already exists: ${ADMIN_ROLE_NAME}`);
    }

    adminRole.permissions = permissionEntities;
    await roleRepo.save(adminRole);
    console.log(
      `Assigned ${permissionEntities.length} permissions to role "${ADMIN_ROLE_NAME}".`,
    );

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
