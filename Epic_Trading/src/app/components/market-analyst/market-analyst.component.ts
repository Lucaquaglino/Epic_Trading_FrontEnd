
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { Component, OnInit, ViewChild,  ElementRef  } from '@angular/core';
import { Transactions } from 'src/app/models/transactions.interface';
import { AppService } from 'src/app/services/app.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MarketData } from 'src/app/models/market-data';
import { ActivatedRoute } from '@angular/router';
import { HistoricalPrice } from 'src/app/models/HistoricalPrice.interface';
import { Timestamp } from 'src/app/models/Timestamp.interface';

@Component({
  selector: 'app-market-analyst',
  templateUrl: './market-analyst.component.html',
  styleUrls: ['./market-analyst.component.scss']
})
export class MarketAnalystComponent implements OnInit {

  previousPrices: number[] = [];
  email: string = '';
    page = 0; // Imposta la pagina iniziale
    pageSize =10;
marketData!: MarketData[];
marketDataId!: any;
historicalPrices: HistoricalPrice[] = [];
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





  // chart
  private chart: IChartApi | null = null;
  private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null; // Aggiungi questa linea

  constructor(private AppService: AppService, private router: Router, private el: ElementRef,   private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.marketDataId = params.get('marketDataId');
      this.loadHistoricalPrices();
      this.loadMarketDataId();
      this.loadMarketData();


    });

    // Ottieni il riferimento all'elemento HTML che conterrà il grafico
    const chartContainer = document.getElementById('chartContainer');

    if (chartContainer) {
      // Crea il grafico all'interno dell'elemento chartContainer
      this.chart = createChart(chartContainer, {
        width: 1000, // Larghezza del grafico
        height: 400, // Altezza del grafico

        layout: {
          // backgroundColor: '#f0f0f0', // Colore di sfondo del grafico
          textColor: 'rgba(0, 0, 0, 0.9)', // Colore del testo
        },
        grid: {
          horzLines: {
            color: 'rgba(0, 0, 0, 0.1)', // Colore delle linee orizzontali della griglia
          },
          vertLines: {
            color: 'rgba(0, 0, 0, 0.1)', // Colore delle linee verticali della griglia
          },
        },
        timeScale: {
          timeVisible: true, // Visualizza il tempo sull'asse x
          secondsVisible: true, // Nascondi i secondi sull'asse x
fixRightEdge: true, // blocca a destra grafico//

        },



      });



      // Aggiungi una serie di dati a candela al grafico
      this.candlestickSeries = this.chart.addCandlestickSeries({
        upColor: '#00ff00', // Colore delle candele rialziste
        downColor: '#ff0000', // Colore delle candele ribassiste
        borderVisible: true, // Visualizza i bordi delle candele
        wickVisible: true, // Visualizza le ombre delle candele
        title: `${this.newmarketData.name}`, // Titolo della serie di dati a candela
        // autoscaleInfoProvider: () => ({ // impostare prezzo minimo a  0 ??????????????
        //   priceRange: {
        //      minValue: 0,
        //      maxValue: 399,
        //   },
        //   }),
      });

      function formatDateWithTimestamp(timestamp:any) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 perché i mesi sono zero-based
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
      }

      const timestamp = "2023-09-11T21:01:07.031994";
      const formattedDate = formatDateWithTimestamp(timestamp);
      console.log(formattedDate);


      this.AppService.getHistoricalPricesByMarketDataId(this.marketDataId)
      .subscribe(
        (historicalPrices) => {
          // Verifica se ci sono dati storici disponibili
          if (historicalPrices && historicalPrices.length > 0) {
            // Crea un array di dati nel formato corretto per il grafico
              // Crea un array di dati nel formato corretto per il grafico
          const data = historicalPrices.map((price: HistoricalPrice) => {
            // Estrai il timestamp dalla data storica
            const time = formatDateWithTimestamp(price.dateTime);
            // Estrai il prezzo di apertura dal primo elemento di timestamp
            const open = price.timestamp[0].price;
            // Estrai il prezzo di chiusura dall'ultimo elemento di timestamp
            const close = price.timestamp[price.timestamp.length - 1].price;
            // Trova il prezzo più alto nei timestamp
            const high = Math.max(...price.timestamp.map((ts: Timestamp) => ts.price));
            // Trova il prezzo più basso nei timestamp
            const low = Math.min(...price.timestamp.map((ts: Timestamp) => ts.price));

            return {
              time,
              open,
              close,
              high,
              low,
            };
          });
        // Ordina i dati in base al tempo crescente utilizzando una funzione di confronto personalizzata
data.sort((a:any, b:any) => {
  const timeA = new Date(a.time).getTime();
  const timeB = new Date(b.time).getTime();
  return timeA - timeB;
});

          // Imposta i dati nella serie a candela
          if (this.candlestickSeries) {
            this.candlestickSeries.setData(data);
          }

          // Ora puoi aggiungere i dati dei volumi, ad esempio generando dati casuali
          const volumeData = data.map((candle:any) => {
            return {
              time: candle.time,
              value: Math.floor(Math.random() * 100) + 1, // Dati dei volumi casuali (cambia questa logica con i tuoi dati effettivi)
            };
          });

          // Imposta i dati dei volumi nella serie dei volumi
          if (this.volumeSeries) {
            this.volumeSeries.setData(volumeData);
          }

          this.historicalPrices = historicalPrices; // Aggiorna l'array con i dati ricevuti
        }
      },
      (error) => {
        console.error('Error fetching historical prices:', error);
      }
    );
    }
  }

//   private addLegend(seriesNames: string[]): void {
//     const legendContainer = document.getElementById('legendContainer');
//     if (legendContainer) {
//       const legendList = document.createElement('ul');

//       // Aggiungi elementi di legenda per ciascuna serie
//       seriesNames.forEach((seriesName) => {
//         const legendItem = document.createElement('li');
//         legendItem.textContent = seriesName;

//         // Gestisci il clic sull'elemento di legenda
//         legendItem.addEventListener('click', () => {
//           if (this.candlestickSeries) {
//             const isVisible = this.candlestickSeries.options().title === seriesName;
//             this.candlestickSeries.applyOptions({ title: isVisible ? '' : seriesName });
//           }
//         });

//         legendList.appendChild(legendItem);
//       });

//       // Aggiungi ulteriori informazioni o elementi al legendContainer
//       const additionalInfo = document.createElement('div');
//       additionalInfo.textContent = 'Ulteriori informazioni qui';
//       legendContainer.appendChild(additionalInfo);

//       legendContainer.appendChild(legendList);
//     }

// }



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




loadHistoricalPrices(): void {

  this.AppService
  .getHistoricalPricesByMarketDataId(this.marketDataId)
  .subscribe(
    (historicalPrices) => {
      this.historicalPrices = historicalPrices; // Assegna i dati ricevuti all'array
      console.log( "historical price",this.historicalPrices); // Verifica i dati nella console
    },
    (error) => {
      console.error('Error fetching historical prices:', error);
    }
  );
  }



  loadMarketDataId(): void {

    this.AppService
    .getMarketDataId(this.marketDataId)
    .subscribe(
      (marketdata) => {
        this.newmarketData = marketdata; // Assegna i dati ricevuti all'array
        console.log( "marketDATA",this.newmarketData); // Verifica i dati nella console
        console.log( "marketDATA",this.newmarketData.name);
        this.candlestickSeries!.applyOptions({
          title: this.newmarketData.symbol // Imposta il nome dell'azione come titolo
        });
      },
      (error) => {
        console.error('Error fetching marketData ID:', error);
      }
    );
    }


}




