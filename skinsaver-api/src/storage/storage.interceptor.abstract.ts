import { ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STORAGE_TYPE } from './storage.constants';
import { STORAGE_DISK_PROVIDER } from './disk/disk.constants';
import { STORAGE_S3_PROVIDER } from './s3/s3.constants';

@Injectable()
export abstract class AbstractStorageInterceptor implements NestInterceptor {

  protected abstract readonly storageType: STORAGE_TYPE;
  protected abstract readonly fieldName: string;
  protected abstract readonly required: boolean;

  constructor(
    @Inject(STORAGE_S3_PROVIDER) private storageS3Provider: multer.StorageEngine,
    @Inject(STORAGE_DISK_PROVIDER) private storageDiskProvider: multer.StorageEngine,
  ) {
  }

  public async intercept(
      context: ExecutionContext,
      call$: Observable<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    let request = await ctx.getRequest();

      const upload = multer({
        storage: this.createStorage(),
      })
      const fileOrError = await new Promise((resolve, reject) =>
          upload.array(this.fieldName)(request, request.res, resolve),
      );

      if (fileOrError instanceof Error) {
        throw fileOrError;
      } else {
        request.file = request.files[0];
      }

      if (this.required && !request.file) {
        throw new BadRequestException('File is missing', 'FILE_MISSING_EXCEPTION');
      }
    return call$;
  }


  private createStorage(): multer.StorageEngine {
    switch (this.storageType) {
      case STORAGE_TYPE.AWS_S3:
        return this.storageS3Provider;
      case STORAGE_TYPE.DISK:
        return this.storageDiskProvider;
    }
  }
}
