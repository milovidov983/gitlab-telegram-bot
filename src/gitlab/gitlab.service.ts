import { Injectable } from '@nestjs/common';
import { User } from '../users/users.models';
import { GitlabDatabaseService } from './database/gitlab-db.service';
import { GitlabMergeRequestEntity } from './database/gitlab-mr.entity';
import { GitlabUser } from './gitlab-connector/gitlab-connector.models';
import { GitlabConnectorService } from './gitlab-connector/gitlab-connector.service';
import { GitlabInternalUserModel, MergeRequest, MergeRequestId, MergeRequests } from './gitlab.models';

@Injectable()
export class GitlabService {

	constructor(
		private readonly storage: GitlabDatabaseService,
		private readonly connector: GitlabConnectorService,
	) { }

	public async getUpdatedMergeRequests(user: User): Promise<MergeRequests<MergeRequest[]>> {
		const closedPromise = this.getClosedMergeRequests(user);
		const mergedPromise = this.getMergedMergeRequests(user);
		const openedPromise = this.getOpenedMergeRequests(user);

		const [closed, merged, opened] = await Promise.all([
			closedPromise,
			mergedPromise,
			openedPromise,
		]);

		return {
			closed,
			merged,
			opened,
		};
	}

	async getUser(token: string): Promise<GitlabUser> {
		const user = await this.connector.getUser(token);
		return user;
	}

	//#region GITLAB USERS

	public async getAllActiveUsers(users: User[]): Promise<GitlabInternalUserModel[]> {
		const tokens = users
			.filter(x => x.gitlab.isTokenOk)
			.map(x => x.gitlab.token)
			.filter(x => !!x);

		const gitLabUsers: GitlabInternalUserModel[] = await this.connector.getUsers(tokens);
		return gitLabUsers;
	}


	//#endregion

	//#region GITLAB MERGE REQUESTS

	public async saveMergeRequest(mr: MergeRequest): Promise<void> {
		await this.storage.saveMr(new GitlabMergeRequestEntity(mr));
	}

	public async getMergeRequestById(id: MergeRequestId): Promise<MergeRequest | null> {
		const result = await this.storage.getMrById(id);
		return result ? new MergeRequest(result.data) : null;
	}

	private async getClosedMergeRequests(user: User): Promise<MergeRequest[]> {
		const result = await this.connector.getMergeRequests(
			user,
			'closed',
			'author'
		);
		return result;
	}
	private async getMergedMergeRequests(user: User): Promise<MergeRequest[]> {
		const result = await this.connector.getMergeRequests(
			user,
			'merged',
			'author'
		);
		return result;
	}
	private async getOpenedMergeRequests(user: User): Promise<MergeRequest[]> {
		const result = await this.connector.getMergeRequests(
			user,
			'opened',
			'assignee'
		);
		return result;
	}
	//#endregion 
}
