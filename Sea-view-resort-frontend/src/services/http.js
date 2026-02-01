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
  return fetch(apiUrl(path), options);
}


