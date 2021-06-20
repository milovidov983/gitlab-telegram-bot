import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { HelpCommandHandler } from './help.command-handler';
import { StartCommandHandler } from './start.command-handler';

@Module({
	providers: [StartCommandHandler, HelpCommandHandler],
	exports: [StartCommandHandler, HelpCommandHandler],
	imports: [UsersModule]
})
export class CommandHandlerModule { }
