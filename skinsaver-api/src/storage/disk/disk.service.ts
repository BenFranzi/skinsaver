import {IStorageService} from '../storage.interface';
import {StorageEntity} from '../storage.entity';
import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import config from '../../config'

@Injectable()
export class StorageDiskService implements IStorageService {

    private readonly STORAGE_DISK_PATH = config.storageConfig.STORAGE_DISK_PATH;

    public async destroy(entity: StorageEntity): Promise<void> {
        await new Promise((resolve, reject) => {
            fs.unlink(
                // If we change ENV->STORAGE_DISK_PATH after save, this will fail
                path.join(this.STORAGE_DISK_PATH, entity.key),
                err => err ? reject(err) : resolve(),
            );
        });
    }

    public async download(entity: StorageEntity): Promise<any> {
        // return config.hostConfig.BASE_URL_SERVER + entity.url;
        return "http://172.20.10.3:3001" + entity.url;
    }

}
