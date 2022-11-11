import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  async login(dto: AuthDto): Promise<User> {
    const user = this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}
