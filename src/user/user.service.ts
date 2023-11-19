import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto copy';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create({
    name,
    email,
    password,
    birthAt,
    role,
  }: createUserDTO): Promise<UserEntity> {
    try {
      const isEmailExist = await this.emailExists(email);

      if (isEmailExist) {
        throw new BadRequestException('Email already exists');
      }

      const salt = await bcrypt.genSalt();

      const hashPassword = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        name,
        email,
        user_password: hashPassword,
        role,
        birthAt,
      });

      return this.usersRepository.save(user);
    } catch (e) {
      return e;
    }
  }

  async readAll() {
    // quando você da o retorno diretamente em uma promise, automaticamente ele já adiciona o await junto com o return
    return this.usersRepository.find();
  }

  async readOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  async update(
    id: number,
    { name, email, password, birthAt, role }: UpdatePutUserDTO,
  ) {
    await this.userExists(id);

    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    await this.usersRepository.update(id, {
      name,
      email,
      user_password: hashPassword,
      birthAt,
      role,
    });

    const user = await this.readOne(id);

    return user;
  }

  async updatePartial(
    id: number,
    { name, email, password, birthAt, role }: UpdatePatchUserDTO,
  ) {
    await this.userExists(id);

    if (password) {
      const salt = await bcrypt.genSalt();

      password = await bcrypt.hash(password, salt);
    }

    await this.usersRepository.update(id, {
      name,
      email,
      user_password: password,
      birthAt,
      role,
    });

    const user = await this.readOne(id);

    return user;
  }

  async delete(id: number) {
    await this.userExists(id);

    try {
      await this.usersRepository.delete(id);

      return true;
    } catch {
      return false;
    }
  }

  async userExists(id: number) {
    const isUserExist = await this.usersRepository.exist({
      where: {
        id,
      },
    });

    if (!isUserExist) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }

  async emailExists(email: string) {
    return this.usersRepository.exist({
      where: {
        email,
      },
    });
  }
}
