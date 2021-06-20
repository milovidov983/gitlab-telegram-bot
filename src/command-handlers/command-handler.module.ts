import { Module } from '@nestjs/common';
import { GitlabMergeRequestCollectorModule } from '../gitlab/gitlab-mr-collector/gitlab-mr-collector.module';
import { UsersModule } from '../users/users.module';
import { HelpCommandHandler } from './help.handler';
import { SendNotificationsCommandHandler } from './send-notifications.handler';
import { StartCommandHandler } from './start.handler';

@Module({
	providers: [StartCommandHandler, HelpCommandHandler, SendNotificationsCommandHandler],
	exports: [StartCommandHandler, HelpCommandHandler, SendNotificationsCommandHandler],
	imports: [UsersModule, GitlabMergeRequestCollectorModule]
})
export class CommandHandlerModule { }
