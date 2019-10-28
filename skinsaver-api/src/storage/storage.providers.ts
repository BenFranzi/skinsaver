import { Connection } from 'typeorm';
import {StorageEntity} from './storage.entity'

export const STORAGE_REPOSITORY_TOKEN = 'UsersRepositoryToken';

export const storageProviders = [{
    provide: STORAGE_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(StorageEntity),
    inject: ['DbConnectionToken'],
}];
