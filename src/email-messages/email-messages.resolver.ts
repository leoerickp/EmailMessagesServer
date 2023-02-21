import { Resolver, Query, Mutation, Args, Int, ArgsType } from '@nestjs/graphql';
import { EmailMessagesService } from './email-messages.service';
import { EmailMessage } from './entities/email-message.entity';
import { CreateEmailMessageInput, UpdateEmailMessageInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.arg';
import { ValidTrayArgs } from './dto/args/tray.arg';
import { MessagesWsGateway } from '../messages-ws/messages-ws.gateway';
import { ValidEvent } from '../common/enums/events.enum';



@Resolver(() => EmailMessage)
@UseGuards(JwtAuthGuard)
export class EmailMessagesResolver {
  constructor(
    private readonly emailMessagesService: EmailMessagesService,
    private readonly messagesWsGateway: MessagesWsGateway
  ) { }

  @Mutation(() => EmailMessage)
  async createEmailMessage(
    @Args('createEmailMessageInput') createEmailMessageInput: CreateEmailMessageInput,
    @CurrentUser() user: User
  ): Promise<EmailMessage> {

    const emailMessage = await this.emailMessagesService.create(createEmailMessageInput, user);
    const { successEmails, emailErrorUsers } = await this.emailMessagesService.deliverEmailToDestinations(createEmailMessageInput, user);
    const errorEmailMessage = this.emailMessagesService.deliverEmailError(emailErrorUsers, user);

    if (errorEmailMessage) {
      this.messagesWsGateway.wss.emit(user._id, { event: ValidEvent.ERROR, data: errorEmailMessage });
    }

    if (successEmails) {
      for (const successEmail of successEmails) {
        this.messagesWsGateway.wss.emit(successEmail.user._id, { event: ValidEvent.CREATE, data: emailMessage });
      }
    }

    return emailMessage;
  }

  @Query(() => [EmailMessage], { name: 'emailMessages' })
  async findAll(
    @Args() validTray: ValidTrayArgs,
    @Args() pagination: PaginationArgs,
    @CurrentUser() user: User
  ): Promise<EmailMessage[]> {
    return await this.emailMessagesService.findAll(validTray.tray, pagination, user);
  }

  @Query(() => Int, { name: 'countEmailMessages' })
  async countAll(
    @Args() validTray: ValidTrayArgs,
    @CurrentUser() user: User
  ): Promise<number> {
    return await this.emailMessagesService.countAll(validTray.tray, user);
  }

  @Query(() => EmailMessage, { name: 'emailMessage' })
  async findOne(
    @Args('id', { type: () => String }) id: string
  ): Promise<EmailMessage> {
    return await this.emailMessagesService.findOne(id);
  }

  @Mutation(() => EmailMessage)
  async updateEmailMessage(
    @Args('updateEmailMessageInput') updateEmailMessageInput: UpdateEmailMessageInput,
    @CurrentUser() user: User,
  ): Promise<EmailMessage> {
    const updatedEmailMessage = this.emailMessagesService.update(updateEmailMessageInput.id, updateEmailMessageInput);

    this.messagesWsGateway.wss.emit(user._id, { event: ValidEvent.UPDATE, data: updateEmailMessageInput });

    return updatedEmailMessage;
  }

  @Mutation(() => EmailMessage)
  async removeEmailMessage(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User
  ): Promise<EmailMessage> {
    const removedEmailMessage = await this.emailMessagesService.remove(id);
    this.messagesWsGateway.wss.emit(user._id, { event: ValidEvent.REMOVE, id });

    return removedEmailMessage;
  }
}
