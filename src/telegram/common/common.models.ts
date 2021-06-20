export class Message {
	data: string;
	constructor(data: string) {
		this.data = data;
	}
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MessageUserIdIsNotDefinedError } from '../../command-handlers/errors/message-user-id-not-defined';
import { ContextBot } from '../../common/context.interface';

export const ValidateContext = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const param = ctx.getArgs()[0];
		validate(param);
		return param;
	},
);

function validate(ctx: ContextBot): void {
	if (!ctx?.message?.from?.id) {
		throw new MessageUserIdIsNotDefinedError();
	}
}