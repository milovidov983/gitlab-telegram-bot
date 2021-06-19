export type Result<T> = {
	result?: T;
	hasError?: boolean;
};

// type ExtractPII<Type> = {
// 	[Property in keyof Type]: Type[Property] extends { hasError: true } ? true : false
// }

// type DBFields = {
// 	id: { format: 'incrementing' }
// 	name: { type: string, hasError: true }
// }

// type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>
// 	// type ObjectsNeedingGDPRDeletion = { id: false, name: true }
