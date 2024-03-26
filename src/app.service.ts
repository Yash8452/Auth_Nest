import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(data: any): Promise<User> {
    return this.userRepository.save(data);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: any): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(id: any, updateUserData: any): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(existingUser, updateUserData);

    return this.userRepository.save(existingUser);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
