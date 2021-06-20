import { Inject, Injectable, Logger } from "@nestjs/common";
import { SCHEDULE_OPTIONS } from "./constants";

@Injectable()
export class SheduleService {
    private readonly logger = new Logger(SheduleService.name);
    private readonly timeoutIntervalMs: number;
    intervalId: NodeJS.Timeout | undefined;

    constructor(@Inject(SCHEDULE_OPTIONS) timeoutMs: number) {
        if (timeoutMs > 0) {
            this.timeoutIntervalMs = timeoutMs;
        } else {
            this.timeoutIntervalMs = 5000;
        }
    }

}