import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { ContextBot } from '../telegram/common/context.interface';
import { UsersService } from '../users/users.service';


@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private readonly usersService: UsersService) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = TelegrafExecutionContext.create(context);
		const { from } = ctx.getContext<ContextBot>();
		if (!from) {
			throw new TelegrafException(`Field 'from' is not defined`);
		}
		const user = await this.usersService.findUserByTelegramId(from.id);
		if (user && typeof user !== 'string'
			? user.role === 'admin'
			: false) {
			return true;
		} else {
			throw new ForbiddenException();
		}
	}
}
