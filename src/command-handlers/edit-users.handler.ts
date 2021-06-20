import { Injectable, Logger } from '@nestjs/common';
import { ContextBot } from '../telegram/common/context.interface';
import { ErrorMessage, FindUserResult } from '../users/users.models';
import { UsersService } from '../users/users.service';
import { Message } from '../telegram/common/common.models';


@Injectable()
export class EditUsersCommandHandler {
	private readonly logger = new Logger(EditUsersCommandHandler.name);
	constructor(private readonly usersService: UsersService) { }

	async createMessage(ctx: ContextBot): Promise<void> {

	}


}
