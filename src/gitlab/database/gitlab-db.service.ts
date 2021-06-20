import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MergeRequestId } from '../gitlab.models';
import { GitlabMergeRequestEntity } from './gitlab-mr.entity';

@Injectable()
export class GitlabDatabaseService {
	constructor(
		@InjectRepository(GitlabMergeRequestEntity)
		private readonly mrRepository: Repository<GitlabMergeRequestEntity>
	) { }

	async getMrById(mrId: MergeRequestId): Promise<GitlabMergeRequestEntity | null> {
		const result = await this.mrRepository.find({
			id: mrId.mergeRequestId,
			project_id: mrId.projectId,
		});
		return result && result.length > 0 ? result[0] : null;
	}
	async saveMr(mr: GitlabMergeRequestEntity): Promise<void> {
		const result = await this.mrRepository.save(mr);
	}
}
