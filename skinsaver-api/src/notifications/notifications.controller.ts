import {Body, Controller, Post, Req} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {NotificationsService} from './notifications.service';
import {CreateDto} from './dto/dto';
import {UserDecor} from '../users/user.decorator'
import {IUser} from '../users/user.entity';

@ApiUseTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {

    constructor(
        private readonly notificationsService: NotificationsService,
    ) {
    }

    @Post()
    public async create(
        @UserDecor() viewer: IUser,
        @Req() req,
        @Body() body: CreateDto,
    ) {
        return await this.notificationsService.sendNotification(viewer, body);
    }
}
