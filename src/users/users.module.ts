import { Module } from '@nestjs/common';
import { UserDatabaseService } from './database/user-database.service';
import { UsersService } from './users.service';

@Module({
	providers: [UsersService],
	exports: [UsersService],
	imports: [UserDatabaseService],
})
export class UsersModule {}
