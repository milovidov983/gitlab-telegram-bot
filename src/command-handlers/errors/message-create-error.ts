export class MessageCreateError extends Error {
	constructor(message?: string) {
		super(JSON.stringify(message));
		// see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
		Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
		this.name = MessageCreateError.name; // stack traces display correctly now 
	}
}