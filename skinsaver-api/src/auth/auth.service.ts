import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { JWTPayload } from './auth.interface';
import * as crypto from 'crypto';
import {NotificationsService} from '../notifications/notifications.service';
import {IUser} from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService,
    ) {}

    public async registerUser(preUser: Partial<IUser>): Promise<IUser> {
        const user = await this.usersService.create(preUser);
        delete user.salt;
        delete user.password;
        delete user.resetPasswordToken;
        if (!user.id ) {
            throw new BadRequestException('user already exists.');
        } else {
            return user;
        }
    }

    public async createToken(modelOrId: IUser | string): Promise<{token: string, expires_in: number}> {
        const {JWT_SECRET, JWT_EXPIRY} = config.authConfig;
        let user: IUser;
        if (typeof modelOrId === 'string') {
            user = await this.usersService.getById(modelOrId);
        } else {
            user = modelOrId;
        }
        if (user) {
            const userData: JWTPayload = {id: user.id, email: user.email, role: user.role, updatedDate: user.updatedDate.getTime()};
            const token = await jwt.sign(userData, JWT_SECRET, {expiresIn: JWT_EXPIRY});
            return {token, expires_in: JWT_EXPIRY};
        } else {
            throw new BadRequestException();
        }
    }

    /**
     * Used for initial login
     */
    public async validateCredentials(user: Partial<IUser>) {
        if (!user.email || !user.password) {
            return null;
        }
        const foundUser = await this.usersService.getByEmail(user.email.toLowerCase().trim());
        if (foundUser) {
            return await foundUser.authenticate(user.password);
        }
        return null;
    }

    /**
     * Used for jwt authentication. Checks that the jwt token is valid
     */
    public async validateUser(token): Promise<IUser> {
        if (!token.email) {
            return null;
        }
        const user = await this.usersService.getById(token.id);
        if (user) {
            if (user.updatedDate.getTime() !== token.updatedDate || user.role !== token.role) {
                return null;
            }
            return user;
        }
        return null;
    }

    public passwordForgot = async (email): Promise<boolean> => {
        if (!email) {
            throw new BadRequestException('Expected email');
        }

        const user = await this.usersService.getByEmail(email.toLowerCase().trim());

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const token = this.randomString(26);
        email = email.toLowerCase().trim();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await this.usersService.save(user);
        const notficationResult = await this.notificationsService.sendNotification(null, {type: 'PASSWORD_RESET', payload: {token, email}});
        return true;
    }

    /**
     * From nestkit, reconsider the security of this function
     */
    private randomString(size) {
        if (size === 0) {
            throw new Error('Zero-length randomString is useless.');
        }
        const chars = (
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz' +
            '0123456789'
        );
        let objectId = '';
        const bytes = crypto.randomBytes(size);
        for (let i = 0; i < bytes.length; ++i) {
            objectId += chars[bytes.readUInt8(i) % chars.length];
        }
        return objectId;
    }

    public passwordReset = async (token: string, newPassword: string): Promise<IUser> => {
        if (!token || !newPassword) {
            throw new BadRequestException('Expected email');
        }

        if (newPassword.length < 8) {
            throw new BadRequestException('New password shorter than 8 characters');
        }

        const user = await this.usersService.getByResetToken(token);

        if (!user) {
            throw new BadRequestException('Request invalid.');
        } else if (user.resetPasswordToken !== token || user.resetPasswordExpires < new Date()) {
            throw new BadRequestException('Password reset token is invalid or has expired.');
        }
        await user.changePassword(newPassword);
        const mailerResult = await !this.notificationsService.sendPasswordChangedEmail(user.email);
        return user;
    }
}
