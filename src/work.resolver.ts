import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from './prisma.service.js';
import { Work } from './models/work.model.js';

@Resolver(() => Work)
export class WorkResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Work])
  async works() {
    return this.prisma.work.findMany({ orderBy: { order: 'asc' } });
  }

  @Mutation(() => Work)
  async createWork(
    @Args('position') position: string,
    @Args('company') company: string,
    @Args('period') period: string,
    @Args('description') description: string,
    @Args('order', { type: () => Int, nullable: true }) order?: number,
  ) {
    return this.prisma.work.create({
      data: { position, company, period, description, order: order ?? 0 },
    });
  }

  @Mutation(() => Work)
  async updateWork(
    @Args('id', { type: () => Int }) id: number,
    @Args('position') position: string,
    @Args('company') company: string,
    @Args('period') period: string,
    @Args('description') description: string,
    @Args('order', { type: () => Int, nullable: true }) order?: number,
  ) {
    return this.prisma.work.update({
      where: { id },
      data: {
        position,
        company,
        period,
        description,
        ...(order !== undefined && { order }),
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteWork(@Args('id', { type: () => Int }) id: number) {
    await this.prisma.work.delete({ where: { id } });
    return true;
  }
}