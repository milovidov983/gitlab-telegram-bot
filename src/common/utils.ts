import { Logger } from "@nestjs/common";


export function createErrorLogMessage(message: string, data: any, error: any) {
	return {
		errorMessage: message,
		callStack: error?.stack,
		exception: error,
		data: { ...data }
	}
}


export function logError(logger: Logger, err: any,  ctx: any | undefined
	) {
	logger.error(err);
	logger.error(JSON.stringify(ctx));
}