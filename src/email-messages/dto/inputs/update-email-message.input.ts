import { CreateEmailMessageInput } from './create-email-message.input';
import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { ValidTray } from 'src/email-messages/enums/valid-tray.enum';

@InputType()
export class UpdateEmailMessageInput /*extends PartialType(CreateEmailMessageInput)*/ {
  @Field(() => String)
  @IsMongoId()
  id: string;

  @Field(() => Boolean, { nullable: true, description: 'Flag is read is required' })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @Field(() => ValidTray, { nullable: true, description: 'Email Tray that can be inbox, outbox or recycle' })
  @IsEnum(ValidTray)
  @IsOptional()
  tray?: ValidTray;
}
