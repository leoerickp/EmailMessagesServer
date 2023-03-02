import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginInput, SignUpInput } from './dto/inputs';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { AuthResponse } from './types/auth-response.type';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthResponse, { name: 'signUp' })
  async signUp(
    @Args('signupInput') signUpInput: SignUpInput
  ): Promise<AuthResponse> {
    return await this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {
    return await this.authService.login(loginInput);
  }

  @Query(() => AuthResponse)
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser() user: User
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
