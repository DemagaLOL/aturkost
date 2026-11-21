import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
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
    <AuthLayout
      title="Masuk"
      heading="Selamat datang kembali"
      subtitle="Masuk untuk melihat catatan barangmu."
      footer={
        <>
          Belum punya akun? <Link href="/register">Daftar sekarang</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={submit}>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
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
            placeholder="nama@email.com"
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
    </AuthLayout>
  );
}
