import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Work {
    @Field(() => Int)
    id: number;

    @Field()
    position: string;

    @Field()
    company: string;

    @Field()
    period: string;

    @Field()
    description: string;

    @Field(() => Int)
    order: number;
} 