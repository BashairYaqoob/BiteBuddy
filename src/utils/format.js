// Presentational formatting helpers (CLAUDE.md section 3 "Prices... Ratings...",
// section 5 "Format prices as 'Rs. ' plus comma thousands"). Does not read or
// change anything in src/data — pure display formatting only.

export function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-US')}`
}

export function formatRating(rating) {
  return rating.toFixed(1)
}
