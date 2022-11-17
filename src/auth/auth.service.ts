import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const hashedPass = hashSync(pass, user.salt);

    if (user.password !== hashedPass) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async register(dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  async login(dto: AuthDto): Promise<User> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const password = hashSync(dto.password, user.salt);

    if (user.password !== password) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
