import { useState } from "react";
import { KATEGORI, KONDISI } from "@/lib/api";
import styles from "@/styles/items.module.css";

const EMPTY = {
  nama: "",
  kategori: KATEGORI[0],
  jumlah: 1,
  kondisi: KONDISI[0],
  lokasi: "",
  catatan: "",
};

export default function ItemForm({ item, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    item
      ? {
          nama: item.nama,
          kategori: item.kategori,
          jumlah: item.jumlah,
          kondisi: item.kondisi,
          lokasi: item.lokasi ?? "",
          catatan: item.catatan ?? "",
        }
      : EMPTY,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        nama: form.nama.trim(),
        jumlah: Number(form.jumlah),
        lokasi: form.lokasi.trim() || undefined,
        catatan: form.catatan.trim() || undefined,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <h2>{item ? `Ubah ${item.nama}` : "Barang baru"}</h2>
      {error && <p className="error">{error}</p>}

      <div className={styles.formGrid}>
        <div className={`field ${styles.span2}`}>
          <label htmlFor="nama">Nama barang</label>
          <input
            id="nama"
            name="nama"
            value={form.nama}
            onChange={change}
            required
            maxLength={100}
            placeholder="Rice cooker"
          />
        </div>
        <div className="field">
          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            name="kategori"
            value={form.kategori}
            onChange={change}
          >
            {KATEGORI.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="jumlah">Jumlah</label>
          <input
            id="jumlah"
            name="jumlah"
            type="number"
            min={1}
            value={form.jumlah}
            onChange={change}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="kondisi">Kondisi</label>
          <select
            id="kondisi"
            name="kondisi"
            value={form.kondisi}
            onChange={change}
          >
            {KONDISI.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="lokasi">Lokasi</label>
          <input
            id="lokasi"
            name="lokasi"
            value={form.lokasi}
            onChange={change}
            maxLength={100}
            placeholder="Bawah meja"
          />
        </div>
        <div className={`field ${styles.span2}`}>
          <label htmlFor="catatan">Catatan</label>
          <textarea
            id="catatan"
            name="catatan"
            value={form.catatan}
            onChange={change}
            maxLength={500}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Batal
        </button>
        <button className="btn" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
