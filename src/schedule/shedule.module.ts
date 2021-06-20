import { DynamicModule, Module } from '@nestjs/common';
import { SCHEDULE_OPTIONS } from './constants';
import { SheduleService } from './shedule.service';
@Module({})
export class ScheduleModule {
	static forRoot(timeoutMs: number):DynamicModule{
		return{
			module: ScheduleModule,
			providers:[
				{
					provide: SCHEDULE_OPTIONS,
					useValue: timeoutMs
				},
				SheduleService
			],
			exports:[SheduleService]
		}
	}
}
