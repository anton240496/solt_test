import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from './prisma.service.js';
import { Skill } from './models/skill.model.js';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Skill])
  async skill() {
    return this.prisma.skill.findMany({ orderBy: { order: 'asc' } });
  }

  @Mutation(() => Skill)
  async createSkill(
    @Args('name') name: string,
    @Args('groupId', { type: () => Int }) groupId: number,
    @Args('order', { type: () => Int, nullable: true }) order?: number,
  ) {
    return this.prisma.skill.create({
      data: { name, groupId, order: order ?? 0 },
    });
  }

  @Mutation(() => Skill)
  async updateSkill(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
    @Args('order', { type: () => Int, nullable: true }) order?: number,
  ) {
    return this.prisma.skill.update({
      where: { id },
      data: { name, ...(order !== undefined && { order }) },
    });
  }

  @Mutation(() => Boolean)
  async deleteSkill(@Args('id', { type: () => Int }) id: number) {
    await this.prisma.skill.delete({ where: { id } });
    return true;
  }
}