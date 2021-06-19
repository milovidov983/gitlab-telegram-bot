import { Start, Help, On, Hears, Update, InjectBot, Command, Ctx } from 'nestjs-telegraf';

import { Telegraf } from 'telegraf';
import { ContextBot } from '../common/context.interface';
import { GitlabService } from '../gitlab/gitlab.service';
import { User } from '../users/users.models';
import { UsersService } from '../users/users.service';

@Update()
export class EntrypointUpdate {
	constructor(
		@InjectBot() private bot: Telegraf<ContextBot>,
		private readonly usersService: UsersService,
		private readonly gitlabService: GitlabService
	) { }

	@Start()
	async startCommand(ctx: ContextBot): Promise<void> {
		let message = 'def';
		const userId = ctx.message?.from.id!;

		const findedUserResult = await this.usersService.findUserByTelegramId(userId);

		if (findedUserResult.hasError) {
			message = 'An error has occurred we are already working on this issue'
		} else if (findedUserResult.result) {
			const user = findedUserResult.result;
			const isGitlabOnline = await this.gitlabService.isOnline(user);
			if (!isGitlabOnline) {
				message = user.role == 'guest'
					? 'An error has occurred we are already working on this issue'
					: 'Gitlab is offline. Contact your administrator.'
			} else {
				const isCorrectGitlabToken = await this.gitlabService.isCorrectToken(user);
				if (isCorrectGitlabToken) {
					message = `Hello ${user.gitlab?.userName}, good to see you again!`;
				}
			}
			await this.usersService.updateLastActivity(userId);
		} else {
			message = 'I have registered you, as soon as the administrator grants you access, '
				+ 'I will inform you immediately';
			const user = this.createUserFromContext(ctx);
			await this.usersService.create(user);
		}


		/*
		1. try find user 
			if new user
				I have registered you, as soon as the administrator grants you access, I will inform you immediately
				return
	
			if exsists and has token:
				check gitlab connection
					if gitlab down
						Your gitlab server not response. Contact your administrator.
						return;
					
				check token
					if token ok
						Hello user_name, good to see you again!
					else 
						Send me your gitlab token 
	
			else
				check gitlab connection
				if gitlab down
					Your gitlab server not response. Contact your administrator.
					return;
	
				Send me your gitlab token to complete the bot setup for you
		*/
		await ctx.reply(message);
	}

	private createUserFromContext(ctx: ContextBot): Partial<User> {
		return {
			telegram: {
				chatId: ctx.message?.chat.id,
				id: ctx.message?.from.id!,
				firstName: ctx.message?.from.first_name,
				userName: ctx.message?.from.username,
			}
		}
	}
}
