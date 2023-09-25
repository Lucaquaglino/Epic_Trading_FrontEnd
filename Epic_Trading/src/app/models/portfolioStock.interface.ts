
// PortfolioStockResponse.interface.ts
export interface PortfolioStock {
  isSelected: boolean;
  content: PortfolioStock[];
  id: string;
  idUser: string;
  marketData: {
    id: string;
    name: string;
    symbol: string;
    price: number;
    volume: number;
    historicalPrices: {
      dateTime: string;
      price: number;
      idMarketData: string;
      timestamp: string;
    }[];
  };
  quantity: number;
  purchasePrice: number;
  color:any
}

  // Altre proprietà se necessario

