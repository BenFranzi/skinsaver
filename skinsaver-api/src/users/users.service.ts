import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {UserEntity, UserRole, IUser} from './user.entity';
import {USERS_REPOSITORY_TOKEN} from './user.providers';
import {PaginationOptions} from '../utils/common/pagination.decorator'

const crypto = require('crypto');

@Injectable()
export class UsersService {
    constructor(@Inject(USERS_REPOSITORY_TOKEN) private readonly userRepository: Repository<IUser>) {
    }

    // public async getAll() {
    //     return await this.userRepository.find();
    // }

    public async getAll(pagination: PaginationOptions, filters?: any) {
        const [result, total] = await this.userRepository.findAndCount(
            {
                // where: filters
                skip: pagination.pageIndex * pagination.pageSize,
                take: pagination.pageSize,
            },
        );

        return {result, total};
    }

    public async getById(id: string) {
        return await this.userRepository.findOne(id) as UserEntity;
    }

    public async getByEmail(email: string): Promise<IUser> {
        const lower = email.toLowerCase().trim();
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', {email: lower })
            .getOne() as IUser;
    }

    public async create(user: Partial<IUser>) {
        const existingUser = await this.getByEmail(user.email.toLowerCase().trim());
        if (!existingUser && user.password.length >= 8) {
            return await UserEntity.create(user);

        } else {
            if (existingUser) {
                throw new BadRequestException('User already exists.');
            }
            throw new BadRequestException('Password less than 8 characters.');
        }
    }

    public async delete(userId: string) {
        return await this.userRepository.delete(userId);
    }

    public async updateRole(viewer: IUser, data: Partial<IUser>, forceUpdate: boolean = false): Promise<IUser> {
        const {id} = data;
        let user = await this.getById(id);
        if (!user) {
            throw new NotFoundException();
        }

        if (data.role && (forceUpdate || (user.id !== viewer.id))) {
            // Only allow changing role for someone else,
            // to prevent your own lockout (e.g. change 'admin'->'user').
            user.role = data.role;
            user = await this.userRepository.save(user);
        }
        return user;
    }

    public async changePassword(userId, oldPassword, newPassword) {

        const user = await this.getById(userId);
        const isAuthenticated = await user.authenticate(oldPassword);
        if (!isAuthenticated) {
            throw new BadRequestException('Failed to validate current password');
        }
        return await user.changePassword(newPassword);
    }

    public async save(user: IUser) {
        return await this.userRepository.save(user);
    }

    public async getByResetToken(token: string) {
        return await this.userRepository
            .createQueryBuilder('user')
            .select(['user', 'user.resetPasswordToken'])
            .where('user.resetPasswordToken = :token', { token })
            .getOne() as IUser;
    }
}
