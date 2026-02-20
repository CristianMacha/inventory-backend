import { DomainException } from '../domain.exception';

export class ResourceNotFoundException extends DomainException {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`);
    this.name = 'ResourceNotFoundException';
  }
}
