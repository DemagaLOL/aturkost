import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateKostDto {
  @IsString({ message: 'Nama kamar harus berupa teks' })
  @IsNotEmpty({ message: 'Nama kamar wajib diisi' })
  namaKamar: string;

  @IsString({ message: 'Tipe kamar harus berupa teks' })
  @IsNotEmpty({ message: 'Tipe kamar wajib diisi' })
  tipeKamar: string;

  @IsNumber({}, { message: 'Harga bulanan harus berupa angka' })
  @Min(0, { message: 'Harga bulanan tidak boleh negatif' })
  hargaBulanan: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;
}
