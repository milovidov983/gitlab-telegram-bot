import { MergeRequestRole, MergeRequestState } from '../common/shared.models';
import { getPastDateDefault } from '../common/utils';

export type UserStatus = 'stopped' | 'active';
export type Role = 'guest' | 'user' | 'admin';
export type ErrorMessage = string;
export type FindUserResult = User | undefined | ErrorMessage;

export class OperationData {
	syncHistoryByRole: Record<MergeRequestRole, Date>;

	constructor(user?: Partial<OperationData>) {
		Object.assign(this, user);
		if (!this.syncHistoryByRole) {
			this.syncHistoryByRole = {
				assignee: getPastDateDefault(),
				author: getPastDateDefault(),
			};
		}
	}
}
export class User {
	telegram: TelegramUser;
	gitlab?: GitlabUser;
	operation: OperationData;

	role: Role = 'guest';
	status: UserStatus = 'active';

	isDeleted = false;
	registrationDate: Date = new Date();
	lastActivity: Date = new Date();
	invitationSentAt?: Date;

	get Id(): number {
		return this.telegram.id;
	}


	get UserName(): string {
		return this.gitlab?.userName ?? 'User_' + this.telegram.id;
	}

	get IsGuest(): boolean {
		switch (this.role) {
			case 'admin':
			case 'user':
				return false;
			case 'guest':
				return true;
			default: return true;
		}
	}

	get IsNeedToSendInvitationNow(): boolean {
		const userActive =
			!this.isDeleted
			&& this.role === 'user'
			&& this.status === 'active';

		return userActive && this.invitationSentAt === undefined;
	}


	constructor(args?: Partial<User>) {
		Object.assign(this, args);
	}

	getLastSyncDateByRole(role: MergeRequestRole): Date {
		if (this.operation && this.operation.syncHistoryByRole) {
			return new Date(this.operation.syncHistoryByRole[role]);
		}
		return getPastDateDefault();
	}

	setRole(role: Role): void {
		if (this.role === 'guest' && role !== 'guest') {
			this.invitationSentAt = undefined;
		}
		this.role = role;
	}

	updateSyncDate(forMergeRequestRoles: Set<MergeRequestRole>): void {
		if (!this.operation) {
			this.operation = new OperationData();
		}
		const operation = this.operation;
		forMergeRequestRoles.forEach(role => {
			operation.syncHistoryByRole[role] = new Date();
		});
	}
}

export class TelegramUser {
	id: number;
	chatId: number | undefined;
	firstName: string | undefined;
	userName: string | undefined;
}

export class GitlabUser {
	userName: string;
	token: string;
	id: number;
	isTokenOk = false;

	subscribedOnEvents: MergeRequestState[];


	constructor(user: Partial<GitlabUser>) {
		Object.assign(this, user);

	}
}
