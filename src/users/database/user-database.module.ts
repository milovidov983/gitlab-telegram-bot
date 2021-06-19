import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDatabaseService } from './user-database.service';
import { UserEntity } from './user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UserDatabaseService],
	exports: [UserDatabaseService],
})
export class UserDatabaseModule {}
