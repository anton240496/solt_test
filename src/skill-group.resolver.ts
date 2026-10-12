import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from './prisma.service.js';
import { SkillGroup } from './models/skill-group.model.js';

@Resolver(() => SkillGroup)
export class SkillGroupResolver {
  constructor(private prisma: PrismaService) { }

  @Query(() => [SkillGroup])
  async skillGroups() {
    return this.prisma.skillGroup.findMany({
      orderBy: { order: 'asc' },
      include: { skills: { orderBy: { order: 'asc' } } },
    });
  }

  @Mutation(() => SkillGroup)
  async createSkillGroup(
    @Args('title') title: string,
    @Args('order', { type: () => Int, nullable: true }) order?: number,
  ) {
    return this.prisma.skillGroup.create({
      data: { title, order: order ?? 0 },
    });
  }

  @Mutation(() => SkillGroup)
  async updateSkillGroup(
    @Args('id', { type: () => Int }) id: number,
    @Args('title') title: string,
    @Args('order', { type: () => Int, nullable: true }) order?: number,
  ) {
    return this.prisma.skillGroup.update({
      where: { id },
      data: { title, ...(order !== undefined && { order }) },
    });
  }

  @Mutation(() => Boolean)
  async deleteSkillGroup(@Args('id', { type: () => Int }) id: number) {
    await this.prisma.skillGroup.delete({ where: { id } });
    return true;
  }
}