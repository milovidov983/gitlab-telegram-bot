export interface Executable {
    execute: <T,R>(arg: T) => Promise<R>
}
export class SheduleItem {
    userId: number;
    intervalMs: number;
    lastCheckDateTime: Date;
}