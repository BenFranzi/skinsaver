import {BadRequestException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {CaseEntity, ICase} from '../cases/case.entity';
import {IStorage, StorageEntity} from '../storage/storage.entity';
import {Repository} from 'typeorm';
import {CAPTURE_REPOSITORY_TOKEN} from './capture.providers';
import {CaptureEntity, ICapture} from './capture.entity';
import {UserEntity} from '../users/user.entity';
import {StorageService} from '../storage/storage.service';
import config from '../config';

@Injectable()
export class CapturesService {
    constructor(
        @Inject(CAPTURE_REPOSITORY_TOKEN)
        private readonly captureRepository: Repository<ICapture>,
        private readonly storageService: StorageService,
    ) {}

    public async get(id: string, userId: string) : Promise<any> {
        const capture = await this.captureRepository.findOne(id, {relations: ['file', 'case', 'case.user']});
        if (!capture) {
            throw new BadRequestException('Invalid case request.');
        }
        if (capture.case.user.id !== userId) {
            throw new UnauthorizedException('Unauthorised.');
        }

        const url = await this.storageService.getFile(capture.file.id);
        delete capture.file;
        delete capture.case;
        return {...capture, url};
    }

    public async add(currCase: CaseEntity, file: IStorage, predictions: object) : Promise<CaptureEntity> {

        let capture = new CaptureEntity();
        capture.case = currCase;
        capture.prediction = predictions[0].className;
        capture.certainty = predictions[0].probability;
        capture.results = predictions;
        capture = await this.captureRepository.save(capture);
        await this.storageService.save(capture, file, config.storageConfig.STORAGE_TYPE);
        delete capture.case;
        return capture;
    }

    public async link(id: string) : Promise<string> {
        const capture = await this.captureRepository.findOne(id, {relations: ['file']});
        return await this.storageService.getFile(capture.file.id);
    }
}
