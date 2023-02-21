import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ValidRoles } from '../enums/valid-roles.enum';

@Schema({ timestamps: true })
@ObjectType()
export class User {

  @Field(() => String, { nullable: true, description: 'Mongo id created by MongoDB' })
  _id: string;

  @Field(() => String, { nullable: false, description: 'User full name' })
  @Prop({
    type: String,
    required: true,
  })
  fullName: string;

  @Field(() => String, { description: 'User email that identify an user' })
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
  })
  password: string;

  @Field(() => [String, { description: 'Valid roles than can be: user, super user and admin' }])
  @Prop({
    type: Array,
    required: true,
    default: [ValidRoles.user]
  })
  roles: string[];

  @Field(() => Boolean, { description: 'Flag that means if a user is active or not' })
  @Prop({
    type: Boolean,
    required: true,
    default: true
  })
  isActive: boolean;

  @Field(() => Date, { description: 'Created At' })
  @Prop({
    type: Date
  })
  createdAt?: Date;

  @Field(() => Date, { description: 'Updated At' })
  @Prop({
    type: Date
  })
  updatedAt?: Date;

  //@Field(() => User, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  lastUpdateBy?: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
