export function toFiniteNumber(number, valueIfNotFinite = 0) {
  const n = Number(number);
  return Number.isFinite(n) ? n : valueIfNotFinite;
}