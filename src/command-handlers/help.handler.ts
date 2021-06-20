import { Injectable, Logger } from '@nestjs/common';
import { ContextBot } from '../telegram/common/context.interface';
import { ErrorMessage, FindUserResult, User } from '../users/users.models';
import { UsersService } from '../users/users.service';
import { Message } from '../telegram/common/common.models';


@Injectable()
export class HelpCommandHandler {
	private readonly logger = new Logger(HelpCommandHandler.name);
	constructor(private readonly usersService: UsersService) { }

	async createMessage(ctx: ContextBot): Promise<Message | ErrorMessage> {
		let message = 'error'
		const userOrError = await this.getUserIfExists(ctx);
		if (userOrError) {
			if (typeof userOrError !== 'string') {
				message = this.createInformationMessage(userOrError);
				await this.usersService.updateUser(userOrError.Id, (user) => {
					user.lastActivity = new Date();
				})
			} else {
				return userOrError;
			}
		} else {
			this.logger.error('The user called the command before registering in the system\n' + JSON.stringify(ctx, null, 2));
		}
		return new Message(message);
	}


	private createInformationMessage(user: User): string {
		return 'User data: ' + JSON.stringify(user, null, 2)
	}


	private async getUserIfExists(ctx: ContextBot): Promise<FindUserResult> {
		const userId = ctx.message!.from.id;
		const user = await this.usersService.findUserByTelegramId(userId);
		return user;
	}
}
