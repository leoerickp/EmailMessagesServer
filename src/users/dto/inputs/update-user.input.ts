import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsMongoId, ArrayMinSize } from 'class-validator';
import { ValidRoles } from '../../enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String, { description: 'User Mongo id' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @Field(() => [ValidRoles], { nullable: true, description: 'Valid roles than can be: user, super user and admin' })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true, description: 'Flag that means if a user is active or not' })
  @IsOptional()
  isActive?: boolean;
}
