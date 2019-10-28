import {Controller, Get, Param, Post, Put, UnauthorizedException} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {CapturesService} from './captures.service';
import {UserDecor} from '../users/user.decorator';
import {IUser} from '../users/user.entity';

@ApiUseTags('Captures')
@Controller('captures')
@ApiBearerAuth()
export class CapturesController {
    constructor(private readonly capturesService: CapturesService) {}

    //Note: handling of adding captures is done through cases

    @Get('/:id')
    public async getCapture(
        @UserDecor() viewer: IUser,
        @Param('id') id,
    ) : Promise<any> {
        try {
            const capture = await this.capturesService.get(id, viewer.id);
                return {msg: 'success', capture: capture};
            return new UnauthorizedException('You are not authorized to access this capture.');
        } catch (e) {
            return new UnauthorizedException('Error occurred.', e.message);
        }
    }
}
