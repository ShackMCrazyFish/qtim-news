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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtServices: JwtService,
  ) {}

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

  async login(dto: AuthDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    const payload = { email: user.email, sub: user.id };
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      access_token: this.jwtServices.sign(payload),
    };
  }
}
