import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FirebaseStorageService } from './firebase/firebase-storage.service';
import { STORAGE_TOKENS } from './storage.tokens';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    { provide: STORAGE_TOKENS.CLOUDINARY_SERVICE, useClass: CloudinaryService },
    {
      provide: STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE,
      useClass: FirebaseStorageService,
    },
  ],
  exports: [
    STORAGE_TOKENS.CLOUDINARY_SERVICE,
    STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE,
  ],
})
export class StorageModule {}
