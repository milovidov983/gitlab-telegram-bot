import { Injectable } from '@nestjs/common';
import { ShortMergeRequestState } from '../../common/shared.models';
import { User, } from '../../users/users.models';
import { UsersService } from '../../users/users.service';
import { MergeRequest, MergeRequests, NotificationRawData } from '../gitlab.models';
import { GitlabService } from '../gitlab.service';


@Injectable()
export class GitlabMergeRequestCollectorService {
	constructor(
		private readonly gitlabService: GitlabService,
		private readonly usersService: UsersService) { }

	public async startCollectionMrs(users: User[]): Promise<NotificationRawData[]> {
		// Updating user data
		const actualGitlabProfile = await this.gitlabService.getAllActiveUsers(users);
		// compare actual and persisted and save



		const allPromise = [] as Promise<NotificationRawData[]>[];
		for (const user of users) {
			const promise = this.collectDataToNotification(user);
			allPromise.push(promise);
		}
		const res = await Promise.all(allPromise);
		return res.reduce((a, b) => a.concat(b), []);
	}

	private async collectDataToNotification(user: User): Promise<NotificationRawData[]> {
		const mrs = await this.gitlabService.getUpdatedMergeRequests(user);
		const rawData = await this.handleMergeRequests(user, mrs);
		// TODO dont forget!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// await this.usersService.recordSyncTimeAndSave(user);
		return rawData;
	}

	private async handleMergeRequests(user: User, mrs: MergeRequests<MergeRequest[]>): Promise<NotificationRawData[]> {
		const openedNotificationPromise = this.handleUserMergeRequestsWithState({
			user: user,
			mrs: mrs.opened,
			notificationType: 'opened',
			isProcessMrAuthor: false,
		});
		const closedNotificationPromise = this.handleUserMergeRequestsWithState({
			user: user,
			mrs: mrs.closed,
			notificationType: 'closed',
			isProcessMrAuthor: true,
		});
		const mergedNotificationPromise = this.handleUserMergeRequestsWithState({
			user: user,
			mrs: mrs.merged,
			notificationType: 'merged',
			isProcessMrAuthor: true,
		});

		const result = await Promise.all([
			openedNotificationPromise,
			closedNotificationPromise,
			mergedNotificationPromise,
		]);

		const allPromises = [] as Promise<NotificationRawData>[];
		for (const mr of result) {
			if (mr?.newDataToNotify) {
				mr.newDataToNotify.forEach((item) => {
					const updatePromise = this.updateMergeRequestPersisted(item);
					allPromises.push(updatePromise);
				});
			}
		}
		const total = await Promise.all(allPromises);

		console.log(`Updated: ${total.length}`);

		return total;
	}

	private async handleUserMergeRequestsWithState(args: {
		user: User;
		mrs: MergeRequest[];
		notificationType: ShortMergeRequestState;
		isProcessMrAuthor: boolean; // Если user автор MR в любом случае высылать нотификацию
	}): Promise<{ newDataToNotify: NotificationRawData[] } | undefined> {
		const { user, mrs, notificationType, isProcessMrAuthor } = args;
		if (!mrs || mrs.length < 1) {
			return;
		}
		// Коллекция с MR которые необходимо будет перезаписать в базе т.к.
		// они либо отсутсвуют, либо их статус изменился
		const updateCollection = [] as NotificationRawData[];



		for (const currentMergeRequest of mrs) {



			// Проверяем кто является автором MR
			const currentUserIsAuthorCurrentMr =
				currentMergeRequest.author.id === user.gitlab.id;

			if (!isProcessMrAuthor && currentUserIsAuthorCurrentMr) {
				// Если не указано явным образом обрабатывать автора MR
				// и автор MR совпадает с текущим пользователем
				// то пропускаем итерацию, т.к. это должен быть случай
				// когда пользователь поставиль MR сам на себя
				continue;
			}

			// Получаем сохранённые данные MR с прошлого раза
			const persistedMr = await this.getPersistedMergeRequestOrDefault({
				projectId: currentMergeRequest.project_id,
				mergeRequestId: currentMergeRequest.id,
			});

			if (persistedMr) {
				const mrStateIsChanged = currentMergeRequest.state !== persistedMr.state;
				if (!mrStateIsChanged) {
					// Статус MR не изменился с момента последней проверки
					// Действий не требуется
					continue;
				}
			}
			//this.sendNotification(user.Id, currentMergeRequest, notificationType);
			updateCollection.push({
				mr: currentMergeRequest,
				user,
				state: notificationType
			});
		}
		return { newDataToNotify: updateCollection };
	}

	// #region STORAGE
	private async getPersistedMergeRequestOrDefault(id: {
		projectId: number;
		mergeRequestId: number;
	}): Promise<MergeRequest | null> {
		const result = await this.gitlabService.getMergeRequestById({
			projectId: id.projectId,
			mergeRequestId: id.mergeRequestId,
		});
		return result;
	}
	private async updateMergeRequestPersisted(args: NotificationRawData): Promise<NotificationRawData> {
		await this.gitlabService.saveMergeRequest(args.mr);
		return args;
	}
	//#endregion

	//#region  NOTIFICATIONS
	private sendNotification(
		userId: number,
		currentMr: MergeRequest,
		type: ShortMergeRequestState
	) {
		console.log(this.sendNotification.name);
	}
	//#endregion
}