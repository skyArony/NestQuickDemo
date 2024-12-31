import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<User | null> {
    return User.findOneBy({ username });
  }
}
