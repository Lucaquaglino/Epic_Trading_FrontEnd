export interface Transactions {


    "timeStamp":string,
    "amount": number,
    "currency": string,
    "transactionType": string,
    "order": {
      "timeStamp": string,
      "quantity": number,
      "orderType": string,
      "marketData": {
        "name": string,
        "symbol": string,
        "price": number,
        "volume": number,
        "timeStamp": string
      }
    }
  }



