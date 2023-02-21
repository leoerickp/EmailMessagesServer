import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { USERS } from './data/seed.data';

@Injectable()
export class SeedService {

    constructor(
        @InjectModel(User.name)
        private readonly usersModel: Model<User>,
        private readonly usersService: UsersService
    ) { }

    async executeSeed() {
        if (process.env.STATE !== 'dev') {
            throw new UnauthorizedException('This action is not authorized!')
        }
        await this.deleteDB();

        const user = await this.loadUsers();

        return 'Seed was loaded successfully!';
    }

    private async deleteDB() {
        await this.usersModel.deleteMany({});
    }

    private async loadUsers(): Promise<User> {
        const users = [];
        for (const user of USERS) {
            const { fullName, email, password } = user;
            users.push(await this.usersService.create({
                fullName,
                email,
                password,
            }));
        }

        return users[0];
    }
}
