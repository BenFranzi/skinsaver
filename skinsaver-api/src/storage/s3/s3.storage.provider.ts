import { AWS_S3_PROVIDER, STORAGE_S3_PROVIDER } from './s3.constants';
import * as s3Storage from 'multer-s3';
import { S3 } from 'aws-sdk';
import config from '../../config';
import * as path from "path"

export const s3StorageProvider = {
  provide: STORAGE_S3_PROVIDER,
  useFactory: (awsS3Provider: S3) => {
    const AWS_S3_BUCKET = config.storageConfig.AWS_S3_BUCKET;

    return s3Storage({
      s3: awsS3Provider,
      bucket: AWS_S3_BUCKET,
      contentType: s3Storage.AUTO_CONTENT_TYPE,
      metadata:
        (req, file, cb) => {
          const headersArray = file;
          headersArray.originalname = encodeURI(file.originalname);
          cb(null, Object.assign({}, headersArray));
        },
      key:
        (req, file, cb) => {
          const extension = path.extname(file.originalname);
          const name = encodeURI(file.originalname).substring(0, 20);
          cb(null, `${name}-${Date.now().toString()}.${extension}`);
        },
    });
  },
  inject: [AWS_S3_PROVIDER],
};
