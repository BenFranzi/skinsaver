import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {STORAGE_TYPE} from './storage.constants';
import {IStorage, StorageEntity} from './storage.entity';
import {StorageS3Service} from './s3/s3.service';
import {StorageDiskService} from './disk/disk.service';
import {Repository} from 'typeorm'
import {STORAGE_REPOSITORY_TOKEN} from './storage.providers'
import {CaptureEntity} from '../captures/capture.entity';

@Injectable()
export class StorageService {

    constructor(
        @Inject(STORAGE_REPOSITORY_TOKEN) private readonly storageRepository: Repository<IStorage>,
        private storageS3Service: StorageS3Service,
        private storageDiskService: StorageDiskService,
    ) {
    }

    /**
     * Remove StorageEntity
     * @param {StorageEntity} entity
     * @returns {Promise<any>}
     */
    public async remove(entity: StorageEntity): Promise<void> {

        // Remove file from storage
        switch (entity.storageType) {
            case STORAGE_TYPE.AWS_S3:
                await this.storageS3Service.destroy(entity);
                break;
            case STORAGE_TYPE.DISK:
                await this.storageDiskService.destroy(entity);
                break;
        }

        await this.storageRepository.delete(entity);
    }

    /**
     * Save file
     * @param {Express.MulterS3.File} file
     * @param storageType
     * @returns {Promise<StorageEntity>}
     */
    public async save(captureEntity: CaptureEntity, file: any, storageType: STORAGE_TYPE): Promise<StorageEntity> {
        const entity = new StorageEntity();
        entity.mimetype = file.mimetype;
        entity.size = file.size;
        entity.storageType = storageType;
        entity.originalname = file.originalname;
        entity.capture = captureEntity;

        // Depending on storage type used, we have to set proper url
        switch (storageType) {
            case STORAGE_TYPE.AWS_S3:
                entity.filename = file.key;
                entity.url = file.location;
                entity.key = file.key;
                break;
            case STORAGE_TYPE.DISK:
                entity.filename = file.filename;
                entity.url = file.path.split('volumes')[1]; //Note: this will crash if the location is changed
                entity.key = file.path;
                break;
        }

        return await this.storageRepository.save(entity);
    }

    /**
     * Get StorageEntity by url
     * @param {string} url
     * @returns {Promise<StorageEntity>}
     * TODO REWRITE
     */
    public async getByUrl(url: string): Promise<StorageEntity> {
        const entity = await this.storageRepository
            .createQueryBuilder("file")
            .where("file.url = :url", {url: url})
            .getOne();

        if (!entity) throw new BadRequestException('storageEntity');

        return entity;
    }

    /**
     * Get StorageEntity by id
     * @param {string} id
     * @return {Promise<StorageEntity>}
     */
    public async getById(id: string): Promise<StorageEntity> {
        const entity = await this.storageRepository.findOne(id);

        if (!entity) throw new BadRequestException('storageEntity');

        return entity;
    }

    public async getFile(id: string) {
        const entity = await this.storageRepository.findOne(id);
        if (entity) {
            switch (entity.storageType) {
                case STORAGE_TYPE.AWS_S3:
                    return await this.storageS3Service.download(entity);
                case STORAGE_TYPE.DISK:
                    return await this.storageDiskService.download(entity);
            }
        }
    }
}
