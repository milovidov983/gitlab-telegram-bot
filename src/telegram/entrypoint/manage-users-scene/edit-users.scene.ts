import { Scene, SceneEnter, SceneLeave, Command, Hears } from 'nestjs-telegraf';
import { getStateValue, message } from '../../../common/utils';
import { Role } from '../../../users/users.models';
import { UsersService } from '../../../users/users.service';
import { ContextBot } from '../../common/context.interface';
import { EDIT_USERS_SCENE_ID } from '../constants';


@Scene(EDIT_USERS_SCENE_ID)
export class EditUsersScene {
	constructor(private readonly usersService: UsersService) {

	}

	@SceneEnter()
	onSceneEnter(): string {
		return 'Welcome to EditUsersScene. Hello ✋ ' +
			'Plase enter user ID to edit or use command ls to list all users.';
	}

	@SceneLeave()
	onSceneLeave(): string {
		return 'Bye Bye 👋';
	}

	@Hears(['admin', 'user', 'guest'])
	async setNewRole(ctx: ContextBot): Promise<string> {
		const confirm = getStateValue(ctx, 'confirm');
		const userId = getStateValue(ctx, 'userId');
		const role = message(ctx);
		if (confirm) {
			const result = await this.usersService.updateUser(+userId, (user) => {
				user.role = role as Role;
			});
			if (result) {

				return `The user with ID ${userId} was assigned the ${role} role successful.`;
			}
		}
		return 'Operation cacncelled';
	}

	@Hears(['no', 'n'])
	no(ctx: ContextBot): string {
		ctx.session.__scenes.state = {};
		return 'Operation cacncelled';
	}

	@Command(['role'])
	async changeRole(ctx: ContextBot): Promise<string> {
		console.log(JSON.stringify(ctx.session.__scenes.state));

		return 'role'
	}

	@Hears(['yes', 'y'])
	yes(ctx: ContextBot): string {
		if (ctx.session.__scenes.state) {
			(ctx.session.__scenes.state as any).confirm = true;
		}
		return `Enter new Role to user with ID ${getStateValue(ctx, 'userId')}`;
	}

	@Hears(new RegExp('^[0-9]+$'))
	async enterUserId(ctx: ContextBot): Promise<string> {
		const id = message(ctx);
		const user = await this.usersService.findUserByTelegramId(+id);

		if (user && typeof user !== 'string') {
			ctx.session.__scenes.state = {
				userId: id,
				role: user.role,
				confirm: false
			}
			return `You have selected the user ${user.TelegramData.firstName} ' +
			'ID ${user.Id} with role ${user.role}, ' +
			'do you really want to edit him(yes/no)?`
		}
		return 'User with id ' + id + ' not found';
	}

	@Command(['ls'])
	async userList(ctx: ContextBot): Promise<string> {
		const users = await this.usersService.getAll();
		let counter = 1;
		let message = '';
		for (const user of users) {
			message += `--- [${counter++}]---\n`
			message += `${JSON.stringify(user.TelegramData, null, 2)}\n`
			message += `--------------------------\n`
		}
		return message;
	}



	@Command(['leave', 'exit'])
	async onLeaveCommand(ctx: ContextBot): Promise<void> {
		await ctx.scene.leave();
	}
}
