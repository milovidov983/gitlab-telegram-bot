import { Scene, SceneEnter, SceneLeave, Command, Hears, TelegrafException } from 'nestjs-telegraf';
import { message } from '../../../common/utils';
import { GitlabService } from '../../../gitlab/gitlab.service';
import { UsersService } from '../../../users/users.service';
import { ContextBot } from '../../common/context.interface';
import { GITLAB_TOKEN_SCENE_ID } from '../constants';


@Scene(GITLAB_TOKEN_SCENE_ID)
export class GitlabTokenScene {
	constructor(
		private readonly usersService: UsersService,
		private readonly gitlabService: GitlabService,
	) {

	}

	@SceneEnter()
	onSceneEnter(): string {
		return 'Welcome to GitlabTokenScene. Hello ✋ ' +
			'Plase enter you gitlab token';
	}

	@SceneLeave()
	onSceneLeave(): string {
		return 'Bye Bye 👋';
	}

	@Hears(new RegExp('^.{6,}$'))
	async setToken(ctx: ContextBot): Promise<string> {
		const userId = ctx.from?.id;
		if (!userId) {
			throw new TelegrafException(`Field 'from' is not defined`);
		}
		const token = message(ctx);
		const gitlabProfile = await this.gitlabService.getUser(token);
		if (gitlabProfile) {
			const result = await this.usersService.updateUser(userId, (user) => {
				user.GitlabProfile.token = token;
				user.GitlabProfile.isTokenOk = true;
				user.GitlabProfile.id = gitlabProfile.id;
				user.GitlabProfile.userName = gitlabProfile.username;
			});

			if (result) {
				return `The user with ID ${userId} set new gitlab token successful.`;
			} else {
				return `Error to set new gitlab token to user with ID ${userId}.`;
			}
		} else {
			return 'Token is not valid';
		}
	}




	@Command(['leave', 'exit'])
	async onLeaveCommand(ctx: ContextBot): Promise<void> {
		await ctx.scene.leave();
	}
}
