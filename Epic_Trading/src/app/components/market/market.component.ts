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


  createTransaction(newmarketData: string, quantity: number): void {
    const currentTimestamp = new Date().toISOString();
    const payload = {
      transactionType: "BUY",
      amount: 0,
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
        this.closeConfirmationModal();
        // this.showSuccessMessage();
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
  previousPrices: number[] = [];
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
    window.scrollTo(0, 0);
  }

  previousPage() {
    if (this.page > 0) {
      this.page--; // Vai alla pagina precedente solo se non sei sulla prima pagina
      this.loadMarketData();
      window.scrollTo(0, 0);
    }

  }

// modale buy stock

selectedStock: any = null;

   openConfirmationModal(id:string): void {
    const settingsModal = document.getElementById('modalBUY');
    if (settingsModal) {

      this.selectedStock = {
        id: id

      };

      settingsModal.classList.add('show');
      settingsModal.style.display = 'block';


    }
  }


  closeConfirmationModal():void{
    const settingsModal = document.getElementById('modalBUY');
    if (settingsModal) {
      settingsModal.classList.remove('show');
      settingsModal.style.display = 'none';
    }
  }

// moDALE CONFERMA BUY
  // showSuccessMessage() {
  //   this.showSuccessModal = true;
  //   setTimeout(() => {
  //     this.showSuccessModal = false;
  //   }, 2000); // 2000 millisecondi (2 secondi)
  // }

  okModal():void{
    const okModal = document.getElementById('modalConfirm');
    setTimeout(() => {
      okModal!.classList.add('show');
      okModal!.style.display = 'block';
    }, 500);
      setTimeout(() => {
        okModal!.classList.remove('show');
        okModal!.style.display = 'none';
      }, 2500);
    }


}
