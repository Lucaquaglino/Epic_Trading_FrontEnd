import { Timestamp } from '../models/Timestamp.interface';


export interface HistoricalPrice {
  id: string;
  dateTime: string;
  price: number;
  idMarketData: string;
  timestamp: Timestamp[];
}
