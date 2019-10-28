import {
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseInterceptors,
    UploadedFile,
    Body,
    UnauthorizedException, BadRequestException
} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {CasesService} from './cases.service';
import {CapturesService} from '../captures/captures.service';
import {UserDecor} from '../users/user.decorator';
import {IUser} from '../users/user.entity';
import { StorageInterceptor } from '../storage/storage.interceptor.mixin';
import config from '../config';
import {IStorage} from '../storage/storage.entity';
import {CreateDto} from './cases.dto';
import {CaseEntity} from './case.entity';
import {UsersService} from '../users/users.service';
import {CaptureEntity} from '../captures/capture.entity';

@ApiUseTags('Cases')
@Controller('cases')
@ApiBearerAuth()
export class CasesController {
    constructor(
        private readonly casesService: CasesService,
        private readonly capturesService: CapturesService,
        private readonly usersService: UsersService,
    ) {}

    @Post('/new')
    @UseInterceptors(StorageInterceptor('file', config.storageConfig.STORAGE_TYPE))
    public async createAndCapture(
        @Body() body: CreateDto,
        @UserDecor() viewer: IUser,
        @UploadedFile() file: IStorage,
    ) : Promise<any> {
        if (!body.predictions) {throw new BadRequestException('No predictions provided.')}
        try {
            let currCase: CaseEntity = await this.casesService.create(await this.usersService.getById(viewer.id));
            await this.capturesService.add(currCase, file, JSON.parse(body.predictions));
            return {msg: 'success', case: {id: currCase.id, title: currCase.title}};
        } catch (e) {
            console.log(e.message);
            return new UnauthorizedException('Error occurred.', e.message);
        }

    }

    @Post('/add/:case')
    @UseInterceptors(StorageInterceptor('file', config.storageConfig.STORAGE_TYPE))
    public async addCapture(
        @Body() body: CreateDto,
        @UserDecor() viewer: IUser,
        @Param('case') id: string,
        @UploadedFile() file: IStorage,
    ) : Promise<any> {
        if (!body.predictions) {throw new BadRequestException('No predictions provided.')}
        try {
            let currCase = await this.casesService.getWithUser(id);
            if (currCase.user.id === viewer.id) {
                const capture = await this.capturesService.add(currCase, file, JSON.parse(body.predictions));
                return {msg: 'success', case: {id: currCase.id, title: currCase.title}, capture: capture};
            } else {
                return new UnauthorizedException('You are not authorized to modify this case.');
            }
        } catch (e) {
            return new UnauthorizedException('Error occurred.', e.message);
        }
    }

    @Post('/title/:case')
    public async rename(
        @UserDecor() viewer: IUser,
        @Param('case') id: string,
    ) : Promise<any> {
        return {msg: 'success'};
    }


    @Get('/me')
    public async getMyCases(
        @UserDecor() viewer: IUser,
    ) : Promise<any> {
        try {
            const cases = await this.casesService.getMyCases(viewer.id);
            return {msg: 'success', cases};
        } catch (e) {
            return new UnauthorizedException('Error occurred.', e.message);
        }
    }


    @Get('/:id')
    public async getCase(
        @UserDecor() viewer: IUser,
        @Param('id') id,
    ) : Promise<any> {
        try {
            const currCase = await this.casesService.getWithAll(id);
            if (currCase.user.id === viewer.id) {
                delete currCase.user;
                return {msg: 'success', case: currCase};
            }
            return new UnauthorizedException('You are not authorized to modify this case.');
        } catch (e) {
            return new UnauthorizedException('Error occurred.', e.message);
        }
    }
}
