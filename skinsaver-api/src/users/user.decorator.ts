import {createParamDecorator} from '@nestjs/common';

export const UserDecor = createParamDecorator((data, req) => {
    return req.user;
});
