import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {Allow, IsNotEmpty, IsNumber, IsOptional, IsString,} from 'class-validator';

export class CreateDto {
    @ApiModelProperty({
        required: true,
        description: 'Expected notification type',
    })
    @IsNotEmpty()
    public readonly type: string;

    @ApiModelProperty({
        required: false,
        description: 'Expected a stringified JSON object',
    })
    @Allow()
    @IsOptional()
    public readonly payload: any;
}
