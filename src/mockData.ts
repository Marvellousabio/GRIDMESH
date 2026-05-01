export interface EnergyListing {
  id: string;
  sellerName: string;
  capacity: number; // kW
  available: number; // kWh
  price: number; // NGN per kWh
  location: [number, number]; // [lat, lng]
  timeSlots: string[];
  role: 'seller' | 'buyer';
}

export const MOCK_LISTINGS: EnergyListing[] = [
  {
    id: '1',
    sellerName: 'Lekki Solar Hub',
    capacity: 15,
    available: 45,
    price: 120,
    location: [6.4698, 3.5852],
    timeSlots: ['09:00 - 12:00', '14:00 - 17:00'],
    role: 'seller'
  },
  {
    id: '2',
    sellerName: 'Ikeja Power Share',
    capacity: 8,
    available: 12,
    price: 150,
    location: [6.5244, 3.3792],
    timeSlots: ['18:00 - 21:00'],
    role: 'seller'
  },
  {
    id: '3',
    sellerName: 'VGC Green Energy',
    capacity: 25,
    available: 100,
    price: 110,
    location: [6.4589, 3.6521],
    timeSlots: ['10:00 - 14:00', '15:00 - 19:00'],
    role: 'seller'
  },
  {
    id: 'user',
    sellerName: 'My Oasis Solar',
    capacity: 5,
    available: 20,
    price: 130,
    location: [6.4600, 3.5900], // Near Lekki
    timeSlots: ['08:00 - 11:00'],
    role: 'seller'
  }
];

export const DEMAND_FORECAST_DATA = [
  { time: '00:00', demand: 20, solar: 0 },
  { time: '04:00', demand: 15, solar: 0 },
  { time: '08:00', demand: 45, solar: 30 },
  { time: '12:00', demand: 85, solar: 95 },
  { time: '16:00', demand: 70, solar: 60 },
  { time: '20:00', demand: 95, solar: 5 },
  { time: '23:59', demand: 40, solar: 0 },
];

export const RECENT_TRADES = [
  { id: 't1', buyer: 'Kelechi O.', amount: 15, total: 1800, date: '2 mins ago' },
  { id: 't2', buyer: 'Amaka A.', amount: 5, total: 750, date: '15 mins ago' },
  { id: 't3', buyer: 'Tunde B.', amount: 22, total: 2640, date: '1 hour ago' },
];
