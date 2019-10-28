import {IsString, IsNotEmpty} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class AuthRegisterDto {
  @ApiModelProperty({
    required: true,
  })
  @IsString()
  public readonly email: string;

  @ApiModelProperty({
    required: true,
  })
  @IsString()
  public readonly password: string;
}

export class AuthLoginDto {
  @ApiModelProperty({
    required: true,
  })
  @IsString()
  public readonly email: string;

  @ApiModelProperty({
    required: true,
  })
  @IsString()
  public readonly password: string;
}

export class PasswordForgotDto {

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}

export class PasswordResetDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  public readonly token: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  public readonly password: string;

}
