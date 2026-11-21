import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthRequest, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateItemDto) {
    return this.itemsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.itemsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.itemsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(req.user.id, id);
  }
}
