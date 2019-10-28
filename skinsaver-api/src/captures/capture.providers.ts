import { Connection } from 'typeorm';
import {CaptureEntity} from './capture.entity';

export const CAPTURE_REPOSITORY_TOKEN = 'CaptureRepositoryToken';

export const captureProviders = [{
    provide: CAPTURE_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getRepository(CaptureEntity),
    inject: ['DbConnectionToken'],
}];
