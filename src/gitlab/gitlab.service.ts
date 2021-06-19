import { Injectable } from '@nestjs/common';
import { User } from 'src/users/users.models';

@Injectable()
export class GitlabService {
	isCorrcectToken(user: User): boolean {
		throw new Error('Method not implemented.');
	}
	isOnline(caller: any): Promise<boolean> {
		// if offline log this
		throw new Error('Method not implemented.');
	}
}
