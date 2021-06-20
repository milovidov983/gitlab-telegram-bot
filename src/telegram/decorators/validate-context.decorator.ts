import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUserIdIsNotDefinedError } from '../../command-handlers/errors/request-user-id-not-defined';
import { ContextBot } from '../common/context.interface';

export const ValidateContext = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const param = ctx.getArgs()[0];
		validate(param);
		return param;
	},
);

function validate(ctx: ContextBot): void {
	if (!ctx?.message?.from?.id) {
		throw new RequestUserIdIsNotDefinedError();
	}
}