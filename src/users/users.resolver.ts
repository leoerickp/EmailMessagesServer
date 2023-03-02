import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs } from '../common/dto/args/pagination.arg';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @Args() pagination: PaginationArgs
  ): Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles, pagination);
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }, ParseMongoIdPipe) id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User
  ): Promise<User> {
    return await this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser(
    @Args('id', { type: () => String }, ParseMongoIdPipe) id: string,
    @CurrentUser() user: User
  ): Promise<User> {
    return await this.usersService.block(id, user);
  }

  @ResolveField(() => User, { name: 'lastUpdateBy' })
  async getLastUpdateBy(
    @Parent() parentUser: User,
  ) {
    if (!parentUser.lastUpdateBy) {
      return parentUser;
    }
    return await this.usersService.findOne(parentUser.lastUpdateBy._id);
  }

}
