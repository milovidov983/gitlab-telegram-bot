import { Module } from '@nestjs/common';
import { UserDatabaseModule } from './database/user-database.module';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [UserDatabaseModule]
})
export class UsersModule { }
