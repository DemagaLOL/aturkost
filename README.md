# AturKost

Catatan inventaris kamar kost. Mahasiswa bisa mencatat barang apa saja yang ada di kamarnya: jumlah, kategori, lokasi, dan kondisinya. Barang yang rusak atau perlu servis langsung terlihat.

Mini project Workshop JavaScript, dikerjakan oleh:

| Nama | NIM |
| --- | --- |
| Satria Farhan Lutfian | H1D026055 |
| Danawendra Girinandana | H1D026148 |

![Halaman daftar barang](docs/screenshots/items.png)

## Fitur

- **Akun:** daftar dan masuk dengan email dan password. Password disimpan sebagai hash bcrypt, dan sesi memakai JWT.
- **Data per user:** setiap user hanya bisa melihat dan mengubah barangnya sendiri. Barang milik user lain dibalas `404`.
- **CRUD barang:** tambah, lihat, ubah, dan hapus. Penghapusan selalu dikonfirmasi dulu.
- **Ringkasan:** jumlah jenis barang, total unit, dan jumlah barang yang rusak atau perlu servis.
- **Cari, filter, urutkan:** cari berdasarkan nama atau lokasi, filter per kategori, dan urutkan menurut terbaru, nama, jumlah, atau kondisi.
- **Validasi dua sisi:** form di frontend dan DTO di backend. Pesan error berbahasa Indonesia.
- **Responsif:** nyaman dipakai di HP maupun laptop.

<table>
  <tr>
    <td><img src="docs/screenshots/register.png" alt="Halaman daftar" /></td>
    <td><img src="docs/screenshots/edit.png" alt="Form ubah barang" /></td>
    <td width="28%"><img src="docs/screenshots/mobile.png" alt="Tampilan HP" /></td>
  </tr>
</table>

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Frontend | Next.js 16 (Pages Router), React 19, CSS Modules, font Bricolage Grotesque |
| Backend | NestJS 10, class-validator, @nestjs/jwt, bcrypt |
| Database | PostgreSQL dengan Prisma ORM 6 |

## Struktur folder

```
aturkost/
├── backend/                 # REST API NestJS (port 3001)
│   ├── prisma/
│   │   ├── schema.prisma    # model User dan Item
│   │   └── migrations/
│   └── src/
│       ├── auth/            # register, login, profile, JwtAuthGuard
│       ├── items/           # CRUD barang + DTO
│       └── prisma/          # PrismaService (global)
└── frontend/                # Next.js (port 3000)
    └── src/
        ├── components/      # AuthLayout, ItemForm, Modal
        ├── lib/             # api.js (fetch + token), session.js (cookie)
        ├── pages/           # /, /login, /register, /items
        ├── proxy.js         # redirect halaman sesuai status login
        └── styles/
```

## Menjalankan di lokal

Yang perlu disiapkan: **Node.js 20+** dan **PostgreSQL** (dikembangkan dengan versi 19).

### 1. Buat database

```bash
psql -U postgres -c "CREATE DATABASE aturkost;"
```

Cara lain: buat database `aturkost` lewat pgAdmin.

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Isi `.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:PASSWORD_KAMU@localhost:5432/aturkost?schema=public"
JWT_SECRET=string_acak_yang_panjang
JWT_EXPIRES_IN=1d
```

`JWT_SECRET` wajib diisi; tanpa itu server tidak mau jalan. Nilainya bisa dibuat dengan perintah ini:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Lalu jalankan:

```bash
npm install          # otomatis menjalankan prisma generate
npm run db:deploy    # membuat tabel dari migrasi
npm run start:dev
```

API berjalan di `http://localhost:3001/api`.

### 3. Frontend

Buka terminal baru:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Buka `http://localhost:3000`, daftar akun, lalu mulai catat barang.

## API

Base URL: `http://localhost:3001/api`. Endpoint yang ditandai 🔒 butuh header `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| POST | `/auth/register` | Daftar akun baru |
| POST | `/auth/login` | Masuk, mengembalikan `accessToken` dan `user` |
| GET | `/auth/profile` 🔒 | Data user yang sedang login |
| GET | `/items` 🔒 | Semua barang milik user, terbaru dulu |
| POST | `/items` 🔒 | Tambah barang |
| GET | `/items/:id` 🔒 | Detail satu barang |
| PATCH | `/items/:id` 🔒 | Ubah sebagian field barang |
| DELETE | `/items/:id` 🔒 | Hapus barang |

### Contoh

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"satria@example.com","password":"rahasia1"}'

# Tambah barang
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"nama":"Kipas angin","kategori":"Elektronik","kondisi":"Perlu servis","lokasi":"Dekat jendela"}'
```

### Field barang

| Field | Wajib | Aturan |
| --- | --- | --- |
| `nama` | ya | teks, maksimal 100 karakter |
| `kategori` | ya | `Elektronik`, `Perabot`, `Dapur`, `Pakaian`, `Lainnya` |
| `jumlah` | tidak | bilangan bulat ≥ 1, default `1` |
| `kondisi` | tidak | `Baik`, `Rusak`, `Perlu servis`, default `Baik` |
| `lokasi` | tidak | teks, maksimal 100 karakter |
| `catatan` | tidak | teks, maksimal 500 karakter |

Field di luar daftar di atas ditolak dengan `400`.

### Kode status

| Kode | Kapan |
| --- | --- |
| `400` | Data tidak lolos validasi (pesan error ada di `message`) |
| `401` | Token tidak ada, salah, atau kedaluwarsa; atau email/password salah |
| `404` | Barang tidak ditemukan atau milik user lain |
| `409` | Email sudah terdaftar |

## Keamanan

- Password di-hash dengan bcrypt dan tidak pernah dikirim balik ke client.
- Semua endpoint `/items` dijaga `JwtAuthGuard`. `userId` diambil dari token, bukan dari body request.
- Rahasia (`DATABASE_URL`, `JWT_SECRET`) hanya ada di `.env`, dan file itu tidak ikut di-commit. Yang ada di repo hanya `.env.example`.
- CORS hanya mengizinkan origin dari `FRONTEND_URL`.
