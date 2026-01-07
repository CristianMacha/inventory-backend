import { IHasher } from '@shared/domain/hasher.interface';
import { Role } from './role';
import { UserId } from '@contexts/users/domain/value-objects/user-id';

export class User {
  private readonly _id: UserId;
  private _name: string;
  private _email: string;
  private readonly _password: string;
  private _roles: Role[];

  constructor(
    id: UserId,
    name: string,
    email: string,
    password: string,
    roles: Role[] = [],
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._roles = roles;
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

  async comparePassword(password: string, hasher: IHasher): Promise<boolean> {
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

  get password(): string {
    return this._password;
  }

  get roles(): Role[] {
    return this._roles;
  }
}
