import { STORAGE_DISK_PROVIDER } from './disk.constants';
import * as multer from 'multer';
import * as path from 'path';
import config from '../../config'

export const diskStorageProvider = {
  provide: STORAGE_DISK_PROVIDER,
  useFactory: () => {
    const STORAGE_DISK_PATH = config.storageConfig.STORAGE_DISK_PATH;

    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, STORAGE_DISK_PATH);
      },
      filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const name = (file.originalname.length > 20) ? file.originalname.substring(0, 20) : file.originalname;

        // [fieldName]-[date].[ext]
        cb(null, `${name}-${Date.now()}${extension}`);
      },
    });
  },
};
