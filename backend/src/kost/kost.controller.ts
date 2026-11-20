import { Controller, Get, Post, Body } from '@nestjs/common';
import { KostService } from './kost.service';
import { CreateKostDto } from './dto/create-kost.dto';

@Controller('kost')
export class KostController {
  constructor(private readonly kostService: KostService) {}

  @Get('status')
  getStatus() {
    return this.kostService.getHealth();
  }

  @Post('validate-test')
  testDto(@Body() createKostDto: CreateKostDto) {
    return this.kostService.validatePayload(createKostDto);
  }
}
