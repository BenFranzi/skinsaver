import {networkInterfaces} from "os"
import * as path from "path"
import {STORAGE_TYPE} from './storage/storage.constants'

const getLocalExternalIp = () => [].concat.apply([], Object.values(networkInterfaces()))
    .filter((details) => details.family === 'IPv4' && !details.internal)
    .pop();

const BASE_PATH = '/api/v1';
const DOCS_PATH = '/docs';
const PORT = process.env.PORT || 3001;
const localExternalIp = getLocalExternalIp();
const host_url = process.env.HOST_URL || `http://${localExternalIp.address}:${PORT}`;

const authConfig = {
    JWT_SECRET: process.env.JWT_SECRET || 'thecakeisalie',
    JWT_EXPIRY: parseInt(process.env.JWT_EXPIRY, 10) || 60 * 60 * 24,
};

const hostConfig = {
    BASE_URL_SERVER: host_url,
    PORT: PORT,
    BASE_PATH: BASE_PATH,
    DOCS_PATH: DOCS_PATH,
    HOST_URL: `${host_url}${BASE_PATH}`,
    DOCS_URL: `${host_url}${DOCS_PATH}`,
    BASE_SITE_URL: process.env.SITE_URL || `${host_url}${BASE_PATH}`,
}

const storageType = (process.env.STORAGE_TYPE === 'AWS_S3') ? STORAGE_TYPE.AWS_S3 : STORAGE_TYPE.DISK;

const storageConfig = {
    STORAGE_TYPE: STORAGE_TYPE.AWS_S3,
    STORAGE_DISK_PATH: process.env.STORAGE_DISK_PATH || './volumes/uploads/',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_ACCESSKEYID: process.env.AWS_S3_ACCESSKEYID,
    AWS_S3_SECRETACCESSKEY: process.env.AWS_S3_SECRETACCESSKEY,
}


const databaseConfig = {
    DATABASE_URL: process.env.DATABASE || 'postgres://root:thecakeisalie@localhost:5432/skinsaver',
}

const defaultFileUploadDir = path.resolve(__dirname, '../../uploads');


export enum MailerProvider {
    sendgrid = 'sendgrid',
    dev = 'dev',
}

const mailerConfig = {
    fromAddress: process.env.MAILER_FROM_ADDRESS || 'no-reply@example.com',
    provider: process.env.MAILER_PROVIDER === 'sendgrid' ? MailerProvider.sendgrid : MailerProvider.dev,
    sendgrid: {
        type: MailerProvider.sendgrid,
        apiKey: process.env.MAILER_API_KEY || 'mailer key',
    },
    dev: {
        type: MailerProvider.dev,
    },
};

export default {
    authConfig,
    hostConfig,
    storageConfig,
    databaseConfig,
    mailer: mailerConfig,
    NODE_ENV: process.env.NODE_ENV || 'development',
};
