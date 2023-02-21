import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserSchema } from '../users/entities/user.entity';
import { ValidRoles } from '../users/enums/valid-roles.enum';

describe('AuthResolver', () => {
    const user = {
        _id: '123456789',
        email: "leoerickp@gmail.com",
        fullName: "Leo Erick Pereyra Rodriguez",
        isActive: true,
        roles: [
            "user"
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        password: '123456,'
    };
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTk5YjE3M2Y0NWU5NzVhYjAzMDg1YiIsImlhdCI6MTY3NjkxODI1MiwiZXhwIjoxNjc3MjYzODUyfQ.EWvc5B5FRKI6iRaZw8HbZ86ENvmIwxQhpXQZxCwd8us";
    const authResponse = {
        token,
        user
    }
    let mockUserModel: Model<User>;
    let resolver: AuthResolver;
    let service: AuthService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver, AuthService, UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                },
            ],
            imports: [ConfigModule, JwtModule, PassportModule]
        }).compile();

        mockUserModel = module.get<Model<User>>(getModelToken(User.name));
        resolver = module.get<AuthResolver>(AuthResolver);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', async () => {
        expect(resolver).toBeDefined();
    });

    it('should be revalidate the token', () => {
        jest.spyOn(service, 'revalidateToken').mockImplementation(() => authResponse);
        expect(resolver.revalidateToken(user)).toEqual(authResponse);
    });

    it('should be logged', async () => {
        const { email, password } = user;
        jest.spyOn(service, 'login').mockResolvedValue(authResponse);
        expect(await resolver.login({ email, password })).toBe(authResponse);
    });

    it('should be signed up', async () => {
        const { email, password, fullName } = user;
        jest.spyOn(service, 'signUp').mockResolvedValue(authResponse);
        expect(await resolver.signUp({ email, password, fullName })).toBe(authResponse);
    });
});
