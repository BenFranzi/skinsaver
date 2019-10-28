import {Body, Controller, Delete, Get, Post, UseGuards, Param, Put, Req, NotFoundException} from '@nestjs/common';
import {UsersService} from './users.service';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {UserDecor} from './user.decorator';
import {Pagination, PaginationOptions} from '../utils/common/pagination.decorator';
import {IUser, UserRole} from './user.entity';
import {toListResponse} from '../utils/common/rest-helpers';
import {Roles, RolesGuard} from '../utils/common/roles';
import {ChangePasswordDto, CreateUserDto, UpdateUserDto} from './users.dto';

@ApiUseTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post('/me/password')
    public async changePassword(
        @UserDecor() viewer: IUser,
        @Body() changePasswordDto: ChangePasswordDto) {
        const {id} = viewer;
        return this.usersService.changePassword(
            id,
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword,
        );
    }

    @Get('/me')
    public async getMe(@UserDecor() viewer: IUser) {
        return await this.usersService.getById(viewer.id);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    public async findOne(
        @Param('id') id,
        @UserDecor() viewer: IUser,
    ) {
        const user = await this.usersService.getById(id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    @Get()
    @Roles(UserRole.ADMIN)
    public async getAll(
        @Pagination() pagination: PaginationOptions,
        @UserDecor() viewer: IUser,
    ) {
        const {result, total} = await this.usersService.getAll(pagination); // TODO: implement filter
        return toListResponse(result, pagination, total);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    public async create(
        @UserDecor() viewer: IUser,
        @Body() createUserDto: CreateUserDto,
    ) {
        const {email, password, role} = createUserDto;
        return await this.usersService.create({email, password, role});
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    public async deleteOne(
        @UserDecor() viewer,
        @Param('id') id,
    ) {
        await this.usersService.delete(id);
        return {'message': 'Deleted'};
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    public async updateRole(
        @Param('id') id,
        @UserDecor() viewer: IUser,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req,
    ) {
        const {role} = updateUserDto;

        const userModel = await this.usersService.updateRole(viewer, {id, role});
        if (!userModel) {
            throw new NotFoundException();
        }

        return userModel;
    }
}
