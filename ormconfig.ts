import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { UserEntity } from './src/contexts/users/infrastructure/persistence/typeorm/entities/user.entity';
import { RefreshTokenEntity } from './src/contexts/auth/infrastructure/persistence/typeorm/entities/refresh-token.entity';
import { PermissionEntity } from './src/contexts/users/infrastructure/persistence/typeorm/entities/permission.entity';
import { RoleEntity } from './src/contexts/users/infrastructure/persistence/typeorm/entities/role.entity';

dotenv.config();

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [UserEntity, RefreshTokenEntity, RoleEntity, PermissionEntity],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: true,
};
const AppDataSource = new DataSource(config);

export default AppDataSource;