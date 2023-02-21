import { IsEmail, IsNotEmpty } from "class-validator";


export class EmailClass {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}