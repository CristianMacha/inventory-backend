import { IHasher } from "../../../../shared/domain/hasher.interface";

export class User {
  private id: string;
  private name: string;
  private email: string;
  private password: string;


  constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async create(id: string, name: string, email: string, password: string, hasher: IHasher): Promise<User> {
    const hashedPassword = await hasher.hash(password);
    return new User(id, name, email, hashedPassword);
  }

  async comparePassword(password: string, hasher: IHasher): Promise<boolean> {
    return await hasher.compare(password, this.password);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public updateEmail(email: string): void {
    if (email === this.email) return;
    this.email = email;
  }
}