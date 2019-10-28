import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { s3StorageProvider } from './s3/s3.storage.provider';
import { diskStorageProvider } from './disk/disk.storage.provider';
import { awsS3Providers } from './s3/s3.providers';
import { StorageS3Service } from './s3/s3.service';
import { StorageDiskService } from './disk/disk.service';
import {DBModule} from '../db/db.module'
import {storageProviders} from './storage.providers'
import {StorageController} from './storage.controller'

@Module({
  imports: [
    DBModule
  ],
  controllers: [StorageController],
  providers: [
    StorageService,
      ...storageProviders,
    // S3 Storage provider
    ...awsS3Providers, // API Provider
    s3StorageProvider, // Multer Storage Provider
    StorageS3Service,  // Service for modifying uploaded data

    // DISK Storage Provider
    diskStorageProvider, // Multer Storage Provider
    StorageDiskService, // Service for modifying uploaded data
  ],
  exports: [
    StorageService,
    ...awsS3Providers,
    s3StorageProvider,
    diskStorageProvider,
  ],
})
export class StorageModule {
}
