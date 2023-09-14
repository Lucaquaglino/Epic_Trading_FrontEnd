import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Transactions } from '../models/transactions.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { MarketData} from '../models/market-data';
import { PortfolioStock } from '../models/portfolioStock.interface';
import { userInfo } from '../models/userInfo.interface';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private urlTransactions = 'http://localhost:3001/transactions'; // Controlla l'URL del backend
private urlMarketData='http://localhost:3001/marketData';
private urlTransaction='http://localhost:3001/transactions';
private urlPortfolioStock = 'http://localhost:3001/portfolioStock';
private urlHistoricalPrice= 'http://localhost:3001/historicalPrice';
  constructor(private http:HttpClient) { }


  getTransaction(page:Number, order:string): Observable<Transactions[]> {
    const params = new HttpParams()

    .set('page', page.toString())
    .set('order', order)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(this.urlTransactions, { params, headers })
      .pipe(map(response => response.content));
  }


  createTransaction(payload: any): Observable<Transactions> {
    return this.http.post<Transactions>(this.urlTransaction, payload);
  }



  getMarketData(page:Number, order:string): Observable<MarketData[]> {

    const params = new HttpParams()

    .set('page', page.toString())
    .set('order', order)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(this.urlMarketData, { params,headers })
      .pipe(map(response => response.content));
  }

  // getPortfolioStock(page:Number, order:string): Observable<any> {
  //   const params = new HttpParams()

  //   .set('page', page.toString())
  //   .set('order', order)
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${localStorage.getItem('token')}`
  //   });
  //   return this.http.get<any>(this.urlPortfolioStock, { params, headers })
  //     .pipe(map(response => response.content));
  // }

  // getUserPortfolioStocks(userId: string, page: number, order: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('order', order)
  //     .set('userId', userId); // Aggiungi il parametro userId

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${localStorage.getItem('token')}`
  //   });

  //   return this.http.get<any>(this.urlPortfolioStock, { params, headers })
  //     .pipe(map(response => response.content));
  // }

  getUserPortfolioStocks(userId: string, page: number, order: string): Observable<PortfolioStock> {
    const params = {
      page: page.toString(),
      order: order,
      userId: userId
    };

    return this.http.get<PortfolioStock>( `${this.urlPortfolioStock}/${userId}`, { params });
  }


  getHistoricalPricesByMarketDataId(marketDataId: string): Observable<any> {
    return this.http.get<any[]>(`${this.urlHistoricalPrice}/${marketDataId}`);
  }



  getMarketDataId(marketDataId: string): Observable<any> {
    return this.http.get<any[]>(`${this.urlMarketData}/${marketDataId}`);
  }


  getUserTransactions(userId: string, page: number, order: string): Observable<userInfo> {
    const params = {
      page: page.toString(),
      order: order,
      userId: userId
    };

    return this.http.get<userInfo>( `${this.urlTransaction}/${userId}`, { params });
  }






}
