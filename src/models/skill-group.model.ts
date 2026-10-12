import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Skill } from './skill.model.js';

@ObjectType()
export class SkillGroup {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  order: number;

  @Field(() => [Skill])
  skills: Skill[];
}