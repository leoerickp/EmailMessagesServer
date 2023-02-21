import { ArgsType, Field } from "@nestjs/graphql";
import { ValidTray } from '../../enums/valid-tray.enum';
import { IsEnum, IsString } from 'class-validator';

@ArgsType()
export class ValidTrayArgs {

    @Field(() => ValidTray, { description: 'Valid trays than can be: inbox, outbox, recycle' })
    @IsEnum(ValidTray)
    tray: ValidTray;

}