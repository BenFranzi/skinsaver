import {Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {LINKER_REPOSITORY_TOKEN} from './linker.providers';
import {generateUri, ILinker, LinkerEntity} from './linker.entity';

@Injectable()
export class LinkerService {
    constructor(
        @Inject(LINKER_REPOSITORY_TOKEN)
        private readonly linkerRepository: Repository<ILinker>,
    ) { }


    public async generate(currCase) : Promise<LinkerEntity> {
        const linker: LinkerEntity = new LinkerEntity();
        linker.uri = generateUri();
        linker.linkedCase = currCase.id;
        linker.expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        return await this.linkerRepository.save(linker);
    }

    public async getByUri(linkerUri) : Promise<LinkerEntity> {
        try {


        return await this.linkerRepository
            .createQueryBuilder('linker')
            .where('linker.uri = :uri', {uri: linkerUri})
            .leftJoinAndSelect('linker.linkedCase', 'linkedCase')
            .getOne();
        } catch (e) {
            console.log(e);
        }
    }
}

