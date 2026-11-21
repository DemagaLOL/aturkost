import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

const PREVIEW = [
  { nama: "Rice cooker", meta: "Dapur · Meja pojok", kondisi: "Baik" },
  {
    nama: "Kipas angin",
    meta: "Elektronik · Jendela",
    kondisi: "Perlu servis",
  },
  { nama: "Hanger", meta: "Pakaian · Lemari", kondisi: "Baik", jumlah: 12 },
];

export default function AuthLayout({
  title,
  heading,
  subtitle,
  children,
  footer,
}) {
  return (
    <main className={styles.wrap}>
      <Head>
        <title>{`${title} · AturKost`}</title>
      </Head>

      <aside className={styles.panel}>
        <Link href="/" className={styles.panelBrand}>
          AturKost
        </Link>
        <div>
          <h2 className={styles.panelTitle}>
            Semua barang kost, tercatat rapi di satu tempat.
          </h2>
          <div className={styles.preview} aria-hidden="true">
            {PREVIEW.map((item) => (
              <div key={item.nama} className={styles.previewRow}>
                <div>
                  <strong>{item.nama}</strong>
                  <span>{item.meta}</span>
                </div>
                <em>{item.jumlah ? `×${item.jumlah}` : item.kondisi}</em>
              </div>
            ))}
          </div>
        </div>
        <p className={styles.panelNote}>
          Cek barang rusak, siapkan pindahan, atau cari charger yang hilang.
        </p>
      </aside>

      <section className={styles.formSide}>
        <div className={styles.card}>
          <Link href="/" className={`${styles.brand} gradient-text`}>
            AturKost
          </Link>
          <h1 className={styles.title}>{heading}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
          <p className={styles.switch}>{footer}</p>
        </div>
      </section>
    </main>
  );
}
