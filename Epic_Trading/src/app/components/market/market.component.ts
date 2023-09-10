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
marketData: MarketData[]=[];


  constructor(private AppService: AppService, private router: Router, private el: ElementRef) {}

  ngOnInit(): void {
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
}
