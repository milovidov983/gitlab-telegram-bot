
import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { MergeRequestRole, AllMergeRequestState } from '../../common/shared.models';
import { getLastSyncDateByRole } from '../../common/utils';
import { configService } from '../../config/config.service';
import { BASE_GITLAB_URL } from '../../config/constants';
import { User } from '../../users/users.models';
import { MergeRequest } from '../gitlab.models';
import { GitlabUser } from './gitlab-connector.models';

@Injectable()
export class GitlabConnectorService {
	private readonly baseUrl: string;

	constructor() {
		this.baseUrl = 'https://' + configService.getGitlabBaseUrl();
		if (!this.baseUrl) {
			throw new Error('Init error. Please set the base gitlab url in .env file: ' + BASE_GITLAB_URL);
		}
	}

	async getUsers(tokens: string[]): Promise<GitlabUser[]> {
		const result = await Promise.all(tokens.map(async x => await this.getUser(x)));
		return result;
	}

	async getUser(token: string): Promise<GitlabUser> {
		const url = `${this.baseUrl}/api/v4/user?private_token=${token}`;
		return await this.get<GitlabUser>(url);
	}

	getMergeRequests(
		user: User,
		state: AllMergeRequestState,
		role: MergeRequestRole
	): Promise<MergeRequest[]> {
		const token = user.gitlab?.token;
		const userId = user.gitlab?.id;

		const userRole = role === 'author' ? 'author_id=' : 'assignee_id=';

		const dateQuery = getLastSyncDateByRole(user.operation, role);

		const url =
			`${this.baseUrl}/api/v4/merge_requests` +
			`?private_token=${token}` +
			`&state=${state}` +
			`&updated_after=${dateQuery.toISOString()}` +
			`&${userRole}${userId}`;

		const promise = this.get<MergeRequest[]>(url);
		return promise;
	}

	private get<T>(url: string): Promise<T> {
		const promise = new Promise<T>((resolve, reject) => {
			let error: Error | undefined;
			try {
				axios
					.get(url)
					.then(function (response) {
						resolve(response.data);
					})
					.catch(function (err) {
						console.error(err);
						error = err;
					});
			} catch (err) {
				console.error(err);
				error = err;
			}
			if (error) {
				reject(error);
			}
		});

		return promise;
	}
}
