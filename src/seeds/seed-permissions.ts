import { v4 as uuidv4 } from 'uuid';
import AppDataSource from '../../ormconfig';
import { PermissionEntity } from '@contexts/users/infrastructure/persistence/typeorm/entities/permission.entity';
import { Permissions } from '../shared/authorization/permissions';

const PERMISSIONS = [
  { name: Permissions.USERS.CREATE, description: 'Create new users' },
  { name: Permissions.USERS.READ, description: 'View users list' },
  { name: Permissions.USERS.UPDATE, description: 'Update user details' },
  { name: Permissions.USERS.DELETE, description: 'Delete users' },
  { name: Permissions.ROLES.CREATE, description: 'Create new roles' },
  { name: Permissions.ROLES.READ, description: 'View roles list' },
  { name: Permissions.ROLES.UPDATE, description: 'Update role details' },
  { name: Permissions.ROLES.DELETE, description: 'Delete roles' },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected for seeding...');

  try {
    const repo = AppDataSource.getRepository(PermissionEntity);

    for (const p of PERMISSIONS) {
      const existing = await repo.findOneBy({ name: p.name });
      if (!existing) {
        await repo.save({
          id: uuidv4(),
          name: p.name,
          description: p.description,
        });
        console.log(`Created permission: ${p.name}`);
      } else {
        console.log(`Permission already exists: ${p.name}`);
      }
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
