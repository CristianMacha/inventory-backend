import { Finish } from '../entities/finish';
import { FinishId } from '../value-objects/finish-id';

export interface IFinishRepository {
  findAll(): Promise<Finish[]>;
  findAllActive(): Promise<Finish[]>;
  findById(id: FinishId): Promise<Finish | null>;
  findByName(name: string): Promise<Finish | null>;
  save(finish: Finish): Promise<void>;
  count(): Promise<number>;
}
