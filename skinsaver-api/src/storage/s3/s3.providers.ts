import { S3 } from 'aws-sdk';
import { AWS_S3_PROVIDER } from './s3.constants';
import config from '../../config'

export const awsS3Providers = [
  {
    provide: AWS_S3_PROVIDER,
    useFactory: () => {
      const AWS_S3_REGION = config.storageConfig.AWS_S3_REGION;

      return new S3({
        accessKeyId: config.storageConfig.AWS_S3_ACCESSKEYID,
        secretAccessKey: config.storageConfig.AWS_S3_SECRETACCESSKEY,
        region: AWS_S3_REGION,
      });
    },
  },
];
