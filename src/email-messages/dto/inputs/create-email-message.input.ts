import { InputType, Int, Field } from '@nestjs/graphql';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { EmailClass } from '../args/email-class.arg';

@InputType()
export class CreateEmailMessageInput {

  @Field(() => [String], { description: 'Destinity users of email' })
  @IsArray()
  @ArrayNotEmpty()
  to: EmailClass[] | string[];

  @Field(() => [String], { nullable: true, description: 'Destinity users of email in copy' })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  cc?: EmailClass[];

  @Field(() => String, { description: 'Email subject is required' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  subject: string;

  @Field(() => String, { description: 'Email body message is required' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  message: string;

}
