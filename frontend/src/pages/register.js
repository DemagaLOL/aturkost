import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { saveToken } from "@/lib/session";
import styles from "@/styles/auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(form);
      const { accessToken } = await authApi.login({
        email: form.email,
        password: form.password,
      });
      saveToken(accessToken);
      router.replace("/items");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrap}>
      <Head>
        <title>Daftar · AturKost</title>
      </Head>
      <div className={styles.card}>
        <Link href="/" className={styles.brand}>
          AturKost
        </Link>
        <h1 className={styles.title}>Buat akun</h1>
        <p className={styles.subtitle}>
          Satu akun untuk semua barang di kostmu.
        </p>

        <form className={styles.form} onSubmit={submit}>
          {error && <p className="error">{error}</p>}
          <div className="field">
            <label htmlFor="name">Nama</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={change}
              required
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button className="btn" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className={styles.switch}>
          Sudah punya akun? <Link href="/login">Masuk</Link>
        </p>
      </div>
    </main>
  );
}
