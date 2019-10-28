import { Connection } from 'typeorm';
import { CaseEntity } from './case.entity';

export const CASES_REPOSITORY_TOKEN = 'CasesRepositoryToken';

export const caseProviders = [{
    provide: CASES_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(CaseEntity),
    inject: ['DbConnectionToken'],
}];
