import { Component, OnInit, ViewChild,  ElementRef  } from '@angular/core';
import { Transactions } from 'src/app/models/transactions.interface';
import { AppService } from 'src/app/services/app.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MarketData } from 'src/app/models/market-data';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.scss'],

})
export class LandingPageComponent implements OnInit {
  email: string = '';
    page = 0; // Imposta la pagina iniziale
    pageSize =10;
marketData: MarketData[]=[];



    totalPages = 0;
    currentPage = 0;
    transaction: Transactions[] = [];
    newTransaction: Transactions = {
      "color": "",
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

        this.loadMarketData()
        this.loadTransaction();
        setTimeout(() => {
          this.showSpinner = false;
        }, 3000);

        // setInterval(() => {
        //   this.loadMarketData();
        // }, 10000);
      }


// porto mail getstarted nel register
      submitForm(form: NgForm) {
        const userEmail = form.value.email;
        this.router.navigate(['/register'], { queryParams: { email: userEmail } });
      }
      redirectToRegister() {
        this.router.navigate(['/register']); // Sostituisci con la tua rotta effettiva se diversa
      }




    loadTransaction(): void {

      this.AppService.getTransaction(this.page, 'id').subscribe(
        (transaction : Transactions[]) => {
          console.log(transaction);
          this.transaction = transaction;
        },
        (error) => {
          console.error("Error fetching transaction:", error);
        }
      );
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
        this. loadTransaction();

      }


      previousPage() {
        if (this.page > 0) {
          this.page--; // Vai alla pagina precedente solo se non sei sulla prima pagina
          this. loadTransaction();
        }
      }


}
