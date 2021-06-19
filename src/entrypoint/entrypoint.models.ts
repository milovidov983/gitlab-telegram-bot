import { Logger } from "@nestjs/common";
import { ContextBot, validate } from "src/common/context.interface";
import { GitlabService } from "src/gitlab/gitlab.service";
import { User } from "src/users/users.models";
import { UsersService } from "src/users/users.service";

export class Error {
	message: string;
}

export class Request {
    user: User | undefined;
    error: string;

    get hasError(): boolean {
        return !!this.error;
    }
    context: ContextBot;

    constructor(value: Partial<Request>){
        Object.assign(this, value);
    }
}

export class Response {

}

export class RequestBuilder {
	private readonly logger = new Logger(RequestBuilder.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly gitlabService: GitlabService

	) {}



    async create(ctx: ContextBot): Promise<Request>{
        const contextValidationError = validate(ctx);
        if(contextValidationError){
            this.logger.error({
                errorMessage: `Error create Request: ${contextValidationError}`,
                payload: [{
                    name: 'context',
                    value: JSON.stringify(ctx)
                }]
            })
			return new Request( {
                context: ctx,
                error:  'Error: userId is not defined'
            });
        }
        const userId = ctx.message!.from.id;
		const findedUserResult = await this.usersService.findUserByTelegramId(userId);

		if (findedUserResult.hasError) {
			return new Request( {
                context: ctx,
                error:  'Error: An error has occurred we are already working on this issue',
            });
        }

        if (findedUserResult.result) {
			const user = findedUserResult.result;
			const isGitlabOnline = await this.gitlabService.isOnline(user);
			if (!isGitlabOnline) {
                return new Request( {
                    context: ctx,
                    error: user.role == 'guest'
                    ? 'An error has occurred we are already working on this issue'
                    : 'Gitlab is offline. Contact your administrator.'
                   });

			} else {
				const isCorrectGitlabToken = await this.gitlabService.isCorrcectToken(user);
				user.setCorrectToken();
                if (isCorrectGitlabToken) {
					return new Request({
                        context: ctx,
                        user: user,
                        isCorrectGitlabToken: true
                    });
				}
			}
    }
}