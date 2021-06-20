export type UserStatus = 'stopped' | 'active';
export type Role = 'guest' | 'user' | 'admin';
export type GitlabEventType  = 
	'mergeRequestNew'
	| 'mergeRequestClosed'
	| 'mergeRequestReopened';
export class User {
	telegram: TelegramUser;
	gitlab?: GitlabUser;

	role: Role = 'guest';
	status: UserStatus = 'active';

	isDeleted = false;
	registrationDate: Date = new Date();
	lastActivity: Date = new Date();
	invitationSent?: Date;

	get UserName(){
		return this.gitlab?.userName || 'User_'+this.telegram.id;
	}

	get IsGuest() {
		return this.role ==='guest' || !this.role;
	}

	get InvationRetryInDay(){
		return 7;
	}

	get IsNeedToSendInvitationNow(): boolean {
		const userActive = !this.isDeleted 
		&& this.role === 'user'
		&& this.status === 'active';

		const isNotSent = userActive
			&& !this.invitationSent;

		if(isNotSent){
			return true;
		}

		const isRetry = userActive
		&& !this.gitlab
		&& this.invitationSent
		&& this.InvationRetryInDay < this.getLastNotificationInDays() 

		if(isRetry || isRetry === undefined){
			return true;
		}
		return false;
	}

	private getLastNotificationInDays() : number {
		if(!this.invitationSent){
			return 0;
		}
		const invitationSent = this.invitationSent.getTime();
		const now = (new Date()).getTime() ;

		const diff = Math.abs(now - invitationSent);
		return Math.ceil(diff / (1000 * 3600 * 24));
	}

	constructor(args?: Partial<User>){
		Object.assign(this, args);
	}
}

export class TelegramUser {
	id: number;
	chatId: number | undefined;
	firstName: string | undefined;
	userName: string | undefined;
}

export class GitlabStats {
	totalCreatedMr  = 0;
}

export class GitlabUser {
	userName: string;
	token: string;
	id: number;
	isTokenOk = false;
	stats: GitlabStats = new GitlabStats();

	subscribedOnEvents: GitlabEventType[];
}
