import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommandHandlerModule } from '../../command-handlers/command-handler.module';
import { LoggerMiddleware } from '../../middleware/update-user.middleware';
import { UsersModule } from '../../users/users.module';
import { EntrypointService } from './entrypoint.service';
import { EntrypointUpdate } from './entrypoint.update';

@Module({
	providers: [EntrypointUpdate, EntrypointService],
	imports: [CommandHandlerModule, UsersModule]
})
export class EntrypointModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerMiddleware)
	}
}
