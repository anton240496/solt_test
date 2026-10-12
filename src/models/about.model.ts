import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class About {
  @Field(() => Int)
  id: number;

  @Field()
  photo: string;

  @Field()
  about: string;

  @Field()
  telefon: string;

  @Field()
  telegram: string;
}