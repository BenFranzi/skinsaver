import { Connection } from 'typeorm';
import {LinkerEntity} from './linker.entity';

export const LINKER_REPOSITORY_TOKEN = 'LinkerRepositoryToken';

export const linkerProviders = [{
    provide: LINKER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(LinkerEntity),
    inject: ['DbConnectionToken'],
}];
