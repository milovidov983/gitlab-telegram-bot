import { Module } from '@nestjs/common';
import { CommandHandlerModule } from '../../command-handlers/command-handler.module';
import { UsersModule } from '../../users/users.module';
import { EntrypointService } from './entrypoint.service';
import { EntrypointUpdate } from './entrypoint.update';

@Module({
	providers: [EntrypointUpdate, EntrypointService],
	imports: [CommandHandlerModule, UsersModule]
})
export class EntrypointModule { }
