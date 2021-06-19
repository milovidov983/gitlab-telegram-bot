import { Module, DynamicModule } from '@nestjs/common';
import { GITLAB_CONNECTOR_OPTIONS } from './constants';
import { GitlabConnectorModuleOptions } from './gitlab-connector.models';
import { GitlabConnectorService } from './gitlab-connector.service';

@Module({})
export class GitlabConnectorModule {
	static forRoot(options: GitlabConnectorModuleOptions): DynamicModule {
		return {
			module: GitlabConnectorModule,
			providers: [
				{
					provide: GITLAB_CONNECTOR_OPTIONS,
					useValue: options,
				},
				GitlabConnectorService,
			],
			exports: [GitlabConnectorService],
		};
	}
}
