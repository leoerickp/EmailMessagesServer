import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User full name is required.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { description: 'User email is required.' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'User password is required.' })
  @IsString()
  @IsNotEmpty()
  password: string;
}