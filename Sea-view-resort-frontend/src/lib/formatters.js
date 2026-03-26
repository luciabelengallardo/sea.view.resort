export const formatDate = (dateString, locale = "es-ES", options) => {
  if (!dateString) return "";
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC" // Usar UTC para evitar desfases de timezone
  };

  const d = new Date(dateString);
  return d.toLocaleDateString(locale, options || defaultOptions);
};

export const formatPrice = (price, currency = "USD", locale = "es-ES") => {
  if (price == null || Number.isNaN(Number(price))) return "";
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(price);
  return formatted.replace("US$", "$").replace("USD", "$");
};

export const getInitials = (nameOrEmail = "") => {
  const source = String(nameOrEmail).trim();
  if (!source) return "";
  // Prefer names split by spaces; fallback to email local-part
  const name = source.includes("@")
    ? source.split("@")[0].replace(/[._-]+/g, " ")
    : source;
  const parts = name.split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
  return initials || source[0]?.toUpperCase() || "";
};

export const formatMemberSince = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long" };
  return new Intl.DateTimeFormat("es-ES", options).format(date);
};
