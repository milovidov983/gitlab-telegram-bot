import { Logger, UseGuards } from '@nestjs/common';
import { Start, Update, InjectBot, Help, Command } from 'nestjs-telegraf';
import { logError } from '../../common/utils';
import { Telegraf } from 'telegraf';
import { MessageCreateError } from '../../command-handlers/errors/message-create-error';
import { RequestUserIdIsNotDefinedError } from '../../command-handlers/errors/request-user-id-not-defined';
import { ContextBot } from '../common/context.interface';
import { configService } from '../../config/config.service';
import { ValidateContext } from '../decorators/validate-context.decorator';
import { EntrypointService } from './entrypoint.service';
import { AdminGuard } from '../../common/admin.guard';
import { NotificationRawData } from '../../gitlab/gitlab.models';
import { type } from 'os';
import { EDIT_USERS_SCENE_ID, GITLAB_TOKEN_SCENE_ID } from './constants';

@Update()
export class EntrypointUpdate {
	private readonly logger = new Logger(EntrypointUpdate.name);
	private readonly isProd: boolean;

	constructor(
		@InjectBot() private bot: Telegraf<ContextBot>,
		private readonly entrypointSerive: EntrypointService,
	) {
		this.isProd = configService.isProduction();
	}

	@Start()
	async startCommand(@ValidateContext() ctx: ContextBot): Promise<void> {
		let message = 'Message is empty';
		try {
			message = await this.entrypointSerive.executeStart(ctx);
		} catch (err) {
			message = `Error! ` + this.handleErrorAndLog(err, message, ctx);
		} finally {
			await ctx.reply(`Start command...`);
			await ctx.reply(message);
		}
	}

	@Help()
	async helpCommand(@ValidateContext() ctx: ContextBot) {
		const msg = await this.entrypointSerive.executeHelp(ctx);
		await ctx.reply(msg);
	}

	@Command('send')
	@UseGuards(AdminGuard)
	async sendNotificationsCommand(@ValidateContext() ctx: ContextBot) {
		this.logger.log('SendNotificationsCommand command starting...');
		const data = await this.entrypointSerive.executeCollectedDataToSend(ctx);

		this.logger.log('Data collected. Start mapping. Count: ' + data?.length);
		const map = new Map<number, NotificationRawData[]>();

		const d = data.map(x => {
			if (map.has(x.user.Id)) {
				map.get(x.user.Id)?.push(x);
			} else {
				map.set(x.user.Id, []);
				map.get(x.user.Id)?.push(x);
			}
		})
		this.logger.log('Mapping complete, start sending, total keys: ' + map.keys.length);

		const logger = this.logger;
		map.forEach(async (data, userId) => {
			logger.log('UserId ' + userId);
			if (!data) {
				return;
			}
			const opened = data.filter(x => x.state === 'opened');
			const closed = data.filter(x => x.state === 'closed');
			const merged = data.filter(x => x.state === 'merged');

			const chatId = data[0].user.TelegramData.chatId;

			const viewResult = JSON.stringify({
				openedMergeRequests: {
					total: opened.length,
					links: opened.map(x => x.mr.web_url)
				},
				closedMergeRequests: {
					total: closed.length,
					links: closed.map(x => x.mr.web_url)
				},
				mergedMergeRequests: {
					total: merged.length,
					links: merged.map(x => x.mr.web_url)
				}
			}, null, 2)
			logger.log(viewResult);
			await this.bot.telegram.sendMessage(chatId!, viewResult)

		});




		await ctx.reply('Ok');
	}

	@Command('edit')
	@UseGuards(AdminGuard)
	async setRoleToUsers(@ValidateContext() ctx: ContextBot) {
		await ctx.scene.enter(EDIT_USERS_SCENE_ID);
	}

	@Command('token')
	async enterGitlabToken(@ValidateContext() ctx: ContextBot) {
		await ctx.scene.enter(GITLAB_TOKEN_SCENE_ID);
	}

	private handleErrorAndLog(err: any, message: string, ctx: ContextBot) {
		try {
			const details = this.isProd ? '***' : err.message;
			if (err instanceof RequestUserIdIsNotDefinedError) {
				message = 'User id is not defined ' + details;
			} else if (err instanceof MessageCreateError) {
				message = 'Create message error ' + details;
			} else if (err instanceof Error) {
				message = 'Unhandled exeption ' + details;
			} else {
				throw err;
			}
			logError(this.logger, err, ctx);
			return message;
		} catch (e) {
			console.error(e);
		}
		return message;
	}
}
