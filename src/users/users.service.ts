import { Injectable, Logger } from '@nestjs/common';
import { Result } from '../common/common.models';
import { createErrorLogMessage } from '../common/utils';
import { UserDatabaseService } from './database/user-database.service';
import { UserEntity } from './database/user.entity';
import { User } from './users.models';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);
	constructor(private readonly storage: UserDatabaseService) { }

	async create(user: Partial<User>): Promise<Result<void>> {
		try {
			await this.storage.save(new UserEntity(user));
			return {};
		} catch (err) {
			const logMessage = createErrorLogMessage(`Error to create new user`, { user }, err)
			this.logger.error(logMessage);
		}
		return { hasError: true };
	}

	async findUserByTelegramId(id: number): Promise<Result<User>> {
		try {
			const userOrNull = await this.storage.getUserById(id);
			return { result: userOrNull ? userOrNull.data : undefined };
		} catch (err) {
			const logMessage = createErrorLogMessage(`Error to find user`, { id }, err)
			this.logger.error(logMessage);
		}
		return { hasError: true };
	}


}
