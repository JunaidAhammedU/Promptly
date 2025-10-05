import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository';
import { ConflictException } from 'src/common';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) { }
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.checkUserAlreadyExist(createUserDto.email);
    if (user) {
      throw new ConflictException('User already exists, with same email', [
        {
          field: 'email',
          message: 'This email is already registered',
          value: createUserDto.email,
        },
      ]);
    }
    const newUser = await this.usersRepository.createUser(createUserDto);
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
