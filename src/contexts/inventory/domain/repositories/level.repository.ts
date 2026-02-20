import { Level } from '../entities/level';
import { LevelId } from '../value-objects/level-id';

export interface ILevelRepository {
  findAll(): Promise<Level[]>;
  findAllActive(): Promise<Level[]>;
  findById(id: LevelId): Promise<Level | null>;
  findByName(name: string): Promise<Level | null>;
  save(level: Level): Promise<void>;
  count(): Promise<number>;
}
