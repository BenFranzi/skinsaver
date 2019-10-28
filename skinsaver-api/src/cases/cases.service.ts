import { Injectable, Inject } from '@nestjs/common';
import {CASES_REPOSITORY_TOKEN} from './case.providers';
import {Repository} from 'typeorm';
import {CaseEntity, ICase, makeTitle} from './case.entity';
import {IStorage} from '../storage/storage.entity';
import {UserEntity} from '../users/user.entity';
import {StorageService} from '../storage/storage.service';

@Injectable()
export class CasesService {
    constructor(
        @Inject(CASES_REPOSITORY_TOKEN)
        private readonly casesRepository: Repository<ICase>,
        private readonly storageService: StorageService,
    ) {}

    public async get(id: string) : Promise<ICase> {
        return await this.casesRepository.findOne(id);
    }

    public async getWithUser(id: string) : Promise<ICase> {
        return await this.casesRepository.findOne(id, {relations: ['user']});
    }

    public async getWithCaptures(id: string) : Promise<ICase> {
        const currCase: any = await this.casesRepository.findOne(id, {relations: ['captures', 'captures.file']});
        currCase.captures = await Promise.all(currCase.captures.map(async (capture: any) => {
            capture.url = await this.storageService.getFile(capture.file.id);
            delete capture.file;
            return await capture;
        }));
        return currCase;
    }

    public async getWithAll(id: string) : Promise<ICase> {
        const currCase: any = await this.casesRepository.findOne(id, {relations: ['user', 'captures', 'captures.file']}
        );

        currCase.captures = await Promise.all(currCase.captures.map(async (capture: any) => {
            capture.url = await this.storageService.getFile(capture.file.id);
            delete capture.file;
            return await capture;
        }));
        currCase.captures.reverse();
        return currCase;
    }

    public async create(user: UserEntity) : Promise<CaseEntity> {
        const newCase: CaseEntity = new CaseEntity();
        newCase.title = makeTitle();
        newCase.user = user;
        return await this.casesRepository.save(newCase);
    }

    public async getMyCases(userId: string) {
        const cases = await this.casesRepository
            .createQueryBuilder('cases')
            .leftJoinAndSelect('cases.captures', 'captures')
            .leftJoinAndSelect('captures.file', 'file')
            .where('cases.user = :userId', {userId: userId})
            .orderBy('cases.createdDate', 'DESC')
            .getMany();
        return await Promise.all(cases.map(async (item) => {
            const url = await this.storageService.getFile(item.captures[item.captures.length -1].file.id);
            delete item.captures;
            return {...item, url: url};
        }));
    }
}
