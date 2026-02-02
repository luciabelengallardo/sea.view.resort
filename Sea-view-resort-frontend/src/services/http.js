export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (base && /^https?:\/\//.test(base)) {
    try {
      const url = new URL(normalizedPath, base);
      return url.toString();
    } catch (_e) {
      return normalizedPath;
    }
  }
  return normalizedPath;
}

export function fetchApi(path, options) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(options?.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const opts = { ...options, headers };
  return fetch(apiUrl(path), opts);
}


