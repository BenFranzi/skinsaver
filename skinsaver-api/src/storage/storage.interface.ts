import { StorageEntity } from './storage.entity';

export interface IStorageService {
  destroy(entity: StorageEntity): Promise<void>;
  download(entity: StorageEntity): Promise<any>;
}
