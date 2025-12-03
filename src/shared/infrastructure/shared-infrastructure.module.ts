import { Module, Provider } from "@nestjs/common";
import { UuidGeneratorAdapter } from "./uuid/uuid-generator.adapter";
import { BcryptHasherAdapter } from "./hasher/bcrypt-hasher.adapter";


const UtilityProviders: Provider[] = [
  {
    provide: 'UuidGenerator',
    useClass: UuidGeneratorAdapter
  },
  {
    provide: 'Hasher',
    useClass: BcryptHasherAdapter
  }
];

@Module({
  providers: UtilityProviders,
  exports: UtilityProviders,
})
export class SharedInfrastructureModule { }