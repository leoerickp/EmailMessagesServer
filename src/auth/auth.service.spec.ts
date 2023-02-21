import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
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
    let usersService: UsersService;
    let service: AuthService;
    let jwtService: JwtService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                },
            ],
            imports: [ConfigModule, JwtModule]
        }).compile();

        mockUserModel = module.get<Model<User>>(getModelToken(User.name));
        usersService = module.get<UsersService>(UsersService);
        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should be get a token', () => {
        jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
        expect(service.getJwtToken('123456')).toEqual(token);
    });

    it('should be revalidate the token', () => {
        jest.spyOn(service, 'getJwtToken').mockImplementation(() => token);
        expect(service.revalidateToken(user)).toEqual(authResponse);
    });

    it('should be validate one user', async () => {
        jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
        expect(await service.validateUser('123456789')).toBe(user);
    });

    it('should be logged', async () => {
        const { email, password } = user;
        jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);
        jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
        expect(await service.login({ email, password })).toEqual(authResponse);
    });

    it('should be signed up', async () => {
        const { email, password, fullName } = user;
        jest.spyOn(usersService, 'create').mockResolvedValue(user);
        jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
        expect(await service.signUp({ email, fullName, password })).toEqual(authResponse);
    });


});
