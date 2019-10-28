import {IStorageService} from '../storage.interface';
import {StorageEntity} from '../storage.entity';
import {S3} from 'aws-sdk';
import {Injectable, Inject, BadRequestException} from '@nestjs/common';
import {AWS_S3_PROVIDER} from './s3.constants';
import config from '../../config'
import {S3Object} from 'aws-sdk/clients/rekognition'

@Injectable()
export class StorageS3Service implements IStorageService {

    private readonly AWS_S3_BUCKET = config.storageConfig.AWS_S3_BUCKET

    constructor(
        @Inject(AWS_S3_PROVIDER) private awsS3: S3,
    ) {
    }

    public async destroy(entity: StorageEntity): Promise<void> {
        // If we change ENV->AWS_S3_BUCKET after save, this will fail
        await this.awsS3.deleteObject({
            Bucket: this.AWS_S3_BUCKET,
            Key: entity.key,
        }).promise();
    }

    public async download(entity: StorageEntity): Promise<any> {
        return await this.awsS3.getSignedUrl('getObject', {
            Bucket: this.AWS_S3_BUCKET,
            Key: entity.key,
            Expires: 60 * 24,
        });
    }

}
