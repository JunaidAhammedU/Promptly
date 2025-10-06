import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repository';
import { ConflictException, NotFoundException } from 'src/common';

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

  async findOne(id: string) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found', [
        {
          field: 'id',
          message: 'User with this ID does not exist',
          value: id,
        },
      ]);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found', [
        {
          field: 'id',
          message: 'User with this ID does not exist',
          value: id,
        },
      ]);
    }
    const existingUser = await this.usersRepository.checkUserAlreadyExist(updateUserDto?.email as string);
    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('User already exists, with same email', [
        {
          field: 'email',
          message: 'This email is already registered',
          value: updateUserDto.email,
        },
      ]);
    }
    const updateUser = await this.usersRepository.updateUser(id, updateUserDto);
    return updateUser;
  }

  async remove(id: string) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found', [
        {
          field: 'id',
          message: 'User with this ID does not exist',
          value: id,
        },
      ]);
    }
    return `This action removes a #${id} user`;
  }
}
