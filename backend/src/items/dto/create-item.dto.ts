import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export const KATEGORI = [
  'Elektronik',
  'Perabot',
  'Dapur',
  'Pakaian',
  'Lainnya',
];
export const KONDISI = ['Baik', 'Rusak', 'Perlu servis'];

export class CreateItemDto {
  @IsString({ message: 'Nama barang harus berupa teks' })
  @IsNotEmpty({ message: 'Nama barang wajib diisi' })
  @MaxLength(100, { message: 'Nama barang maksimal 100 karakter' })
  nama: string;

  @IsIn(KATEGORI, {
    message: `Kategori harus salah satu dari: ${KATEGORI.join(', ')}`,
  })
  kategori: string;

  @IsOptional()
  @IsInt({ message: 'Jumlah harus bilangan bulat' })
  @Min(1, { message: 'Jumlah minimal 1' })
  jumlah?: number;

  @IsOptional()
  @IsIn(KONDISI, {
    message: `Kondisi harus salah satu dari: ${KONDISI.join(', ')}`,
  })
  kondisi?: string;

  @IsOptional()
  @IsString({ message: 'Lokasi harus berupa teks' })
  @MaxLength(100, { message: 'Lokasi maksimal 100 karakter' })
  lokasi?: string;

  @IsOptional()
  @IsString({ message: 'Catatan harus berupa teks' })
  @MaxLength(500, { message: 'Catatan maksimal 500 karakter' })
  catatan?: string;
}
