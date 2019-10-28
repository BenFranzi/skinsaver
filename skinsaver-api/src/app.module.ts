import {Global, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JWTAuthMiddleware } from './auth/middlewares/jwt.auth.middleware';
import { LoggerMiddleware } from './utils/middlewares/logger.middleware';
import {UsersController} from './users/users.controller';
import {StorageModule} from './storage/storage.module';
import {AuthController} from './auth/auth.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { CasesModule } from './cases/cases.module';
import { CapturesController } from './captures/captures.controller';
import { CapturesModule } from './captures/captures.module';
import config from './config';
import {CasesController} from './cases/cases.controller';
import {MailerModule} from './mailer';
import { LinkerModule } from './linker/linker.module';
import {LinkerPrivateController} from './linker/linker.private.controller';

@Global()
@Module({
    imports: [
        AuthModule,
        UsersModule,
        StorageModule,
        MailerModule.forRoot(config.mailer),
        NotificationsModule,
        CasesModule,
        CapturesModule,
        LinkerModule,
    ],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JWTAuthMiddleware)
            .forRoutes(
                UsersController,
                AuthController,
                CapturesController,
                LinkerPrivateController,
                CasesController,
            );
        consumer
            .apply(LoggerMiddleware)
            .with('ApplicationModule')
            .forRoutes('*');
    }
}
