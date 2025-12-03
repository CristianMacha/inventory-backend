import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

import { IHasher } from "../../domain/hasher.interface";

@Injectable()
export class BcryptHasherAdapter implements IHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}