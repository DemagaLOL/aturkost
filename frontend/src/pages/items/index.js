import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ItemForm from "@/components/ItemForm";
import Modal from "@/components/Modal";
import { KATEGORI, authApi, itemsApi } from "@/lib/api";
import { clearToken } from "@/lib/session";
import styles from "@/styles/items.module.css";

const KONDISI_CLASS = {
  Baik: styles.ok,
  Rusak: styles.bad,
  "Perlu servis": styles.warn,
};

const KATEGORI_CLASS = {
  Elektronik: styles.catElektronik,
  Perabot: styles.catPerabot,
  Dapur: styles.catDapur,
  Pakaian: styles.catPakaian,
  Lainnya: styles.catLainnya,
};

const SORTERS = {
  terbaru: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  nama: (a, b) => a.nama.localeCompare(b.nama, "id"),
  jumlah: (a, b) => b.jumlah - a.jumlah,
  kondisi: (a, b) => (a.kondisi === "Baik") - (b.kondisi === "Baik"),
};

function Icon({ path }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const ICON = {
  plus: "M12 5v14M5 12h14",
  search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  edit: "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
};

export default function ItemsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [deleting, setDeleting] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [sort, setSort] = useState("terbaru");
  const [toast, setToast] = useState("");
  const toastTimer = useRef();

  useEffect(() => {
    Promise.all([authApi.profile(), itemsApi.list()])
      .then(([profile, list]) => {
        setUser(profile);
        setItems(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  const counts = useMemo(() => {
    const result = {};
    for (const item of items)
      result[item.kategori] = (result[item.kategori] ?? 0) + 1;
    return result;
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(
        (item) =>
          (!kategori || item.kategori === kategori) &&
          (!q ||
            item.nama.toLowerCase().includes(q) ||
            (item.lokasi ?? "").toLowerCase().includes(q)),
      )
      .sort(SORTERS[sort]);
  }, [items, query, kategori, sort]);

  const totalUnit = items.reduce((sum, item) => sum + item.jumlah, 0);
  const perluPerhatian = items.filter((item) => item.kondisi !== "Baik").length;

  const closeForm = useCallback(() => setEditing(null), []);
  const closeDelete = useCallback(() => setDeleting(null), []);

  async function save(data) {
    if (editing === "new") {
      const created = await itemsApi.create(data);
      setItems((list) => [created, ...list]);
      notify(`${created.nama} ditambahkan`);
    } else {
      const updated = await itemsApi.update(editing.id, data);
      setItems((list) =>
        list.map((item) => (item.id === updated.id ? updated : item)),
      );
      notify("Perubahan disimpan");
    }
    setEditing(null);
  }

  async function confirmDelete() {
    setRemoving(true);
    try {
      await itemsApi.remove(deleting.id);
      setItems((list) => list.filter((i) => i.id !== deleting.id));
      notify(`${deleting.nama} dihapus`);
      setDeleting(null);
    } catch (err) {
      setError(err.message);
      setDeleting(null);
    } finally {
      setRemoving(false);
    }
  }

  function logout() {
    clearToken();
    router.replace("/login");
  }

  const hasFilter = query || kategori;

  return (
    <div className={styles.page}>
      <Head>
        <title>Barang saya · AturKost</title>
      </Head>

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/items" className={`${styles.brand} gradient-text`}>
            AturKost
          </Link>
          <div className={styles.user}>
            {user && (
              <>
                <span className={styles.avatar} aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className={styles.userName}>{user.name}</span>
              </>
            )}
            <button className="btn btn-ghost" onClick={logout}>
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className={styles.wrap}>
        <section className={styles.hero}>
          <div>
            <h1>
              {user ? `Halo, ${user.name.split(" ")[0]}` : "Inventaris kamar"}
            </h1>
            <p>Ini semua barang yang sudah kamu catat.</p>
          </div>
          <button className="btn" onClick={() => setEditing("new")}>
            <Icon path={ICON.plus} />
            Tambah barang
          </button>
        </section>

        <section className={styles.stats}>
          <div className={styles.stat}>
            <small>Jenis barang</small>
            <span className="mono">{items.length}</span>
          </div>
          <div className={styles.stat}>
            <small>Total unit</small>
            <span className="mono">{totalUnit}</span>
          </div>
          <div
            className={`${styles.stat} ${perluPerhatian ? styles.statAlert : ""}`}
          >
            <small>Rusak / perlu servis</small>
            <span className="mono">{perluPerhatian}</span>
          </div>
        </section>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <section className={styles.panel}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Icon path={ICON.search} />
              <input
                type="search"
                placeholder="Cari nama atau lokasi"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Cari barang"
              />
            </label>
            <select
              className={styles.sort}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Urutkan"
            >
              <option value="terbaru">Terbaru</option>
              <option value="nama">Nama A–Z</option>
              <option value="jumlah">Jumlah terbanyak</option>
              <option value="kondisi">Perlu perhatian dulu</option>
            </select>
          </div>

          <div
            className={styles.chips}
            role="group"
            aria-label="Filter kategori"
          >
            {["", ...KATEGORI].map((k) => (
              <button
                key={k || "semua"}
                className={kategori === k ? styles.chipActive : styles.chip}
                onClick={() => setKategori(k)}
                aria-pressed={kategori === k}
              >
                {k || "Semua"}
                <span className="mono">
                  {k ? (counts[k] ?? 0) : items.length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.list}>
            {loading &&
              [0, 1, 2].map((i) => (
                <div key={i} className={styles.skeleton} aria-hidden="true" />
              ))}

            {!loading && items.length === 0 && (
              <div className={styles.empty}>
                <strong>Belum ada barang</strong>
                <p>
                  Mulai dari yang paling sering dicari, misalnya charger, kunci
                  cadangan, atau rice cooker.
                </p>
                <button className="btn" onClick={() => setEditing("new")}>
                  <Icon path={ICON.plus} />
                  Catat barang pertama
                </button>
              </div>
            )}

            {!loading && items.length > 0 && visible.length === 0 && (
              <div className={styles.empty}>
                <strong>Tidak ada yang cocok</strong>
                <p>Coba kata kunci lain atau pilih kategori berbeda.</p>
                {hasFilter && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setQuery("");
                      setKategori("");
                    }}
                  >
                    Hapus filter
                  </button>
                )}
              </div>
            )}

            {visible.map((item) => (
              <article key={item.id} className={styles.row}>
                <span
                  className={`${styles.catMark} ${KATEGORI_CLASS[item.kategori] ?? ""}`}
                  aria-hidden="true"
                >
                  {item.kategori.charAt(0)}
                </span>
                <div className={styles.main}>
                  <div className={styles.titleLine}>
                    <strong>{item.nama}</strong>
                    <span className={`mono ${styles.qty}`}>×{item.jumlah}</span>
                  </div>
                  <span className={styles.meta}>
                    {item.kategori}
                    {item.lokasi && (
                      <>
                        <span className={styles.dot}>·</span>
                        <Icon path={ICON.pin} />
                        {item.lokasi}
                      </>
                    )}
                  </span>
                  {item.catatan && (
                    <p className={styles.note}>{item.catatan}</p>
                  )}
                </div>
                <span
                  className={`${styles.badge} ${KONDISI_CLASS[item.kondisi] ?? ""}`}
                >
                  {item.kondisi}
                </span>
                <div className={styles.rowActions}>
                  <button
                    onClick={() => setEditing(item)}
                    aria-label={`Ubah ${item.nama}`}
                    title="Ubah"
                  >
                    <Icon path={ICON.edit} />
                  </button>
                  <button
                    className={styles.danger}
                    onClick={() => setDeleting(item)}
                    aria-label={`Hapus ${item.nama}`}
                    title="Hapus"
                  >
                    <Icon path={ICON.trash} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {editing && (
        <Modal
          title={editing === "new" ? "Tambah barang" : `Ubah ${editing.nama}`}
          onClose={closeForm}
        >
          <ItemForm
            key={editing === "new" ? "new" : editing.id}
            item={editing === "new" ? null : editing}
            onSubmit={save}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Hapus barang?" onClose={closeDelete} size="sm">
          <p className={styles.confirmText}>
            <strong>{deleting.nama}</strong> akan dihapus dari catatan. Tindakan
            ini tidak bisa dibatalkan.
          </p>
          <div className={styles.formActions}>
            <button className="btn btn-ghost" onClick={closeDelete}>
              Batal
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={removing}
            >
              {removing ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </Modal>
      )}

      <div
        className={`${styles.toast} ${toast ? styles.toastShow : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}
