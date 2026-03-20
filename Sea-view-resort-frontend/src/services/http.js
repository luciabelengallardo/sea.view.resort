export function apiUrl(path) {
  const base = import.meta.env.VITE_API_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (base && /^https?:\/\//.test(base)) {
    try {
      const baseUrl = new URL(base);
      // If VITE_API_URL points to the same origin (e.g. http://localhost:5173),
      // return the relative path so the dev-server proxy (Vite) can forward /api to backend.
      if (
        typeof window !== "undefined" &&
        baseUrl.origin === window.location.origin
      ) {
        return normalizedPath;
      }
      const url = new URL(normalizedPath, base);
      return url.toString();
    } catch (_e) {
      return normalizedPath;
    }
  }
  return normalizedPath;
}

export function fetchApi(path, options) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = new Headers(options?.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const opts = { ...options, headers };
  return fetch(apiUrl(path), opts);
}
