import {NestMiddleware, MiddlewareFunction, Injectable} from '@nestjs/common';
const morgan = require('morgan');

const mt = morgan('tiny');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    public resolve(name: string): MiddlewareFunction {
        return mt;
    }
}
