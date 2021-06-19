export interface GitlabConnectorModuleOptions {
	baseUrl: string;
}

export interface GitlabUser {
	id: number;
	name: string;
	username: string;
	state: string;
	avatar_url: string;
	web_url: string;
	created_at: Date;
	bio: string;
	bio_html: string;
	location: string;
	public_email: string;
	skype: string;
	linkedin: string;
	twitter: string;
	website_url: string;
	organization: string;
	job_title: string;
	bot: boolean;
	work_information?: any;
	followers: number;
	following: number;
	last_sign_in_at: Date;
	confirmed_at: Date;
	last_activity_on: string;
	email: string;
	theme_id: number;
	color_scheme_id: number;
	projects_limit: number;
	current_sign_in_at: Date;
	identities: any[];
	can_create_group: boolean;
	can_create_project: boolean;
	two_factor_enabled: boolean;
	external: boolean;
	private_profile: boolean;
	commit_email: string;
}
