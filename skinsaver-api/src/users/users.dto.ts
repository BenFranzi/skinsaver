import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsOptional, IsIn} from 'class-validator';
import {UserRole} from './user.entity';

export class CreateUserDto {
    @ApiModelProperty()
    @IsOptional()
    @IsIn(['admin', 'user'])
    public readonly role: UserRole;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly email: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly password: string;
}

export class UpdateUserDto {

    @ApiModelProperty()
    @IsOptional()
    @IsIn(['admin', 'user'])
    public readonly role: UserRole;
}

export class ChangePasswordDto {
    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly newPassword: string;

    @ApiModelProperty()
    @IsString()
    @IsNotEmpty()
    public readonly oldPassword: string;
}
