import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

describe('UsersService', () => {
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
    let mockUserModel: Model<User>;
    let service: UsersService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                },
            ],
            imports: [ConfigModule]
        }).compile();

        mockUserModel = module.get<Model<User>>(getModelToken(User.name));
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('User should be found', async () => {
        jest.spyOn(mockUserModel, 'findById').mockResolvedValue(user);
        expect(await service.findOne('123456')).toBe(user);
    });

    it('User should be updated and blocked', async () => {
        const userBlocked = { ...user, isActive: false };
        jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue({ ...user, isActive: false });
        expect(await service.block('123456789', user)).toEqual(userBlocked);
    });

    it('User should be created', async () => {
        jest.spyOn(mockUserModel, 'create').mockResolvedValue(user as never);
        expect(await service.create(user)).toEqual(user);
    });

    it('User should be found by email', async () => {
        jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(user);
        expect(await service.findOneByEmail('leoerickp@gmail.com')).toEqual(user);
    });
});
