import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const salt = genSaltSync(4);
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      throw new InternalServerErrorException(
        'Пользователь с таким email уже существует',
      );
    }
    const user = new User();
    user.email = dto.email;
    user.passwordHash = hashSync(dto.password, salt);

    return this.userRepository.save(user);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
