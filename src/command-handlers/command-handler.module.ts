import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { StartCommandHandler } from './start.command-handler';

@Module({
	providers:[StartCommandHandler],
	exports:[StartCommandHandler],
	imports: [UsersModule]
})
export class CommandHandlerModule { }
