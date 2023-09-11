export interface Transactions {


    "timeStamp":string,
    "amount": number,
    "currency": string,
    "transactionType": string,
    "marketData": {
      "id": string,
      "name": string,
      "symbol": string,
      "price": number,
      "volume": number,
      "timeStamp": string
    }
    "order": {
      "timeStamp": string,
      "quantity": number,
      "orderType": string,
      "marketData": {
        "id": string,
        "name": string,
        "symbol": string,
        "price": number,
        "volume": number,
        "timeStamp": string
      }
    }
  }



