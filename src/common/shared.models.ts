export type MergeRequestRole = 'author' | 'assignee';
export type AllMergeRequestState = 'opened'
	| 'closed'
	| 'locked'
	| 'merged';
export type ShortMergeRequestState = Exclude<AllMergeRequestState, 'locked'>;