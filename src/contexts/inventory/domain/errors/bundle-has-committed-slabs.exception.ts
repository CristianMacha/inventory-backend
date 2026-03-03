import { DomainException } from '@shared/domain/domain.exception';

export class BundleHasCommittedSlabsException extends DomainException {
  constructor(bundleId: string) {
    super(
      `Bundle "${bundleId}" cannot be unlinked from its invoice because it has slabs in SOLD or RESERVED status.`,
    );
  }
}
