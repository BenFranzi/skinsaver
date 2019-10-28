import {BadRequestException, Controller, Get, Param} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';
import {StorageService} from './storage.service';

@ApiUseTags('Storage')
@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Get('id/:storageId')
    public async getFileById(
        @Param('storageId') id: string,
    ) {
        const url = await this.storageService.getFile(id);
        if (url) {
            return url;
        }
        throw new BadRequestException('file does not exist');
    }
}
