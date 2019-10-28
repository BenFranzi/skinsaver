import {BadRequestException, Controller, Get, Param} from '@nestjs/common';
import {LinkerService} from './linker.service';
import {CasesService} from '../cases/cases.service';

@Controller('linker')
export class LinkerController {
    constructor(
        private readonly linkerService: LinkerService,
        private readonly casesService: CasesService,
    ) {}

    @Get('/:linkerId')
    public async get(
        @Param('linkerId') linkerId: string,
    ) : Promise<any> {
        const linker = await this.linkerService.getByUri(linkerId);
        if (!linker) {
            return new BadRequestException('Link does not exist');
        } else {
            if (linker.expiry > new Date()) {
                const currCase = await this.casesService.getWithAll(linker.linkedCase.id);
                delete currCase.user;
                return {msg: 'success', case: currCase};
            } else {
                return new BadRequestException('Link has expired');
            }
        }
    }
}
