import { ValidRoles } from '../../enums/valid-roles.enum';
import { IsArray, IsOptional, ArrayMinSize } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ValidRolesArgs {

    @Field(() => [ValidRoles], { nullable: true, description: 'Valid roles than can be: user, super user and admin' })
    @IsArray()
    @ArrayMinSize(1)
    @IsOptional()
    roles?: ValidRoles[];

}