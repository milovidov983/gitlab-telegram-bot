export type UserStatus = 'stopped' | 'active';
export type Role = 'guest' | 'user' | 'admin';

export class User {
	telegram: TelegramUser;
	gitlab?: GitlabUser;

	role: Role = 'guest';
	status: UserStatus = 'active';

	isDeleted = false;
	registrationDate: Date = new Date();
	lastActivity: Date = new Date();

	get isTokenOk() {
		return this.gitlab?.isTokenOk ?? false;
	}
}

export class TelegramUser {
	id: number;
	chatId: number | undefined;
	firstName: string | undefined;
	userName: string | undefined;
}

export class GitlabStats {
	totalCreatedMr:  0;
}

export class GitlabUser {
	userName: string;
	token: string;
	id: number;
	isTokenOk = false;
	stats: GitlabStats = new GitlabStats();
}
