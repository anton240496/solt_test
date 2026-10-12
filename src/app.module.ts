import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma.module.js';
import { AboutResolver } from './about.resolver.js';
import { UploadController } from './upload.controller.js';
import { SkillGroupResolver } from './skill-group.resolver.js';
import { SkillResolver } from './skill.resolver.js';
import { WorkResolver } from './work.resolver.js';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

@Module({
  imports: [



    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveStaticOptions: { index: 'index.html' },
      exclude: ['/graphql'],
    }),

    PrismaModule,
  ],
  controllers: [UploadController],
  providers: [AboutResolver, SkillGroupResolver, SkillResolver, WorkResolver],


})


export class AppModule { }