import { Logger } from "@nestjs/common";
import { ContextBot } from '../telegram/common/context.interface';
import { OperationData } from '../users/users.models';
import { MergeRequestRole } from './shared.models';


export function createErrorLogMessage(message: string, data: any, error: any) {
	return {
		errorMessage: message,
		callStack: error?.stack,
		exception: error,
		data: { ...data }
	}
}


export function logError(logger: Logger, err: any, ctx: any | undefined
) {
	logger.error(err);
	logger.error(JSON.stringify(ctx));
}


export function getPastDateDefault(): Date {
	var d = new Date();
	d.setDate(d.getDate() - 5);
	return d;
}


export function message(ctx: ContextBot): string {
	const message = (ctx?.update as any)?.message?.text;
	return message;
}

export function getStateValue(ctx: ContextBot, prop: string): string {
	if (ctx.session.__scenes.state) {
		return (ctx.session.__scenes.state as any)[prop];
	}
	return '';
}

export function clearState(ctx: ContextBot): void {
	if (ctx.session.__scenes.state) {
		ctx.session.__scenes.state = {};
	}
}


export function getLastSyncDateByRole(o: OperationData, role: MergeRequestRole): Date {
	if (o.syncHistoryByRole) {
		return new Date(o.syncHistoryByRole[role]);
	}
	return getPastDateDefault();
}