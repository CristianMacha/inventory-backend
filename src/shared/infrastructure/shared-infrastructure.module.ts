import { Module, Provider } from '@nestjs/common';
import { UuidGeneratorAdapter } from './uuid/uuid-generator.adapter';
import { BcryptHasherAdapter } from './hasher/bcrypt-hasher.adapter';
import { SHARED_TOKENS } from '@shared/shared.tokens';

const UtilityProviders: Provider[] = [
  {
    provide: SHARED_TOKENS.UUID_GENERATOR,
    useClass: UuidGeneratorAdapter,
  },
  {
    provide: SHARED_TOKENS.HASHER,
    useClass: BcryptHasherAdapter,
  },
];

@Module({
  providers: UtilityProviders,
  exports: UtilityProviders,
})
export class SharedInfrastructureModule {}
