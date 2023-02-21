import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date } from 'mongoose';
import { ValidTray } from '../enums/valid-tray.enum';
import { User } from '../../users/entities/user.entity';

@Schema({ timestamps: true })
@ObjectType()
export class EmailMessage {

  @Field(() => String, { nullable: true, description: 'Mongo id created by MongoDB' })
  _id: string;

  @Field(() => User, { description: 'Owner of email' })
  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  })
  user: User;

  @Field(() => String, { description: 'Source user of email' })
  @Prop({
    type: String,
    required: true
  })
  from: string;

  @Field(() => [String], { description: 'Destinity users of email' })
  @Prop({
    type: Array,
    required: true
  })
  to: string[];

  @Field(() => [String], { nullable: true, description: 'Destinity users of email in copy' })
  @Prop({
    type: Array,
  })
  cc?: string[];

  @Field(() => String, { description: 'Email subject is required' })
  @Prop({
    type: String,
    required: true,
    default: '(No subject)'
  })
  subject: string;

  @Field(() => String, { description: 'Email body message is required' })
  @Prop({
    type: String,
    required: true,
    default: '(No message)'
  })
  message: string;

  @Field(() => Boolean, { description: 'Flag is read is required' })
  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  isRead: boolean;

  @Field(() => String, { description: 'Email Tray that can be inbox, outbox or recycle' })
  @Prop({
    type: String,
    required: true,
    enum: ValidTray,
    default: ValidTray.outbox
  })
  tray: ValidTray;


  @Field(() => Date, { description: 'Created At is an email date' })
  @Prop({
    type: Date
  })
  createdAt?: Date;

  @Field(() => Date, { description: 'Updated At' })
  @Prop({
    type: Date
  })
  updatedAt?: Date;

}

export const EmailMessageSchema = SchemaFactory.createForClass(EmailMessage);