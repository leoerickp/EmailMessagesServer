import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignUpInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    getJwtToken(userId: string) {
        return this.jwtService.sign({ id: userId });
    }

    async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
        const user = await this.usersService.create(signUpInput);
        const token = this.getJwtToken(user._id);
        return { token, user };
    }
    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);
        if (!bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Email / Password do not match');
        }

        const token = this.getJwtToken(user._id);
        return { token, user }
    }
    revalidateToken(user: User): AuthResponse {
        const token = this.getJwtToken(user._id);
        return { token, user }
    }
    async validateUser(id: string): Promise<User> {
        const user = await this.usersService.findOne(id);

        if (!user.isActive)
            throw new UnauthorizedException(`Use is inactive, talk with an admin`);

        delete user.password;

        return user;
    }
}
