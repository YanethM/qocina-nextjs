export function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  const code = (moneda ?? "").toUpperCase();
  if (code === "PEN") return `S/ ${precio.toFixed(2)}`;
  if (code === "USD") return `$ ${precio.toFixed(2)}`;
  if (code === "EUR") return `€ ${precio.toFixed(2)}`;
  if (code === "ARS") return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ARS`;
  if (code === "MXN") return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} MXN`;
  if (code === "CLP") return `$ ${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} CLP`;
  if (code === "ECD") return `$ ${precio.toFixed(2)} ECD`;
  return `${precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ${code}`;
}
