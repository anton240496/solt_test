import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from './prisma.service.js';
import { About } from './models/about.model.js';

@Resolver(() => About)
export class AboutResolver {
  constructor(private prisma: PrismaService) { }

  @Query(() => About, { nullable: true })
  async about() {
    return this.prisma.about.findFirst();
  }

  @Mutation(() => About)
  async updateAbout(
    @Args('photo') photo: string,
    @Args('about') about: string,
    @Args('telefon') telefon: string,
    @Args('telegram') telegram: string,
  ) {
    const existing = await this.prisma.about.findFirst();

    if (existing) {
      return this.prisma.about.update({
        where: { id: existing.id },
        data: { photo, about, telefon, telegram },
      });
    }

    return this.prisma.about.create({
      data: { photo, about, telefon, telegram },
    });
  }
}