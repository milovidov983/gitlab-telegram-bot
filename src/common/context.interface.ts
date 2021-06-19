import { Scenes } from 'telegraf';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextBot extends Scenes.SceneContext {

}

export function validate(ctx: ContextBot | undefined): string | undefined {
    if(!ctx){
        return `Context is undefined`;
    }
    if(ctx.message === undefined){
        return `Message is undefined`;

    }
    if(ctx.message.from === undefined){
        return `From is undefined`;

    }
    if(ctx.message.from.id === undefined){
        return `Id is undefined`;

    }

}