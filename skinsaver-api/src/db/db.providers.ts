import { createConnection } from 'typeorm';
import config from '../config';
import {StorageEntity} from '../storage/storage.entity';
import {UserEntity} from '../users/user.entity';
import {CaseEntity} from '../cases/case.entity';
import {CaptureEntity} from '../captures/capture.entity';
import {LinkerEntity} from '../linker/linker.entity';


// TODO: Abstract this to the global config
export const dbProviders =
    {
        provide: 'DbConnectionToken',
        useFactory: async () => await createConnection({
            type: 'postgres',
            url: config.databaseConfig.DATABASE_URL,
            entities: [
                UserEntity,
                CaseEntity,
                CaptureEntity,
                StorageEntity,
                LinkerEntity,
            ],
            synchronize: true//(config.NODE_ENV === 'development'), // DEV only, do not use on PROD!
        }),
    };
