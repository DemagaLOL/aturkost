import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ItemForm from "@/components/ItemForm";
import { KATEGORI, authApi, itemsApi } from "@/lib/api";
import { clearToken } from "@/lib/session";
import styles from "@/styles/items.module.css";

const KONDISI_CLASS = {
  Baik: styles.ok,
  Rusak: styles.bad,
  "Perlu servis": styles.warn,
};

export default function ItemsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");

  useEffect(() => {
    Promise.all([authApi.profile(), itemsApi.list()])
      .then(([profile, list]) => {
        setUser(profile);
        setItems(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (!kategori || item.kategori === kategori) &&
        (!q ||
          item.nama.toLowerCase().includes(q) ||
          (item.lokasi ?? "").toLowerCase().includes(q)),
    );
  }, [items, query, kategori]);

  const totalUnit = items.reduce((sum, item) => sum + item.jumlah, 0);
  const perluPerhatian = items.filter((item) => item.kondisi !== "Baik").length;

  async function save(data) {
    if (editing === "new") {
      const created = await itemsApi.create(data);
      setItems([created, ...items]);
    } else {
      const updated = await itemsApi.update(editing.id, data);
      setItems(items.map((item) => (item.id === updated.id ? updated : item)));
    }
    setEditing(null);
  }

  async function remove(item) {
    if (!window.confirm(`Hapus "${item.nama}" dari catatan?`)) return;
    try {
      await itemsApi.remove(item.id);
      setItems(items.filter((i) => i.id !== item.id));
      if (editing?.id === item.id) setEditing(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className={styles.wrap}>
      <Head>
        <title>Barang saya · AturKost</title>
      </Head>

      <header className={styles.header}>
        <span className={styles.brand}>AturKost</span>
        <div className={styles.user}>
          {user && <span>{user.name}</span>}
          <button className="btn btn-ghost" onClick={logout}>
            Keluar
          </button>
        </div>
      </header>

      <section className={styles.stats}>
        <div>
          <span className="mono">{items.length}</span>
          <small>jenis barang</small>
        </div>
        <div>
          <span className="mono">{totalUnit}</span>
          <small>total unit</small>
        </div>
        <div>
          <span className="mono">{perluPerhatian}</span>
          <small>rusak / perlu servis</small>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {editing ? (
        <ItemForm
          key={editing === "new" ? "new" : editing.id}
          item={editing === "new" ? null : editing}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            type="search"
            placeholder="Cari nama atau lokasi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari barang"
          />
          <select
            className={styles.filter}
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            aria-label="Filter kategori"
          >
            <option value="">Semua kategori</option>
            {KATEGORI.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <button className="btn" onClick={() => setEditing("new")}>
            Tambah barang
          </button>
        </div>
      )}

      <section className={styles.list}>
        {loading && <p className={styles.empty}>Memuat...</p>}

        {!loading && items.length === 0 && (
          <p className={styles.empty}>
            Belum ada barang. Mulai dari yang paling sering dicari, misalnya
            charger atau kunci cadangan.
          </p>
        )}

        {!loading && items.length > 0 && visible.length === 0 && (
          <p className={styles.empty}>
            Tidak ada barang yang cocok dengan pencarian.
          </p>
        )}

        {visible.map((item) => (
          <article key={item.id} className={styles.row}>
            <div className={styles.main}>
              <strong>{item.nama}</strong>
              <span className={styles.meta}>
                {item.kategori}
                {item.lokasi && ` · ${item.lokasi}`}
              </span>
              {item.catatan && <p className={styles.note}>{item.catatan}</p>}
            </div>
            <span className={`mono ${styles.qty}`}>×{item.jumlah}</span>
            <span
              className={`${styles.badge} ${KONDISI_CLASS[item.kondisi] ?? ""}`}
            >
              {item.kondisi}
            </span>
            <div className={styles.rowActions}>
              <button onClick={() => setEditing(item)}>Ubah</button>
              <button className={styles.danger} onClick={() => remove(item)}>
                Hapus
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
