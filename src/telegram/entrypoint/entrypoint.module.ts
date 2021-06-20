import { Module } from '@nestjs/common';
import { CommandHandlerModule } from '../../command-handlers/command-handler.module';
import { GitlabModule } from '../../gitlab/gitlab.module';
import { UsersModule } from '../../users/users.module';
import { EntrypointService } from './entrypoint.service';
import { EntrypointUpdate } from './entrypoint.update';
import { GitlabTokenScene } from './gitlab-token-scene/gitlab-token.scene';
import { EditUsersScene } from './manage-users-scene/edit-users.scene';

@Module({
	providers: [EntrypointUpdate, EntrypointService, EditUsersScene, GitlabTokenScene],
	imports: [CommandHandlerModule, UsersModule, GitlabModule]
})
export class EntrypointModule { }
