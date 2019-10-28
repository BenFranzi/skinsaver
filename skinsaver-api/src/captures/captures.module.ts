import { Module } from '@nestjs/common';
import { CapturesService } from './captures.service';
import {CapturesController} from './captures.controller';
import {captureProviders} from './capture.providers';
import {StorageModule} from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [CapturesController],
  providers: [...captureProviders, CapturesService],
  exports: [CapturesService]
})
export class CapturesModule {}
