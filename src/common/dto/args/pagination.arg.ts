import { Field, Int, ArgsType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

@ArgsType()
export class PaginationArgs {

    @Field(() => Int, { nullable: true, description: 'Query limit' })
    @IsInt()
    @IsOptional()
    @IsPositive()
    @Min(1)
    limit?: number;

    @Field(() => Int, { nullable: true, description: 'Query offset or skip' })
    @IsInt()
    @IsOptional()
    @Min(0)
    offset?: number;
}