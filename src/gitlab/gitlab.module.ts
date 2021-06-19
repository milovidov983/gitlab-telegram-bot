import { Module } from '@nestjs/common';
import { GitlabConnectorModule } from './gitlab-connector/gitlab-connector.module';
import { GitlabService } from './gitlab.service';

@Module({
	imports: [GitlabConnectorModule],
	providers: [GitlabService],
	exports: [GitlabService],
})
export class GitlabModule {}
