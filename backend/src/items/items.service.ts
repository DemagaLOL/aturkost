import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateItemDto) {
    return this.prisma.item.create({ data: { ...dto, userId } });
  }

  findAll(userId: number) {
    return this.prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const item = await this.prisma.item.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('Barang tidak ditemukan');
    return item;
  }

  async update(userId: number, id: number, dto: UpdateItemDto) {
    await this.findOne(userId, id);
    return this.prisma.item.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.item.delete({ where: { id } });
  }
}
