import { Injectable, Logger } from '@nestjs/common';
import { ContextBot } from '../telegram/common/context.interface';
import { UsersService } from '../users/users.service';
import { GitlabMergeRequestCollectorService } from '../gitlab/gitlab-mr-collector/gitlab-mr-collector.service';
import { NotificationRawData } from '../gitlab/gitlab.models';


@Injectable()
export class SendNotificationsCommandHandler {
	private readonly logger = new Logger(SendNotificationsCommandHandler.name);
	constructor(
		private readonly usersService: UsersService,
		private readonly gitlab: GitlabMergeRequestCollectorService,
	) { }

	async startCollectDataAndSendNotifications(ctx: ContextBot): Promise<NotificationRawData[]> {
		await ctx.reply('Start collect data and send notifications...');
		await ctx.reply('Finding active users...');
		const activeGitlabUsers = await this.usersService.findActiveGitlabUsers();
		await ctx.reply('Total active gitlab users: ' + activeGitlabUsers.length);

		await ctx.reply('The beginning of a heavy operation: collectiong merge requests...');
		const dataToNotification = await this.gitlab.startCollectionMrs(activeGitlabUsers);
		await ctx.reply('Operation completed. Total updated data in MR: ' + dataToNotification.length);

		// Here it is specially made not asynchronously so as not to overload the database
		for (const user of activeGitlabUsers) {
			try {
				await this.usersService.recordSyncTimeAndSave(user)
			} catch (err) {
				this.logger.error(err);
			}
		}

		return dataToNotification;
	}
}