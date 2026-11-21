import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { saveToken } from "@/lib/session";
import styles from "@/styles/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { accessToken } = await authApi.login(form);
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
        <title>Masuk · AturKost</title>
      </Head>
      <div className={styles.card}>
        <Link href="/" className={styles.brand}>
          AturKost
        </Link>
        <h1 className={styles.title}>Masuk</h1>
        <p className={styles.subtitle}>Lanjutkan mencatat barang di kamarmu.</p>

        <form className={styles.form} onSubmit={submit}>
          {error && <p className="error">{error}</p>}
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
              autoComplete="current-password"
            />
          </div>
          <button className="btn" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className={styles.switch}>
          Belum punya akun? <Link href="/register">Daftar</Link>
        </p>
      </div>
    </main>
  );
}
