import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
		const result = await this.usersService.findUserByTelegramId(from.id);
		if (result && typeof result !== 'string'
			? result.role === 'admin'
			: false) {
			return true;
		} else if (result && typeof result === 'string') {
			const errorMessage = result;
			throw new InternalServerErrorException(errorMessage);
		} else {
			throw new ForbiddenException();
		}
	}
}
