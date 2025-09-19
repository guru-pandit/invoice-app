export function calcItemAmount(qty, price) {
  const q = Number(qty || 0);
  const p = Number(price || 0);
  return +(q * p).toFixed(2);
}

export function calcTotals(items, taxRate = 0) {
  const subtotal = +(items.reduce((sum, it) => sum + calcItemAmount(it.qty, it.price), 0)).toFixed(2);
  const tax = +((subtotal * Number(taxRate || 0)) / 100).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { subtotal, tax, total };
}
