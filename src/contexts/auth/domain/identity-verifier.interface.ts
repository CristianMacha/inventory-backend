export interface VerifiedIdentity {
  sub: string;
  email?: string;
  name?: string;
}

export interface IIdentityVerifier {
  verifyIdToken(idToken: string): Promise<VerifiedIdentity>;
}
