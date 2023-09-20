import { Component, OnInit, ViewChild,  ElementRef  } from '@angular/core';
import { Transactions } from 'src/app/models/transactions.interface';
import { AppService } from 'src/app/services/app.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MarketData } from 'src/app/models/market-data';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  previousPrices: number[] = [];
  email: string = '';
    page = 0; // Imposta la pagina iniziale
    pageSize =10;
marketData!: MarketData[];
newmarketData : MarketData = {
  "id":"",
  "name":"",
  "symbol":"",
    "price":null!,
   "volume":null!,
     "timeStamp":"",
     color:null!,
     quantity:null!

}
quantity: number = 1; // Imposta un valore di default o iniziale, se necessario

newTransaction: Transactions = {
  "timeStamp":"",
  "amount": null!,
  "currency": "",
  "transactionType": "",
  "marketData": {
    "id": "",
    "name": "",
    "symbol": "",
    "price":null!,
    "volume": null!,
    "timeStamp": ""
  },
  "order": {
    "timeStamp": "",
    "quantity": null!,
    "orderType": "",
    "marketData": {
      "id": "",
      "name": "",
      "symbol": "",
      "price": null!,
      "volume": null!,
      "timeStamp": ""
    }
  }
}


  constructor(private AppService: AppService, private router: Router, private el: ElementRef) {}
  showSpinner = true;
  ngOnInit(): void {
    this.loadMarketData();
    setTimeout(() => {
      this.showSpinner = false;
    }, 3500);
    // setInterval(() => {
    //   this.loadMarketData();
    // }, 10000);
  }
  // createTransaction(newmarketData:string): void {
  //   const payload = {
  //          // Supponendo che il tuo oggetto MarketData abbia un campo "currency"
  //     // amount: ,
  //     transactionType: "BUY",

  //     marketdata: {

  //       "id":	newmarketData,

  //     },
  //     order:{
  //     orderType :"BUY",
  //     quantity : 2// Supponendo che il tuo oggetto MarketData abbia un campo "price"
  //     // Altri campi del payload
  //     // marketData: {
  //     //   id:"3fca7623-ef47-47cb-9ee9-8b5c22fe3426",
  //     //   "name":	"Grimes, Reilly and Hagenes",
  //     //   "symbol":"MITK",
  //     //   "price": 423.12,
  //     //   "volume": 	7739.08,
  //     //   "timeStamp": ""
  //     // }
  //   }
  //   };

  //   this.AppService.createTransaction(payload).subscribe(
  //     (createdTransaction) => {
  //       // Gestisci la risposta dal backend
  //       console.log('Transazione creata con successo:', createdTransaction);
  //     },
  //     (error) => {
  //       // Gestisci gli errori
  //       console.error('Errore durante la creazione della transazione:', error);
  //     }
  //   );
  // }


  createTransaction(newmarketData: string, quantity: number): void {
    const currentTimestamp = new Date().toISOString();
    const payload = {
      transactionType: "BUY",
      amount: 1000000,
      timeStamp:currentTimestamp,
      marketdata: {
        "id": newmarketData,

      },
      order: {
        orderType: "BUY",
        quantity: quantity, // Utilizza la quantità fornita dall'input
        timeStamp: currentTimestamp,
      },
      portfolioStockId:""
    };

    this.AppService.createTransaction(payload).subscribe(
      (createdTransaction) => {
        console.log('Transazione creata con successo:', createdTransaction);
      },
      (error) => {
        console.error('Errore durante la creazione della transazione:', error);
      }
    );
  }





  viewDetails(stockId: string) {
    // Naviga alla pagina dei dettagli delle azioni con l'ID come parametro
    this.router.navigate(['/marketAnalyst', stockId]);
  }




  loadMarketData(): void {
    this.AppService.getMarketData(this.page, 'id').subscribe(
      (marketData: MarketData[]) => {
        console.log(marketData);
        // Calcola la variazione percentuale e imposta il colore per ciascun marketData
        marketData.forEach((data, index) => {
          if (this.previousPrices[index] !== undefined) {
            const priceChange = data.price - this.previousPrices[index];
            const percentageChange = (priceChange / this.previousPrices[index]) * 100;

            // Assegna il colore in base alla variazione percentuale
            if (percentageChange > 0) {
              data.color = 'green';
            } else if (percentageChange < 0) {
              data.color = 'red';
            } else {
              data.color = 'black';
            }
          }

          // Aggiorna il valore precedente con il nuovo prezzo
          this.previousPrices[index] = data.price;
        });

        this.marketData = marketData;
      },
      (error) => {
        console.error("Error fetching marketData:", error);
      }
    );
  }


  nextPage() {
    this.page++; // Vai alla pagina successiva
    this.loadMarketData();

  }

  previousPage() {
    if (this.page > 0) {
      this.page--; // Vai alla pagina precedente solo se non sei sulla prima pagina
      this.loadMarketData();
    }
  }

}
