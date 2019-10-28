import { Module } from '@nestjs/common';
import { LinkerController } from './linker.controller';
import { LinkerService } from './linker.service';
import {CapturesModule} from '../captures/captures.module';
import {linkerProviders} from './linker.providers';
import {LinkerPrivateController} from './linker.private.controller';

@Module({
  imports: [CapturesModule],
  controllers: [LinkerController, LinkerPrivateController],
  providers: [...linkerProviders, LinkerService]
})
export class LinkerModule {}
