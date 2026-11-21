import { clearToken, getToken } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (!token) {
      window.location.replace("/login");
      throw new Error("Silakan login terlebih dahulu");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Server tidak dapat dihubungi");
  }

  if (auth && response.status === 401) {
    clearToken();
    window.location.replace("/login");
    throw new Error("Sesi berakhir, silakan login kembali");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(". ")
        : message || "Terjadi kesalahan",
    );
  }
  return data;
}

export const authApi = {
  register: (body) =>
    request("/auth/register", { method: "POST", body, auth: false }),
  login: (body) =>
    request("/auth/login", { method: "POST", body, auth: false }),
  profile: () => request("/auth/profile"),
};

export const itemsApi = {
  list: () => request("/items"),
  create: (body) => request("/items", { method: "POST", body }),
  update: (id, body) => request(`/items/${id}`, { method: "PATCH", body }),
  remove: (id) => request(`/items/${id}`, { method: "DELETE" }),
};

export const KATEGORI = [
  "Elektronik",
  "Perabot",
  "Dapur",
  "Pakaian",
  "Lainnya",
];
export const KONDISI = ["Baik", "Rusak", "Perlu servis"];
