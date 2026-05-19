export function formatCurrency(value: number | string | null | undefined, label = "円") {
  const amount = Number(value ?? 0);
  return `${new Intl.NumberFormat("ja-JP").format(amount)}${label}`;
}
