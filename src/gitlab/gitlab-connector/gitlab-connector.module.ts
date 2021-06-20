import { Module } from '@nestjs/common';
import { GitlabConnectorService } from './gitlab-connector.service';


@Module({
  providers: [GitlabConnectorService],
  exports: [GitlabConnectorService],
})
export class GitlabConnectorModule { }
