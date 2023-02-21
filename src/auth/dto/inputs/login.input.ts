import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {

    @Field(() => String, { description: 'User email that identify an user' })
    @IsEmail()
    email: string;

    @Field(() => String, { description: 'Password of a user is required.' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}