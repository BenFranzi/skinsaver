import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as helmet from 'helmet';
// import {default as rateLimit } from 'express-rate-limit';

process.env.TZ = 'UTC';

import config from './config';

export const bootstrap = async (port?: number) => {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(config.hostConfig.BASE_PATH);

    app.enable('trust proxy');
    app.use(helmet());
    app.enableCors();


    // TODO: Fix rate limit

    // Apply rate limiter to `api` endpoint
    // app.use(`/${config.hostConfig.BASE_PATH}/`, rateLimit({
    //     windowMs: 60 * 1000, // 1 minute
    //     max: 100, // limit each IP to 100 requests per windowMs
    // }));
    //
    // // Apply more restrictive rate limiter to `api/auth` endpoint
    // app.use(`/${config.hostConfig.BASE_PATH}/auth/`, rateLimit({
    //     windowMs: 60 * 1000,
    //     max: 10,
    //     message: 'Too many requests to "auth" endpoint from this IP, please try again after a minute',
    // }));



    app.enableCors({
        credentials: true,
        origin: true,
    });

    if (process.env.NODE_ENV === 'development') {
        app.useStaticAssets('volumes/uploads', {prefix: '/uploads'});
        const options = new DocumentBuilder()
            .setTitle('GLI')
            .setBasePath('/api/v1/')
            .setDescription('SkinSaver')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(config.hostConfig.DOCS_PATH, app, document);
        console.info(`\nExternal Address (API docs): ${config.hostConfig.DOCS_URL}`);
    }
    await app.listen(port || config.hostConfig.PORT);
    console.info(`\nExternal Address (REST API): ${config.hostConfig.HOST_URL}`);
};
bootstrap();
