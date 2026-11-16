export const CRYPTO_ASSETS = [
  { id: "btc", coingeckoId: "bitcoin", binancePair: "BTCUSDT", symbol: "BTC", name: "Bitcoin" },
  { id: "eth", coingeckoId: "ethereum", binancePair: "ETHUSDT", symbol: "ETH", name: "Ethereum" },
  { id: "sol", coingeckoId: "solana", binancePair: "SOLUSDT", symbol: "SOL", name: "Solana" },
  { id: "bnb", coingeckoId: "binancecoin", binancePair: "BNBUSDT", symbol: "BNB", name: "Binance Coin" },
  { id: "xrp", coingeckoId: "ripple", binancePair: "XRPUSDT", symbol: "XRP", name: "XRP" },
  { id: "ada", coingeckoId: "cardano", binancePair: "ADAUSDT", symbol: "ADA", name: "Cardano" },
  { id: "doge", coingeckoId: "dogecoin", binancePair: "DOGEUSDT", symbol: "DOGE", name: "Dogecoin" },
  { id: "usdt", coingeckoId: "tether", binancePair: null, symbol: "USDT", name: "Tether" },
  { id: "inrc", coingeckoId: null, binancePair: null, symbol: "INRC", name: "Crypto Rupee", isPrototypePeg: true },
]

export const FOREX_ASSETS = [
  { id: "usd", symbol: "USD", name: "US Dollar", symbolChar: "$" },
  { id: "eur", symbol: "EUR", name: "Euro", symbolChar: "€" },
  { id: "gbp", symbol: "GBP", name: "British Pound", symbolChar: "£" },
  { id: "jpy", symbol: "JPY", name: "Japanese Yen", symbolChar: "¥" },
  { id: "aud", symbol: "AUD", name: "Australian Dollar", symbolChar: "A$" },
  { id: "cad", symbol: "CAD", name: "Canadian Dollar", symbolChar: "C$" },
  { id: "chf", symbol: "CHF", name: "Swiss Franc", symbolChar: "Fr" },
  { id: "cny", symbol: "CNY", name: "Chinese Yuan", symbolChar: "¥" },
  { id: "hkd", symbol: "HKD", name: "Hong Kong Dollar", symbolChar: "HK$" },
  { id: "nzd", symbol: "NZD", name: "New Zealand Dollar", symbolChar: "NZ$" },
  { id: "sek", symbol: "SEK", name: "Swedish Krona", symbolChar: "kr" },
  { id: "krw", symbol: "KRW", name: "South Korean Won", symbolChar: "₩" },
  { id: "sgd", symbol: "SGD", name: "Singapore Dollar", symbolChar: "S$" },
  { id: "nok", symbol: "NOK", name: "Norwegian Krone", symbolChar: "kr" },
  { id: "mxn", symbol: "MXN", name: "Mexican Peso", symbolChar: "$" },
  { id: "inr", symbol: "INR", name: "Indian Rupee", symbolChar: "₹" },
  { id: "zar", symbol: "ZAR", name: "South African Rand", symbolChar: "R" },
  { id: "try", symbol: "TRY", name: "Turkish Lira", symbolChar: "₺" },
  { id: "brl", symbol: "BRL", name: "Brazilian Real", symbolChar: "R$" },
]

export function findAssetByKey(rawKey) {
  if (!rawKey) return null
  const key = String(rawKey).trim().toLowerCase()
  const normalizedSymbol = key.split("-")[0]

  const crypto = CRYPTO_ASSETS.find(
    (c) =>
      c.id === key ||
      c.coingeckoId === key ||
      c.symbol.toLowerCase() === key ||
      c.symbol.toLowerCase() === normalizedSymbol
  )
  if (crypto) return { ...crypto, type: "crypto" }

  const forex = FOREX_ASSETS.find(
    (f) =>
      f.id === key ||
      f.symbol.toLowerCase() === key ||
      f.symbol.toLowerCase() === normalizedSymbol
  )
  if (forex) return { ...forex, type: "forex" }

  return null
}
