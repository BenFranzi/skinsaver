import {BadRequestException, Controller, InternalServerErrorException, Param, Post} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {UserDecor} from '../users/user.decorator';
import {IUser} from '../users/user.entity';
import {CasesService} from '../cases/cases.service';
import {LinkerService} from './linker.service';

@ApiUseTags('Linker Private')
@Controller('linker')
@ApiBearerAuth()
export class LinkerPrivateController {
    constructor(
        private readonly linkerService: LinkerService,
        private readonly casesService: CasesService,
    ) {}

    @Post('generate/:caseId')
    public async generate(
        @Param('caseId') caseId: string,
        @UserDecor() viewer: IUser,
    ) : Promise<any> {
        try {
            const currCase = await this.casesService.getWithUser(caseId);
            if (!currCase) {
                return new BadRequestException('Case does not exist');
            }
            if (viewer.id === currCase.user.id) {
                const linker = await this.linkerService.generate(currCase);
                return {status:'success', linker};
            } else {
                return new BadRequestException('Cannot generate link for case other another user.')
            }
        } catch (e) {
            return new InternalServerErrorException('Error occurred.' + e.message);
        }
    }
}
