import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitlabDatabaseService } from './gitlab-db.service';
import { GitlabMergeRequestEntity } from './gitlab-mr.entity';

@Module({
	imports: [TypeOrmModule.forFeature([GitlabMergeRequestEntity])],
	providers: [GitlabDatabaseService],
	exports: [GitlabDatabaseService],
})
export class GitlabDatabaseModule { }
