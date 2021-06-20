import { Module } from '@nestjs/common';
import { GitlabDatabaseModule } from './database/gitlab-db.module';
import { GitlabConnectorModule } from './gitlab-connector/gitlab-connector.module';
import { GitlabService } from './gitlab.service';

@Module({
  providers: [GitlabService],
  exports: [GitlabService],
  imports: [GitlabDatabaseModule, GitlabConnectorModule],
})
export class GitlabModule { }
