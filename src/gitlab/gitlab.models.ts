import { MergeRequestState } from '../common/shared.models';

export type MergeRequests<TValue> = {
	[key in Exclude<MergeRequestState, 'locked'>]: TValue;
};
export class MergeRequest {
	id: number;
	iid: number;
	project_id: number;
	state: MergeRequestState;
	updated_at: Date;
	author: GitlabInternalUserModel;
	assignee?: GitlabInternalUserModel;
	web_url: string;
	title: string;

	constructor(mr: Partial<MergeRequest>) {
		Object.assign(this, mr);
	}
}

export class GitlabInternalUserModel {
	id: number;
	name: string;
	username: string;
}

export class MergeRequestId {
	readonly mergeRequestId: number;
	readonly projectId: number;

	constructor(args: Partial<MergeRequestId>) {
		Object.assign(this, args);
	}
}