import { Injectable } from '@nestjs/common';
import { CreateKostDto } from './dto/create-kost.dto';

@Injectable()
export class KostService {
  getHealth() {
    return {
      status: 'ok',
      module: 'kost',
      message: 'Modul Kost aktif dan siap dikembangkan ke database',
    };
  }

  validatePayload(createKostDto: CreateKostDto) {
    return {
      message: 'Validasi DTO berhasil (belum disimpan ke database)',
      receivedData: createKostDto,
    };
  }
}
