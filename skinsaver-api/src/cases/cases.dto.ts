import { ApiModelProperty } from "@nestjs/swagger";

export class CreateDto {
    @ApiModelProperty({required: true})
    public readonly file: any;

    @ApiModelProperty({required: true})
    public readonly predictions: any;
}