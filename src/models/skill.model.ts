import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  groupId: number;
}