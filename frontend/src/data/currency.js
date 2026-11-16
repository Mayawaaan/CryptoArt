import BTC from '../assets/coinsImage/BTC.png'
import ETH from '../assets/coinsImage/ETH.png'
import SOL from '../assets/coinsImage/SOL.png'
import BNB from '../assets/coinsImage/BNB.png'
import XRP from '../assets/coinsImage/XRP.png'
import ADA from '../assets/coinsImage/ADA.png'
import DOGE from '../assets/coinsImage/DOGE.png'
import USDT from '../assets/coinsImage/USDT.png'
import INRC from '../assets/coinsImage/INRC.png'

export const TOKENS = [
  // ========================
  // Cryptocurrencies (₹ Base)
  // ========================
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', icon: BTC, price: 6046600, balance: '0.54', type: 'crypto' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: ETH, price: 259400, balance: '12.45', type: 'crypto' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', icon: SOL, price: 15100, balance: '145.20', type: 'crypto' },
  { id: 'bnb', symbol: 'BNB', name: 'Binance Coin', icon: BNB, price: 53500, balance: '25.80', type: 'crypto' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP', icon: XRP, price: 52.5, balance: '15000.00', type: 'crypto' },
  { id: 'ada', symbol: 'ADA', name: 'Cardano', icon: ADA, price: 48.2, balance: '35000.00', type: 'crypto' },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', icon: DOGE, price: 18.4, balance: '120000.00', type: 'crypto' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', icon: USDT, price: 83.0, balance: '2450.00', type: 'crypto' },
  { id: 'inrc', symbol: 'INRC', name: 'Crypto Rupee', icon: INRC, price: 1.00, balance: '500000.00', type: 'crypto' },

  // ========================
  // Forex (₹ Base)
  // ========================
  { id: 'usd', symbol: 'USD', name: 'US Dollar', icon: null, price: 83.0, balance: '1000.00', symbolChar: '$', type: 'forex' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', icon: null, price: 92.1, balance: '500.00', symbolChar: '€', type: 'forex' },
  { id: 'gbp', symbol: 'GBP', name: 'British Pound', icon: null, price: 107.4, balance: '300.00', symbolChar: '£', type: 'forex' },
  { id: 'jpy', symbol: 'JPY', name: 'Japanese Yen', icon: null, price: 0.55, balance: '150000.00', symbolChar: '¥', type: 'forex' },
  { id: 'aud', symbol: 'AUD', name: 'Australian Dollar', icon: null, price: 57.3, balance: '800.00', symbolChar: 'A$', type: 'forex' },
  { id: 'cad', symbol: 'CAD', name: 'Canadian Dollar', icon: null, price: 63.1, balance: '900.00', symbolChar: 'C$', type: 'forex' },
  { id: 'chf', symbol: 'CHF', name: 'Swiss Franc', icon: null, price: 95.4, balance: '600.00', symbolChar: 'Fr', type: 'forex' },
  { id: 'cny', symbol: 'CNY', name: 'Chinese Yuan', icon: null, price: 11.5, balance: '8000.00', symbolChar: '¥', type: 'forex' },
  { id: 'hkd', symbol: 'HKD', name: 'Hong Kong Dollar', icon: null, price: 10.6, balance: '10000.00', symbolChar: 'HK$', type: 'forex' },
  { id: 'nzd', symbol: 'NZD', name: 'New Zealand Dollar', icon: null, price: 53.0, balance: '750.00', symbolChar: 'NZ$', type: 'forex' },
  { id: 'sek', symbol: 'SEK', name: 'Swedish Krona', icon: null, price: 7.9, balance: '12000.00', symbolChar: 'kr', type: 'forex' },
  { id: 'krw', symbol: 'KRW', name: 'South Korean Won', icon: null, price: 0.062, balance: '1500000.00', symbolChar: '₩', type: 'forex' },
  { id: 'sgd', symbol: 'SGD', name: 'Singapore Dollar', icon: null, price: 61.3, balance: '950.00', symbolChar: 'S$', type: 'forex' },
  { id: 'nok', symbol: 'NOK', name: 'Norwegian Krone', icon: null, price: 7.8, balance: '11000.00', symbolChar: 'kr', type: 'forex' },
  { id: 'mxn', symbol: 'MXN', name: 'Mexican Peso', icon: null, price: 4.9, balance: '20000.00', symbolChar: '$', type: 'forex' },
  { id: 'inr', symbol: 'INR', name: 'Indian Rupee', icon: null, price: 1.00, balance: '100000.00', symbolChar: '₹', type: 'forex' },
  { id: 'rub', symbol: 'RUB', name: 'Russian Ruble', icon: null, price: 0.92, balance: '90000.00', symbolChar: '₽', type: 'forex' },
  { id: 'zar', symbol: 'ZAR', name: 'South African Rand', icon: null, price: 4.5, balance: '25000.00', symbolChar: 'R', type: 'forex' },
  { id: 'try', symbol: 'TRY', name: 'Turkish Lira', icon: null, price: 2.6, balance: '40000.00', symbolChar: '₺', type: 'forex' },
  { id: 'brl', symbol: 'BRL', name: 'Brazilian Real', icon: null, price: 16.2, balance: '6000.00', symbolChar: 'R$', type: 'forex' },
];