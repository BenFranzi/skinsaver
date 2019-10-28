import {Controller, Post, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiUseTags} from '@nestjs/swagger';
import {UsersService} from '../users/users.service';
import {UserDecor} from '../users/user.decorator';
import {IUser} from '../users/user.entity';

@ApiUseTags('Auth Private')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {
    }

    @Post('extend')
    public async extend(@UserDecor() viewer: Partial<IUser>) {
        const token = await this.authService.createToken(viewer.id);
        return {...token};
    }
}
