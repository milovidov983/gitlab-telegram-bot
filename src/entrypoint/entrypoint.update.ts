import { Logger } from '@nestjs/common';
import { Start, Help, On, Hears, Update, InjectBot, Command, Ctx } from 'nestjs-telegraf';
import { logError } from 'src/common/utils';

import { Telegraf } from 'telegraf';
import { ContextBot } from '../common/context.interface';
import { GitlabService } from '../gitlab/gitlab.service';
import { User } from '../users/users.models';
import { UsersService } from '../users/users.service';
import { EntrypointService } from './entrypoint.service';

@Update()
export class EntrypointUpdate {
	private readonly logger = new Logger(EntrypointUpdate.name);
	constructor(
		@InjectBot() private bot: Telegraf<ContextBot>,
		private readonly entrypointSerive: EntrypointService,
	) { }


	@Start()
	async startCommand(ctx: ContextBot): Promise<void> {
		let message = 'Message is empty';
		try {
			message = await this.entrypointSerive.executeStart(ctx);
		} catch(err){
			logError(this.logger, err, ctx);
			message += `. Error.`
		} finally{
			await ctx.reply(`Start command...`);
			await ctx.reply(message);
		}
	}
}
