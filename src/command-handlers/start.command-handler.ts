import { Injectable, Logger } from '@nestjs/common';
import { ContextBot } from 'src/common/context.interface';
import { logError } from 'src/common/utils';
import { User } from 'src/users/users.models';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class StartCommandHandler {
	private readonly logger = new Logger(StartCommandHandler.name);
	constructor(private readonly usersService: UsersService) { }

    async createMessage(ctx: ContextBot): Promise<string> {
        let message = ''
        const user = await this.getUserIfExists(ctx);
        if(user){
            message = this.createGreetingMessage(user.gitlab?.userName);
        } else {
            message = this.createRegistrationMessage();
            await this.cereateNewUser(ctx);
        }
        return message;
    }


	private createGreetingMessage(n:string | undefined): string {
		return `Hello ${n}, good to see you again!`;
	}
	private createRegistrationMessage(): string {
		return 'I have registered you, as soon as the administrator grants you access, '
		+ 'I will inform you immediately';;
	}

    private async cereateNewUser(ctx: ContextBot) : Promise<void> {
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


	private async getUserIfExists(ctx: ContextBot | undefined): Promise<User | undefined>{
		if(ctx?.message?.from?.id){
			const user = await this.usersService.findUserByTelegramId(ctx.message.from.id);
			if(user && !user.hasError && user.result){
				return user.result;
			}
		} else {
			logError(this.logger, 'Telegram user id not defined', ctx);
		}
	}




}
