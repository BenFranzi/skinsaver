import {Module} from '@nestjs/common';
import {NotificationsController} from './notifications.controller';
import {NotificationsService} from './notifications.service';
import {MailerModule, MailerService} from '../mailer';

@Module({
    imports: [MailerModule.forFeature()],
    controllers: [NotificationsController],
    providers: [NotificationsService, MailerService],
    exports: [NotificationsService, MailerService],
})

export class NotificationsModule {}

