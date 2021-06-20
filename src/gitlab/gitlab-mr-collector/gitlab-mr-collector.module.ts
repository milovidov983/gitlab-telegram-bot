import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { GitlabModule } from '../gitlab.module';

import { GitlabMergeRequestCollectorService } from './gitlab-mr-collector.service';


@Module({
	providers: [GitlabMergeRequestCollectorService],
	exports: [GitlabMergeRequestCollectorService],
	imports: [GitlabModule, UsersModule],
})
export class GitlabMergeRequestCollectorModule {

}
