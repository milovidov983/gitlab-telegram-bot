import { MergeRequestRole, AllMergeRequestState } from '../common/shared.models';
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

	updateSyncDate(forMergeRequestRoles: Set<MergeRequestRole>): void {
		const history = this.syncHistoryByRole;
		forMergeRequestRoles.forEach(role => {
			history[role] = new Date();
		});
	}

	getLastSyncDateByRole(role: MergeRequestRole): Date {
		if (this.syncHistoryByRole) {
			return new Date(this.syncHistoryByRole[role]);
		}
		return getPastDateDefault();
	}
}

export class UserSettings {
	subscribedTo: AllMergeRequestState[] = [];
	isNotificationOn: boolean = true;

	constructor(arg?: Partial<UserSettings>) {
		Object.assign(this, arg);
	}
}
export class User {
	telegram: TelegramUser = new TelegramUser();
	get TelegramData(): TelegramUser {
		return this.telegram;
	}

	gitlab: GitlabUserProfile = new GitlabUserProfile();
	get GitlabProfile(): GitlabUserProfile {
		return this.gitlab;
	}

	operation: OperationData = new OperationData();
	get Operation(): OperationData {
		return this.operation;
	}

	settings: UserSettings = new UserSettings();
	get Settings(): UserSettings {
		return this.settings;
	}

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

	setRole(newRole: Role): void {
		const currentRole = this.role;
		if (currentRole === 'guest' && newRole === 'user') {
			this.activateInvention();
		}
		this.role = newRole;
	}

	private activateInvention() {
		this.invitationSentAt = undefined;
	}
}

export class TelegramUser {
	id: number;
	chatId: number | undefined;
	firstName: string | undefined;
	userName: string | undefined;


	constructor(param?: Partial<TelegramUser>) {
		Object.assign(this, param);

	}
}

export class GitlabUserProfile {
	userName: string;
	token: string;
	id: number;
	isTokenOk = false;

	constructor(user?: Partial<GitlabUserProfile>) {
		Object.assign(this, user);
	}
}
