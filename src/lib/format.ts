const THOUSANDS_SEPARATOR = /\B(?=(\d{3})+(?!\d))/g;

function formatFixed(precio: number): string {
  return precio.toFixed(2);
}

function formatGrouped(precio: number): string {
  const [entero, decimales] = precio.toFixed(2).split(".");
  const miles = entero.replace(THOUSANDS_SEPARATOR, ".");
  const fraccion = decimales.replace(/0+$/, "");
  return fraccion ? `${miles},${fraccion}` : miles;
}

export function formatPrice(precio: number, moneda: string): string {
  if (!precio && precio !== 0) return "";
  const code = (moneda ?? "").toUpperCase();
  if (code === "PEN") return `S/ ${formatFixed(precio)}`;
  if (code === "USD") return `$ ${formatFixed(precio)}`;
  if (code === "EUR") return `€ ${formatFixed(precio)}`;
  if (code === "ARS") return `$ ${formatGrouped(precio)} ARS`;
  if (code === "MXN") return `$ ${formatGrouped(precio)} MXN`;
  if (code === "CLP") return `$ ${formatGrouped(precio)} CLP`;
  if (code === "ECD") return `$ ${formatFixed(precio)} ECD`;
  return `${formatGrouped(precio)} ${code}`;
}
