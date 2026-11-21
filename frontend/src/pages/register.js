import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
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
    <AuthLayout
      title="Daftar"
      heading="Buat akun baru"
      subtitle="Gratis. Cukup nama, email, dan password."
      footer={
        <>
          Sudah punya akun? <Link href="/login">Masuk</Link>
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
          <label htmlFor="name">Nama</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={change}
            required
            autoComplete="name"
            placeholder="Nama panggilan"
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
            minLength={6}
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
          />
        </div>
        <button className="btn" disabled={loading}>
          {loading ? "Memproses..." : "Buat akun"}
        </button>
      </form>
    </AuthLayout>
  );
}
