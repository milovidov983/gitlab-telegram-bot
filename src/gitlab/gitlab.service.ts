import { Injectable } from '@nestjs/common';

@Injectable()
export class GitlabService {
	isOnline(caller: any): Promise<boolean> {
		// if offline log this
		throw new Error('Method not implemented.');
	}

	update(): void{
		// Get users
		// 
	}
}
