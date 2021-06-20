import { Injectable, Logger } from '@nestjs/common';
import { StartCommandHandler } from 'src/command-handlers/start.command-handler';
import { ContextBot } from 'src/common/context.interface';
import { logError } from 'src/common/utils';
import { User } from 'src/users/users.models';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class EntrypointService {
	private readonly logger = new Logger(EntrypointService.name);
	constructor(private readonly startCommandHandler: StartCommandHandler) { }

    async executeStart(ctx: ContextBot): Promise<string> {
        const response = await this.startCommandHandler.createMessage(ctx);
        return response;
    }

}
