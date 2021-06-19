export function createErrorLogMessage(message: string, data: any, error: any) {
	return {
		errorMessage: message,
		callStack: error?.stack,
		exception: error,
		data: { ...data },
	};
}
