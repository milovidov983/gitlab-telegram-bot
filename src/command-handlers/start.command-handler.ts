import { Injectable, Logger } from '@nestjs/common';
import { ContextBot } from '../common/context.interface';
import { logError } from '../common/utils';
import { ErrorMessage, FindUserResult, User } from '../users/users.models';
import { UsersService } from '../users/users.service';
import { Message } from '../telegram/common/common.models';


@Injectable()
export class StartCommandHandler {
	private readonly logger = new Logger(StartCommandHandler.name);
	constructor(private readonly usersService: UsersService) { }

	async createMessage(ctx: ContextBot): Promise<Message | ErrorMessage> {
		let message = 'error'
		const userOrError = await this.getUserIfExists(ctx);
		if (userOrError) {
			if (typeof userOrError !== 'string') {
				message = this.createGreetingMessage(userOrError.UserName);
			} else {
				return userOrError;
			}
		} else {
			message = this.createRegistrationMessage();
			await this.cereateNewUser(ctx);
		}
		return new Message(message);
	}


	private createGreetingMessage(n: string | undefined): string {
		return `Hello ${n ? n : 'user'}, good to see you again!`;
	}

	private createRegistrationMessage(): string {
		return 'I have registered you, as soon as the administrator grants you access, '
			+ 'I will inform you immediately';
	}

	private async cereateNewUser(ctx: ContextBot): Promise<void> {
		const user = {
			telegram: {
				chatId: ctx.message?.chat.id,
				id: ctx.message!.from.id,
				firstName: ctx.message?.from.first_name,
				userName: ctx.message?.from.username,
			}
		};
		await this.usersService.create(user);
	}

	private async getUserIfExists(ctx: ContextBot | undefined): Promise<FindUserResult> {
		if (ctx?.message?.from?.id) {
			const user = await this.usersService.findUserByTelegramId(ctx.message.from.id);
			return user;
		} else {
			logError(this.logger, 'Telegram user id not defined', ctx);
		}
	}
}
