
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { Component, OnInit, ViewChild,  ElementRef  } from '@angular/core';
import { Transactions } from 'src/app/models/transactions.interface';
import { AppService } from 'src/app/services/app.service';
import { Route, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MarketData } from 'src/app/models/market-data';
import { ActivatedRoute } from '@angular/router';
import { HistoricalPrice } from 'src/app/models/HistoricalPrice.interface';


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
    });
    this.loadMarketData();
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
        title: 'Candlesticks', // Titolo della serie di dati a candela
        // autoscaleInfoProvider: () => ({ // impostare prezzo minimo a  0 ??????????????
        //   priceRange: {
        //      minValue: 0,
        //      maxValue: 399,
        //   },
        //   }),
      });





      // Popola la serie di dati a candela con dati di esempio
      const data = [
        { time: '2023-09-01', open: 100, high: 110, low: 95, close: 105 },
        { time: '2023-09-02', open: 105, high: 115, low: 100, close: 110 },
        { time: '2023-09-03', open: 110, high: 120, low: 105, close: 115 },
        { time: '2023-09-04', open: 112, high: 122, low: 110, close: 118 },
        { time: '2023-09-05', open: 118, high: 128, low: 115, close: 125 },
        { time: '2023-09-06', open: 125, high: 135, low: 120, close: 130 },
        { time: '2023-09-07', open: 130, high: 140, low: 125, close: 135 },
        { time: '2023-09-08', open: 135, high: 145, low: 130, close: 140 },
        { time: '2023-09-09', open: 140, high: 150, low: 135, close: 145 },
        { time: '2023-09-10', open: 145, high: 155, low: 140, close: 150 },
        { time: '2023-09-11', open: 150, high: 160, low: 145, close: 155 },
        { time: '2023-09-12', open: 155, high: 165, low: 150, close: 160 },
        { time: '2023-09-13', open: 160, high: 170, low: 155, close: 165 },
        { time: '2023-09-14', open: 165, high: 175, low: 160, close: 170 },
        { time: '2023-09-15', open: 170, high: 180, low: 165, close: 175 },
        { time: '2023-09-16', open: 175, high: 185, low: 170, close: 180 },
        { time: '2023-09-17', open: 180, high: 190, low: 175, close: 185 },
        { time: '2023-09-18', open: 185, high: 195, low: 180, close: 190 },
        { time: '2023-09-19', open: 190, high: 200, low: 185, close: 195 },
        { time: '2023-09-20', open: 195, high: 205, low: 190, close: 200 },
        // Aggiungi altri dati di esempio
      ];

      this.candlestickSeries.setData(data);

   // Aggiungi una serie di dati a barre per i volumi
   this.volumeSeries = this.chart.addHistogramSeries({
    color: 'rgba(0, 0, 255, 0.3)',  // Colore delle barre del volume
    priceScaleId: 'right', // Usa l'asse destro per i volumi

  });
// Calcola i dati dei volumi collegati ai dati delle candele
const volumeData = data.map((candle) => {
  return {
    time: candle.time,
    value: Math.floor(Math.random() * 100) + 1, // Dati dei volumi casuali (cambia questa logica con i tuoi dati effettivi)
  };
});
this.volumeSeries.setData(volumeData);
      // Aggiungi una legenda personalizzata
      // this.addLegend(['Euro']);
    } else {
      console.error('Element with ID "chartContainer" not found in the DOM.');
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
}




