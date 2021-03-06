import { AllMergeRequestState, ShortMergeRequestState } from '../common/shared.models';
import { User } from '../users/users.models';

export type MergeRequests<TValue> = {
	[key in ShortMergeRequestState]: TValue;
};
export class MergeRequest {
	id: number;
	iid: number;
	project_id: number;
	state: AllMergeRequestState;
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

export class NotificationRawData {
	mr: MergeRequest;
	user: User;
	state: ShortMergeRequestState;
}