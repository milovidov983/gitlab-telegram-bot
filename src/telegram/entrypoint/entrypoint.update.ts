import { Logger } from '@nestjs/common';
import { Start, Update, InjectBot } from 'nestjs-telegraf';
import { logError } from 'src/common/utils';

import { Telegraf } from 'telegraf';
import { MessageCreateError } from '../../command-handlers/errors/message-create-error';
import { MessageUserIdIsNotDefinedError } from '../../command-handlers/errors/message-user-id-not-defined';
import { ContextBot } from '../../common/context.interface';
import { configService } from '../../config/config.service';
import { EntrypointService } from './entrypoint.service';

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
	async startCommand(ctx: ContextBot): Promise<void> {
		let message = 'Message is empty';
		try {
			message = await this.entrypointSerive.executeStart(ctx);
		} catch (err) {
			const details = this.isProd ? '' : err.message;
			if (err instanceof MessageUserIdIsNotDefinedError) {
				message = 'User id is not defined ' + details;
			} else if (err instanceof MessageCreateError) {
				message = 'Create message error ' + details;
			} else if (err instanceof Error) {
				message = 'Unhandled exeption ' + details;
			} else {
				throw err;
			}
			logError(this.logger, err, ctx);
			message = `Error! ` + message;
		} finally {
			await ctx.reply(`Start command...`);
			await ctx.reply(message);
		}
	}
}
