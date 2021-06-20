import { Entity, Column, PrimaryColumn } from 'typeorm';
import { MergeRequest } from '../gitlab.models';

@Entity({ name: 'gitlab_merge_req' })
export class GitlabMergeRequestEntity {
	@PrimaryColumn()
	id: number;

	@Column()
	project_id: number;

	@Column({
		type: 'jsonb',
		array: false,
	})
	data: MergeRequest;

	@Column({
		default: () => 'CURRENT_TIMESTAMP',
		type: 'timestamp',
	})
	changedAt: Date;

	constructor(mr?: Partial<MergeRequest>) {
		if (mr && mr.id && mr.project_id) {
			this.id = mr.id;
			this.project_id = mr.project_id;
			this.data = new MergeRequest(mr);
			this.changedAt = new Date();
		}
	}
}
