import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEmailMessageInput, UpdateEmailMessageInput } from './dto/inputs';
import { EmailMessage } from './entities/email-message.entity';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { ValidTray } from './enums/valid-tray.enum';
import { DestinationsResult } from './interfaces/destinations.interface';
import { EmailClass } from './dto/args/email-class.arg';
import { PaginationArgs } from 'src/common/dto/args/pagination.arg';

@Injectable()
export class EmailMessagesService {
  private adminEmail: string;
  constructor(
    @InjectModel(EmailMessage.name)
    private readonly emailMessagesModel: Model<EmailMessage>,
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
    private readonly configService: ConfigService
  ) {
    this.adminEmail = this.configService.get<string>('adminEmail');
  }

  async create(createEmailMessageInput: CreateEmailMessageInput, user: User): Promise<EmailMessage> {
    try {

      const emailMessage = await this.emailMessagesModel.create({
        ...createEmailMessageInput,
        from: user.email,
        user
      });
      return emailMessage;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async saveEmailDestination(createEmailMessageInput: CreateEmailMessageInput, from: string, toUser: User): Promise<EmailMessage> {
    const emailMessage = await this.emailMessagesModel.create({
      ...createEmailMessageInput,
      from,
      user: toUser,
      isRead: false,
      tray: ValidTray.inbox
    });
    return emailMessage;
  }

  private async createEmailDestinations(createEmailMessageInput: CreateEmailMessageInput, user: User, emailUsers: EmailClass[] | string[]): Promise<DestinationsResult> {

    let emailErrorUsers = [];
    let successEmails: EmailMessage[] = [];

    for (const email of emailUsers) {
      const userDestination = await this.usersModel.findOne({ email });
      if (!userDestination) {
        emailErrorUsers.push(email);
        break;
      }
      successEmails.push(await this.saveEmailDestination(createEmailMessageInput, user.email, userDestination));
    }

    return { successEmails, emailErrorUsers }
  }

  async deliverEmailToDestinations(createEmailMessageInput: CreateEmailMessageInput, user: User): Promise<DestinationsResult> {
    const { to, cc } = createEmailMessageInput;
    try {
      let { successEmails, emailErrorUsers } = await this.createEmailDestinations(createEmailMessageInput, user, to);

      if (cc) {
        const {
          successEmails: successUsersCC,
          emailErrorUsers: errorsUsersCC
        } = await this.createEmailDestinations(createEmailMessageInput, user, cc);

        successEmails.push(...successUsersCC);
        emailErrorUsers.push(...errorsUsersCC);
      }

      return { successEmails, emailErrorUsers }

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deliverEmailError(emailErrorUsers: string[], user: User,): Promise<EmailMessage | null> {
    if (emailErrorUsers.length === 0) return null;

    return await this.saveEmailDestination({
      to: [user.email],
      subject: 'Delivery Status Notification (Failure)',
      message: `The following emails can not delivered successfully: \n` + emailErrorUsers.map(email => `${email} \n`)
    }, this.adminEmail, user)
  }

  async findAll(tray: ValidTray, pagination: PaginationArgs, user: User): Promise<EmailMessage[]> {
    const { limit, offset } = pagination;
    const emailMessages = await this.emailMessagesModel.find({ tray, user })
      .limit(limit)
      .skip(offset)
      .sort({ 'createdAt': 'desc' });
    return emailMessages;
  }

  async countAll(tray: ValidTray, user: User) {
    return await this.emailMessagesModel.find({ tray, user }).count();
  }

  async findOne(id: string): Promise<EmailMessage> {
    const emailMessage = await this.emailMessagesModel.findById(id);
    if (!emailMessage) {
      throw new NotFoundException(`${id} not found`);
    }
    return emailMessage;
  }

  async update(id: string, updateEmailMessageInput: UpdateEmailMessageInput): Promise<EmailMessage> {
    const emailMessageUpdated = await this.emailMessagesModel.findByIdAndUpdate(
      id,
      {
        ...updateEmailMessageInput
      },
      { new: true }
    );
    if (!emailMessageUpdated) {
      throw new NotFoundException(`${id} not found`);
    }
    return emailMessageUpdated;
  }

  async remove(id: string): Promise<EmailMessage> {
    const emailMessage = await this.findOne(id);
    if (emailMessage?.tray !== ValidTray.recycle) {
      return await this.update(id, { id, tray: ValidTray.recycle });
    }
    return await this.emailMessagesModel.findByIdAndDelete(id);
  }

  private handleExceptions(error: any) {
    console.log(error);
    if (error.code === 11000) {
      throw new BadRequestException(`"Experiencie" exists in db ${JSON.stringify(error.keyValue)}`)
    }
    if (error.status === 400) {
      throw new BadRequestException(error.response.message)
    }
    if (error.status === 404) {
      throw new NotFoundException(error.response.message)
    }
    throw new InternalServerErrorException(`Can't create "email message" - Check server`);
  }
}
