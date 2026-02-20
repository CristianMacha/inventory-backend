import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  IIdentityVerifier,
  VerifiedIdentity,
} from '@contexts/auth/domain/identity-verifier.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

/**
 * Firebase credentials (use one of the two):
 *
 * 1. GOOGLE_APPLICATION_CREDENTIALS = path to the service account JSON file.
 *    - Relative to process cwd: ./service-account.json or ../path/service-account.json
 *    - Or absolute: /full/path/to/service-account.json
 *
 * 2. FIREBASE_SERVICE_ACCOUNT_JSON = full JSON content of the file as a string
 *    (for serverless where you cannot use a file). Not a path.
 */
@Injectable()
export class FirebaseIdentityVerifier implements IIdentityVerifier {
  constructor(private readonly configService: ConfigService) {}

  async verifyIdToken(idToken: string): Promise<VerifiedIdentity> {
    const app = this.getOrInitApp();
    const decoded = await app.auth().verifyIdToken(idToken);
    return {
      sub: decoded.uid,
      email: decoded.email ?? undefined,
      name: (decoded.name as string | undefined) ?? undefined,
    };
  }

  private getOrInitApp(): admin.app.App {
    const existing = admin.apps[0];
    if (existing) return existing;

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const credentialsPath = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );
    const serviceAccountJson = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_JSON',
    );

    const options: admin.AppOptions = { projectId };

    if (credentialsPath?.trim()) {
      const resolvedPath = path.isAbsolute(credentialsPath.trim())
        ? credentialsPath.trim()
        : path.resolve(process.cwd(), credentialsPath.trim());
      try {
        const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
        const parsed = JSON.parse(fileContent) as admin.ServiceAccount;
        options.credential = admin.credential.cert(parsed);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(
          `GOOGLE_APPLICATION_CREDENTIALS: could not load file at "${resolvedPath}" (cwd: ${process.cwd()}). ${msg}`,
        );
      }
    } else if (serviceAccountJson?.trim()) {
      try {
        const parsed = JSON.parse(
          serviceAccountJson.trim(),
        ) as admin.ServiceAccount;
        options.credential = admin.credential.cert(parsed);
      } catch {
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT_JSON must be the full JSON content of the service account file, not a path. To use a file, set GOOGLE_APPLICATION_CREDENTIALS to the file path (e.g. ./service-account.json).',
        );
      }
    } else {
      options.credential = admin.credential.applicationDefault();
    }

    return admin.initializeApp(options);
  }
}
