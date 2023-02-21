import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
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
    let resolver: UsersResolver;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersResolver, UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                },
            ],
            imports: [ConfigModule]
        }).compile();

        resolver = module.get<UsersResolver>(UsersResolver);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', async () => {
        expect(resolver).toBeDefined();
    });

    it('User should be found', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(user);
        expect(await resolver.findOne('123456')).toBe(user);
    });

    it('User should be updated and blocked', async () => {
        const userBlocked = { ...user, isActive: false };
        jest.spyOn(service, 'update').mockResolvedValue({ ...user, isActive: false });
        expect(await resolver.updateUser({ id: '123456789' }, user)).toEqual(userBlocked);
    });

    it('User should be show email list', async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue([user]);
        expect(await resolver.findAll({}, {})).toEqual([user]);
    });
});
