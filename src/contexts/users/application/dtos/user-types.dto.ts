export class UserListDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roles: string[],
  ) {}
}

export class AuthUserDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roles: string[],
    public readonly permissions: string[],
  ) {}
}
