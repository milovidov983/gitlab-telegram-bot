import { Module } from '@nestjs/common';
import { CommandHandlerModule } from 'src/command-handlers/command-handler.module';
import { GitlabModule } from '../gitlab/gitlab.module';
import { UsersModule } from '../users/users.module';
import { EntrypointService } from './entrypoint.service';
import { EntrypointUpdate } from './entrypoint.update';

@Module({
	providers: [EntrypointUpdate, EntrypointService],
	imports: [UsersModule, CommandHandlerModule]
})
export class EntrypointModule { }
