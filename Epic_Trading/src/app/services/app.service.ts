import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Transactions } from '../models/transactions.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { MarketData} from '../models/market-data';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private urlTransactions = 'http://localhost:3001/transactions'; // Controlla l'URL del backend
private urlMarketData='http://localhost:3001/marketData';
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



}
