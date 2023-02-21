import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignUpInput } from 'src/auth/dto/inputs';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';
import { PaginationArgs } from 'src/common/dto/args/pagination.arg';

@Injectable()
export class UsersService {
  private defaultLimit: number;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit'); // check env.config.ts
  }

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const user = await this.userModel.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10)
      });
      return user;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(validRoles: ValidRoles[], pagination: PaginationArgs): Promise<User[]> {
    const { limit = this.defaultLimit, offset = 0 } = pagination;

    if (!validRoles || validRoles.length === 0) {
      return await this.userModel.find()
        .limit(limit)
        .skip(offset);
    } else {
      return await this.userModel.find({ roles: validRoles })
        .limit(limit)
        .skip(offset);
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput, currentUser: User): Promise<User> {

    const userUpdated = await this.userModel.findByIdAndUpdate(id, { ...updateUserInput, lastUpdateBy: currentUser }, { new: true });
    if (!userUpdated) {
      throw new NotFoundException(`${id} not found`);
    }
    return userUpdated;

  }

  async block(id: string, currentUser: User): Promise<User> {
    return await this.update(id, { id, isActive: false }, currentUser);
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`"Experiencie" exists in db ${JSON.stringify(error.keyValue)}`)
    }
    if (error.status === 400) {
      throw new BadRequestException(error.response.message)
    }
    if (error.status === 404) {
      throw new NotFoundException(error.response.message)
    }
    throw new InternalServerErrorException(`Can't create "user" - Check server`);
  }
}
