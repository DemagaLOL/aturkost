export const TOKEN_KEY = "aturkost_token";

export function saveToken(token) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${token}; Path=/; Max-Age=86400; SameSite=Lax${secure}`;
}

export function getToken() {
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${TOKEN_KEY}=`));
  return entry ? entry.slice(TOKEN_KEY.length + 1) : null;
}

export function clearToken() {
  document.cookie = `${TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}
