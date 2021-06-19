import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { User } from '../users.models';
import { UserEntity } from './user.entity';

@Injectable()
export class UserDatabaseService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async save(userEntity: UserEntity): Promise<UserEntity> {
		const result = await this.userRepository.save(userEntity);
		return result;
	}
	async getUserById(id: number): Promise<UserEntity | null> {
		const result = await this.userRepository.findByIds([id]);
		if (result && result.length > 0) {
			return result[0];
		}
		return null;
	}
	async getAll(): Promise<UserEntity[]> {
		const users = await this.userRepository.find();
		return users;
	}
}
