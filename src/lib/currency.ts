// Matched against the trip's destination text (lowercased), longest/most
// specific keywords first so e.g. "Hawaii" doesn't get shadowed by a
// broader later match. Not exhaustive — falls back to USD.
const CURRENCY_BY_KEYWORD: [string, string][] = [
  ["japan", "JPY"],
  ["tokyo", "JPY"],
  ["kyoto", "JPY"],
  ["osaka", "JPY"],
  ["okinawa", "JPY"],
  ["united kingdom", "GBP"],
  ["england", "GBP"],
  ["scotland", "GBP"],
  ["london", "GBP"],
  ["france", "EUR"],
  ["paris", "EUR"],
  ["germany", "EUR"],
  ["berlin", "EUR"],
  ["italy", "EUR"],
  ["rome", "EUR"],
  ["milan", "EUR"],
  ["spain", "EUR"],
  ["madrid", "EUR"],
  ["barcelona", "EUR"],
  ["portugal", "EUR"],
  ["lisbon", "EUR"],
  ["netherlands", "EUR"],
  ["amsterdam", "EUR"],
  ["greece", "EUR"],
  ["athens", "EUR"],
  ["ireland", "EUR"],
  ["austria", "EUR"],
  ["vienna", "EUR"],
  ["belgium", "EUR"],
  ["denmark", "DKK"],
  ["copenhagen", "DKK"],
  ["sweden", "SEK"],
  ["stockholm", "SEK"],
  ["norway", "NOK"],
  ["oslo", "NOK"],
  ["switzerland", "CHF"],
  ["zurich", "CHF"],
  ["mexico", "MXN"],
  ["canada", "CAD"],
  ["toronto", "CAD"],
  ["vancouver", "CAD"],
  ["australia", "AUD"],
  ["sydney", "AUD"],
  ["melbourne", "AUD"],
  ["new zealand", "NZD"],
  ["brazil", "BRL"],
  ["argentina", "ARS"],
  ["chile", "CLP"],
  ["peru", "PEN"],
  ["colombia", "COP"],
  ["thailand", "THB"],
  ["bangkok", "THB"],
  ["vietnam", "VND"],
  ["south korea", "KRW"],
  ["korea", "KRW"],
  ["seoul", "KRW"],
  ["china", "CNY"],
  ["beijing", "CNY"],
  ["shanghai", "CNY"],
  ["hong kong", "HKD"],
  ["taiwan", "TWD"],
  ["india", "INR"],
  ["indonesia", "IDR"],
  ["bali", "IDR"],
  ["philippines", "PHP"],
  ["singapore", "SGD"],
  ["malaysia", "MYR"],
  ["turkey", "TRY"],
  ["istanbul", "TRY"],
  ["egypt", "EGP"],
  ["morocco", "MAD"],
  ["south africa", "ZAR"],
  ["united arab emirates", "AED"],
  ["dubai", "AED"],
  ["israel", "ILS"],
  ["poland", "PLN"],
  ["czech", "CZK"],
  ["prague", "CZK"],
];

export function currencyForDestination(destination: string | null | undefined): string {
  if (!destination) return "USD";
  const lower = destination.toLowerCase();
  const hit = CURRENCY_BY_KEYWORD.find(([keyword]) => lower.includes(keyword));
  return hit ? hit[1] : "USD";
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  }
}

export function currencySymbol(currency: string): string {
  const formatted = formatMoney(0, currency);
  return formatted.replace(/[\d.,\s]/g, "");
}
