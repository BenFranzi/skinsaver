import {Controller, Post, Body, BadRequestException, UnauthorizedException, Put} from '@nestjs/common';
import {AuthRegisterDto, AuthLoginDto, PasswordForgotDto, PasswordResetDto} from './auth.dto';
import { AuthService } from './auth.service';
import { ApiUseTags } from '@nestjs/swagger';
import {IUser} from '../users/user.entity';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthPublicController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    public async login(@Body() body: AuthLoginDto) {
        const user = await this.authService.validateCredentials(body as IUser);
        if (!user) {
            throw new UnauthorizedException();
        }
        const token = await this.authService.createToken(user);
        return {...token, user};
    }

    @Put('register')
    public async register(@Body() body: AuthRegisterDto) {
        try {
            const user: IUser = await this.authService.registerUser(body as Partial<IUser>);
            if (user.email) {
                const token = await this.authService.createToken(user);
                return {...token, user};
            } else {
                throw new BadRequestException();
            }
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    @Post('password-forgot')
    public async passwordForgot(@Body() body: PasswordForgotDto) {
        const {email} = body;
        const res = await this.authService.passwordForgot(email.toLowerCase().trim());
        if (res === true) {
            return {password: 'Request accepted'};
        }

        throw new BadRequestException('Failed to request a password reset');
    }

    @Post('password-reset')
    public async passwordReset(@Body() body: PasswordResetDto) {
        const {token, password} = body;
        const user = await this.authService.passwordReset(token, password);
        const userToken = await this.authService.createToken(user);
        return {...userToken, user: user};
    }
}
