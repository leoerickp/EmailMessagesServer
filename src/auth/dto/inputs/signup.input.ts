import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
    @Field(() => String, { description: 'User email that identify an user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field(() => String, { nullable: false, description: 'User full name' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    fullName: string;

    @Field(() => String, { description: 'Password of a user is required.' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

}