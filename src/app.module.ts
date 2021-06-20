import { Module } from '@nestjs/common';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { EntrypointModule } from './telegram/entrypoint/entrypoint.module';
import { GitlabModule } from './gitlab/gitlab.module';
import { GitlabConnectorModule } from './gitlab/gitlab-connector/gitlab-connector.module';
import { UsersModule } from './users/users.module';
import { UserDatabaseModule } from './users/database/user-database.module';
import { CommandHandlerModule } from './command-handlers/command-handler.module';
import { ScheduleModule } from './schedule/shedule.module';
import { GitlabDatabaseModule } from './gitlab/database/gitlab-db.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TelegrafModule.forRoot({
      token: configService.getBotToken(),
      include: [EntrypointModule],
    }),
    GitlabConnectorModule,
    GitlabModule,
    GitlabDatabaseModule,
    ScheduleModule.forRoot(configService.getUpdateInterval()),
    EntrypointModule,
    UserDatabaseModule,
    UsersModule,
    CommandHandlerModule,
  ]
})
export class AppModule { }
