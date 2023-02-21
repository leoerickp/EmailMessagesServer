import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

@ObjectType()
export class AuthResponse {
    @Field(() => String, { description: 'Token that identifies an user' })
    token: string;

    @Field(() => User, { description: 'User identified' })
    user: User;
}