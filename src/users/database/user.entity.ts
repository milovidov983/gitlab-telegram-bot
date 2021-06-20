import { User } from '../users.models';
import { Entity, Column, PrimaryColumn } from 'typeorm';
@Entity({ name: 'user' })
export class UserEntity {
	@PrimaryColumn()
	id: number;

	@Column({
		type: 'jsonb',
		array: false,
	})
	data: User;

	@Column({
		default: () => 'CURRENT_TIMESTAMP',
		type: 'timestamp',
	})
	createdAt: Date;

	constructor(args?: Partial<User>) {
		if (args && args.telegram) {
			this.data = new User(args);
			this.id = args.telegram.id;
		}
	}
}