import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ValidTray } from 'src/email-messages/enums/valid-tray.enum';
import { User } from 'src/users/entities/user.entity';
import { MessagesWsService } from './messages-ws.service';

describe('MessagesWsService', () => {
    const message = {
        id: "63f2cdeb8215b46e876faa06",
        cc: null,
        createdAt: new Date(),
        from: "erick@google.com",
        isRead: true,
        message: "sdfgsdfgsdf fgsdfgsdfgs fsdfgsdfgsdfg",
        subject: "dfgsdfgsdf dfdfgsdfgsd ",
        to: [
            "leoerickp@gmail.com"
        ],
        tray: ValidTray.inbox
    }
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
    let mockUsersModel: Model<User>;
    let service: MessagesWsService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessagesWsService,
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                },
            ],
            imports: []
        }).compile();

        mockUsersModel = module.get<Model<User>>(getModelToken(User.name));
        service = module.get<MessagesWsService>(MessagesWsService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });
});
