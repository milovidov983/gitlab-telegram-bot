import { Injectable, Logger } from '@nestjs/common';
import { StartCommandHandler } from '../../command-handlers/start.handler';
import { ContextBot } from '../common/context.interface';
import { MessageCreateError } from '../../command-handlers/errors/message-create-error';
import { Message } from '../common/common.models';
import { HelpCommandHandler } from '../../command-handlers/help.handler';
import { SendNotificationsCommandHandler } from '../../command-handlers/send-notifications.handler';
import { NotificationRawData } from '../../gitlab/gitlab.models';

@Injectable()
export class EntrypointService {
    private readonly logger = new Logger(EntrypointService.name);
    constructor(
        private readonly startCommandHandler: StartCommandHandler,
        private readonly helpCommandHandler: HelpCommandHandler,
        private readonly sendNotificationHandler: SendNotificationsCommandHandler,
    ) { }

    async executeStart(ctx: ContextBot): Promise<string> {
        const response = await this.startCommandHandler.createMessage(ctx);
        if (response instanceof Message) {
            return response.data;
        }
        throw new MessageCreateError(response);
    }


    async executeHelp(ctx: ContextBot): Promise<string> {
        const response = await this.helpCommandHandler.createMessage(ctx);
        if (response instanceof Message) {
            return response.data;
        }
        throw new MessageCreateError(response);
    }

    async executeCollectedDataToSend(ctx: ContextBot): Promise<NotificationRawData[]> {
        const data = await this.sendNotificationHandler.startCollectDataAndSendNotifications(ctx);
        return data;
    }

}
