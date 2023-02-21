import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { EmailMessagesService } from './email-messages.service';
import { EmailMessage } from './entities/email-message.entity';
import { ValidTray } from './enums/valid-tray.enum';


describe('EmailMessagesResolver', () => {
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
    let mockEmailMessagesModel: Model<EmailMessage>;
    let service: EmailMessagesService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailMessagesService, ConfigService,
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                },
                {
                    provide: getModelToken(EmailMessage.name),
                    useValue: Model
                },
            ],
            imports: [ConfigModule]
        }).compile();

        mockEmailMessagesModel = module.get<Model<EmailMessage>>(getModelToken(EmailMessage.name));
        service = module.get<EmailMessagesService>(EmailMessagesService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('Email message should be found', async () => {
        jest.spyOn(mockEmailMessagesModel, 'findById').mockResolvedValue(message);
        expect(await service.findOne('63f2cdeb8215b46e876faa06')).toBe(message);
    });

    it('Email message should be updated', async () => {
        const messageUpdated = { ...message, isRead: false, tray: ValidTray.recycle };
        jest.spyOn(mockEmailMessagesModel, 'findByIdAndUpdate').mockResolvedValueOnce({ ...message, isRead: false, tray: ValidTray.recycle });
        expect(await service.update('63f2cdeb8215b46e876faa06', message)).toEqual(messageUpdated);
    });

    it('Email message should be removed to recycle bin', async () => {
        jest.spyOn(mockEmailMessagesModel, 'findByIdAndUpdate').mockResolvedValueOnce({ ...message, tray: ValidTray.recycle });
        expect(await service.remove('63f2cdeb8215b46e876faa06')).toEqual({ ...message, tray: ValidTray.recycle });
    });

    it('Email message should be removed from database ', async () => {
        jest.spyOn(mockEmailMessagesModel, 'findById').mockResolvedValueOnce({ ...message, tray: ValidTray.recycle });
        jest.spyOn(mockEmailMessagesModel, 'findByIdAndDelete').mockResolvedValueOnce({ ...message, tray: ValidTray.recycle });
        expect(await service.remove('63f2cdeb8215b46e876faa06')).toEqual({ ...message, tray: ValidTray.recycle });
    });

    it('Email message should be created', async () => {
        jest.spyOn(mockEmailMessagesModel, 'create').mockImplementationOnce(() => message as never);
        expect(await service.create(message, user)).toEqual(message);
    });

});
