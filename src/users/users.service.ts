import { Injectable, Logger } from '@nestjs/common';
import { createErrorLogMessage } from '../common/utils';
import { UserDatabaseService } from './database/user-database.service';
import { UserEntity } from './database/user.entity';
import { FindUserResult, Role, User } from './users.models';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	constructor(private readonly storage: UserDatabaseService) { }

	async create(user: Partial<User>): Promise<boolean> {
		try {
			await this.storage.save(new UserEntity(user));
			return true;
		} catch (err) {
			const logMessage = createErrorLogMessage(`Error to create new user`, { user }, err)
			this.logger.error(logMessage);
		}
		return false;
	}

	async findUserByTelegramId(id: number): Promise<FindUserResult> {
		try {
			const userOrNull = await this.storage.getUserById(id);
			const result = userOrNull ? new User(userOrNull.data) : undefined;
			return result;
		} catch (err) {
			const logMessage = createErrorLogMessage(`Error to find user`, { id }, err)
			this.logger.error(logMessage);
			return `Error ${err}`
		}
	}

	async changeRole(id: number, role: Role): Promise<boolean> {
		return this.updateUser(id, (user) => {
			user.setRole(role);
		});
	}

	async updateUser(id: number, modifFunc: (u: User) => void): Promise<boolean> {
		try {
			const persistedUser = await this.findUserByTelegramId(id);
			if (persistedUser && typeof persistedUser !== "string") {
				modifFunc(persistedUser);
				await this.storage.save(new UserEntity(persistedUser));
				return true;
			}
		} catch (err) {
			const logMessage = createErrorLogMessage(`Error save user`, { id }, err)
			this.logger.error(logMessage);
		}
		return false;
	}



	public async recordCurrentTimeAndSaveUser(user: User): Promise<void> {
		await this.updateUser(user.Id, (user) => {
			user.Operation.updateSyncDate(new Set(['author', 'assignee']));
		})
	}

}
