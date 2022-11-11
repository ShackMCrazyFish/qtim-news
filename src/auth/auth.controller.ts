import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<User> {
    return this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: AuthDto): Promise<User> {
    return this.authService.login(dto);
  }
}
