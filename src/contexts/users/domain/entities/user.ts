import { IHasher } from '@shared/domain/hasher.interface';
import { Role } from './role';
import { UserId } from '@contexts/users/domain/value-objects/user-id';

/** Identity from an external provider (e.g. Firebase); same shape as auth VerifiedIdentity. */
export interface ProviderIdentity {
  sub: string;
  email?: string;
  name?: string;
}

const FIREBASE_PROVIDER = 'firebase' as const;

export class User {
  private readonly _id: UserId;
  private _name: string;
  private _email: string;
  private readonly _password: string | null;
  private _roles: Role[];
  private readonly _externalId: string | null;
  private readonly _provider: typeof FIREBASE_PROVIDER | null;

  constructor(
    id: UserId,
    name: string,
    email: string,
    password: string | null,
    roles: Role[] = [],
    externalId: string | null = null,
    provider: typeof FIREBASE_PROVIDER | null = null,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._roles = roles;
    this._externalId = externalId;
    this._provider = provider;
  }

  static async create(
    name: string,
    email: string,
    password: string,
    hasher: IHasher,
    roles: Role[] = [],
  ): Promise<User> {
    const hashedPassword = await hasher.hash(password);
    return new User(UserId.generate(), name, email, hashedPassword, roles);
  }

  static createFromProvider(
    identity: ProviderIdentity,
    roles: Role[] = [],
  ): User {
    const name = identity.name ?? identity.email ?? identity.sub;
    const email = identity.email ?? `${identity.sub}@firebase.local`;
    return new User(
      UserId.generate(),
      name,
      email,
      null,
      roles,
      identity.sub,
      FIREBASE_PROVIDER,
    );
  }

  async comparePassword(password: string, hasher: IHasher): Promise<boolean> {
    if (this._password === null) return false;
    return await hasher.compare(password, this._password);
  }

  public updateName(name: string): void {
    this._name = name;
  }

  public updateEmail(email: string): void {
    if (email === this.email) return;
    this._email = email;
  }

  public updateRoles(roles: Role[]): void {
    this._roles = roles;
  }

  public hasPermission(permissionName: string): boolean {
    return this.roles.some((role) => role.hasPermission(permissionName));
  }

  get id(): UserId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | null {
    return this._password;
  }

  get roles(): Role[] {
    return this._roles;
  }

  get externalId(): string | null {
    return this._externalId;
  }

  get provider(): typeof FIREBASE_PROVIDER | null {
    return this._provider;
  }
}
