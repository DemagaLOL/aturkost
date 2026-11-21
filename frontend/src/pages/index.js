import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/home.module.css";

const SAMPLE = [
  ["#001", "Rice cooker · Dapur", "Baik"],
  ["#002", "Kipas angin · Elektronik", "Perlu servis"],
  ["#003", "Rak buku · Perabot", "Baik"],
];

export default function Home() {
  return (
    <main className={styles.wrap}>
      <Head>
        <title>AturKost</title>
        <meta
          name="description"
          content="Catat inventaris barang di kamar kost."
        />
      </Head>

      <nav className={styles.nav}>
        <span className={styles.brand}>AturKost</span>
        <Link href="/login" className="btn btn-ghost">
          Masuk
        </Link>
      </nav>

      <section className={styles.hero}>
        <h1>Tahu persis barang apa saja yang ada di kamar kostmu.</h1>
        <p>
          Catat barang, jumlah, kondisi, dan letaknya. Berguna saat pindah kost,
          cek barang rusak, atau sekadar lupa menaruh charger.
        </p>
        <div className={styles.actions}>
          <Link href="/register" className="btn">
            Mulai mencatat
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Sudah punya akun
          </Link>
        </div>
      </section>

      <div className={styles.sample} aria-hidden="true">
        {SAMPLE.map(([code, name, kondisi]) => (
          <div key={code} className={styles.row}>
            <span className="mono">{code}</span>
            <span>{name}</span>
            <span>{kondisi}</span>
          </div>
        ))}
      </div>
      <p className={styles.caption}>Contoh catatan inventaris.</p>
    </main>
  );
}
