import { Module } from '@nestjs/common';
import { GitlabModule } from '../gitlab/gitlab.module';
import { UsersModule } from '../users/users.module';
import { EntrypointUpdate } from './entrypoint.update';

@Module({
	providers: [EntrypointUpdate],
	imports: [UsersModule, GitlabModule]
})
export class EntrypointModule { }
