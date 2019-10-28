import { Module } from '@nestjs/common';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';
import {caseProviders} from './case.providers';
import {CapturesService} from '../captures/captures.service';
import {CapturesModule} from '../captures/captures.module';

@Module({
  imports: [CapturesModule, CasesModule],
  providers: [...caseProviders, CasesService],
  controllers: [CasesController],
  exports: [CasesService]
})
export class CasesModule {}
