import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { BASE_GITLAB_URL } from '../../config/constants';
import { GITLAB_CONNECTOR_OPTIONS } from './constants';
import { GitlabConnectorModuleOptions, GitlabUser } from './gitlab-connector.models';

@Injectable()
export class GitlabConnectorService {
	private readonly baseUrl: string;

	constructor(@Inject(GITLAB_CONNECTOR_OPTIONS) options: GitlabConnectorModuleOptions) {
		this.baseUrl = 'https://' + options.baseUrl;
		if (!this.baseUrl) {
			throw new Error(
				'Init error. Please set the base gitlab url in .env file: ' + BASE_GITLAB_URL
			);
		}
	}

	async getUser(token: string): Promise<GitlabUser> {
		const url = `${this.baseUrl}/api/v4/user?private_token=${token}`;
		return await this.get<GitlabUser>(url);
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
