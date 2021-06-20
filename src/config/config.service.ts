
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../users/database/user.entity';
import { BASE_GITLAB_URL, BOT_TOKEN, MODE, POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER, UPDATE_INTERVAL_MS } from './constants';
require('dotenv').config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string | undefined {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue(MODE, false);
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        const r = {
            type: 'postgres',

            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')!),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),

            //entities: ['**/*.entity{.ts,.js}'],
            entities: [UserEntity],



            synchronize: true,
        };
        return r as TypeOrmModuleOptions;
    }

    public getBotToken(): string {
        const token = this.getValue(BOT_TOKEN, true);
        return token!;
    }

    public getGitlabBaseUrl(): string {
        const url = this.getValue(BASE_GITLAB_URL, true);
        return url!;
    }

    public getUpdateInterval(): number {
        const interval = this.getValue(UPDATE_INTERVAL_MS, true);
        return +interval!;
    }
}

const configService = new ConfigService(process.env).ensureValues([
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
]);

export { configService };
