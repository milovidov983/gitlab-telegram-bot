import { Module } from '@nestjs/common';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { EntrypointModule } from './entrypoint/entrypoint.module';
import { GitlabModule } from './gitlab/gitlab.module';
import { GitlabConnectorModule } from './gitlab/gitlab-connector/gitlab-connector.module';
import { UsersModule } from './users/users.module';
import { UserDatabaseModule } from './users/database/user-database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TelegrafModule.forRoot({
      token: configService.getBotToken(),
      include: [EntrypointModule],
    }),
    GitlabConnectorModule.forRoot({ baseUrl: configService.getGitlabBaseUrl() }),
    EntrypointModule,
    UserDatabaseModule,
    GitlabModule,
    UsersModule,
  ]
})
export class AppModule { }
