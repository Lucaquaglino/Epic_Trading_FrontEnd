import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  totalAmount! :number;
  transactionID = "";

  constructor() { }
}
