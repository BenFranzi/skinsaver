const passport = require('passport');
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UnauthorizedException, Injectable} from '@nestjs/common';
import {AuthService} from '../auth.service';
import config from '../../config';

@Injectable()
export class JwtStrategy {

    private readonly jwtStrategy;

    constructor(private readonly authService: AuthService) {

        this.jwtStrategy = new Strategy({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: config.authConfig.JWT_SECRET,
            },
            async (req, payload, next) => await this.verify(req, payload, next),
        );

        passport.use(this.jwtStrategy);
    }

    public async verify(req, payload, done) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        req.user = user;
        done(null, payload);
    }
}
