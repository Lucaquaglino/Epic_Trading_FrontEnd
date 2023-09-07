import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Transactions } from '../models/transactions.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private urlTransactions = 'http://localhost:3001/transactions'; // Controlla l'URL del backend
private urlClientifiltroragionesociale='http://localhost:3001/clienti/filter/ragioneSociale';
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


}
