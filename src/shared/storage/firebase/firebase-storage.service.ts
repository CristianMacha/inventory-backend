import * as fs from 'node:fs';
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { StorageResult } from '@shared/domain/storage/storage-result.interface';

@Injectable()
export class FirebaseStorageService {
  private readonly bucket: ReturnType<
    ReturnType<typeof admin.storage>['bucket']
  >;

  constructor(private readonly configService: ConfigService) {
    const bucketName = this.configService.get<string>(
      'FIREBASE_STORAGE_BUCKET',
    )!;
    const app = this.getOrInitApp();
    this.bucket = app.storage().bucket(bucketName);
  }

  private getOrInitApp(): admin.app.App {
    if (admin.apps.length > 0) return admin.apps[0]!;

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const credentialsPath = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );
    const serviceAccountJson = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_JSON',
    );

    const options: admin.AppOptions = { projectId };

    if (credentialsPath?.trim()) {
      const resolved = path.isAbsolute(credentialsPath.trim())
        ? credentialsPath.trim()
        : path.resolve(process.cwd(), credentialsPath.trim());
      options.credential = admin.credential.cert(
        JSON.parse(fs.readFileSync(resolved, 'utf-8')) as admin.ServiceAccount,
      );
    } else if (serviceAccountJson?.trim()) {
      options.credential = admin.credential.cert(
        JSON.parse(serviceAccountJson.trim()) as admin.ServiceAccount,
      );
    } else {
      options.credential = admin.credential.applicationDefault();
    }

    return admin.initializeApp(options);
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<StorageResult> {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = `${folder}/${fileName}`;
    const blob = this.bucket.file(filePath);

    await new Promise<void>((resolve, reject) => {
      const stream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });
      stream.on('error', reject);
      stream.on('finish', resolve);
      stream.end(file.buffer);
    });

    return { publicId: filePath, url: '' };
  }

  async getSignedUrl(filePath: string): Promise<string> {
    const expiresAt = Date.now() + 60 * 60 * 1000;
    const [url] = await this.bucket.file(filePath).getSignedUrl({
      action: 'read',
      expires: expiresAt,
    });
    return url;
  }

  async delete(filePath: string): Promise<void> {
    await this.bucket.file(filePath).delete({ ignoreNotFound: true });
  }
}
