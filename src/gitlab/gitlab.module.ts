import { Module } from '@nestjs/common';
import { GitlabDatabaseModule } from './database/gitlab-db.module';
import { GitlabConnectorModule } from './gitlab-connector/gitlab-connector.module';
import { GitlabService } from './gitlab.service';

@Module({
  imports: [GitlabConnectorModule, GitlabDatabaseModule],
  providers: [GitlabService],
  exports: [GitlabService]
})
export class GitlabModule { }
