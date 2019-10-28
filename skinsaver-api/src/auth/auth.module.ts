import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './middlewares/jwt.strategy';
import {AuthController} from './auth.controller';
import {AuthPublicController} from './auth.public.controller';

@Module({
    imports: [UsersModule],
    controllers: [AuthController, AuthPublicController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {
}
