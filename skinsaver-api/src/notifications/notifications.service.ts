import {Injectable} from '@nestjs/common';
import * as fallbackTemplates from './fallback-templates';
import {IMail, MailerService} from '../mailer';
import config from '../config'
import {IUser} from '../users/user.entity';


@Injectable()
export class NotificationsService {

    constructor(
        private readonly mailerService: MailerService,
    ) {
    }

    /**
     * Creates a new job
     */
    public async sendNotification(viewer: IUser, notification: any): Promise<any> {
        const {type, payload} = notification;
        switch (type) {
            case 'PASSWORD_RESET':
                return this.sendPasswordResetEmail(viewer, payload);
            case 'PASSWORD_CHANGED':
                return this.sendPasswordChangedEmail(payload);
        }
    }

    public async sendPasswordResetEmail(viewer: IUser, {email, token}) {


        let html = '';
        let resetLink = `${config.hostConfig.BASE_SITE_URL}/auth/password/reset?email=${email}&token=${token}`;
        if (config.NODE_ENV === 'development') {
            resetLink = `localhost:${config.hostConfig.PORT}/auth/password/reset?email=${email}&token=${token}`;
        }
        html = fallbackTemplates.passwordReset(resetLink, email, token);

        const data: IMail = {
            to: email,
            from: config.mailer.fromAddress,
            subject: 'Password Reset Requested',
            html: html,
            type: 'sendPasswordResetEmail',
            metadata: {token: token},
        };
        return this.mailerService.sendMail(data);
    }

    public async sendPasswordChangedEmail(email: string) {

        let html = '';
        html = fallbackTemplates.resetConfirmation(email);

        const data: IMail = {
            to: email,
            from: config.mailer.fromAddress,
            subject: 'Password Changed',
            html: html,
            type: 'sendPasswordChangedEmail',
        };

        return this.mailerService.sendMail(data);
    }
}
