import { UserRole } from '../users/user.entity';

export interface IAuthConfig {
    secret: string;
    tokenExpiration: number;
}

export interface JWTPayload {
    id: string;
    email: string;
    role: UserRole;
    updatedDate: number; // UNIX TIMESTAMP
}
