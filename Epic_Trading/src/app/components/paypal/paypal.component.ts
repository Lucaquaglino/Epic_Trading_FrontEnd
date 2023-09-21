import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  amount!:number  ;

  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;


  constructor(private router: Router, private payment: PaymentService, private Appservice:AppService) { }

  ngOnInit(): void {
    this.amount = this.payment.totalAmount;
    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          label: 'paypal',
          disableMaxWidth: false,
          tagline:false
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value:this.amount.toString(),
                  // this.amount.toString(),
                  currency_code: 'USD'
                }
              }
            ]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            if (details.status === 'COMPLETED') {
              this.payment.transactionID = details.id;
              console.log(details);
              this.createTransactionDEPOSIT()
              this.router.navigate(['confirmPaypal']);
            }
          });
        },
        onError: (error: any) => {
          console.log(error);
        }
      }
    ).render(this.paymentRef.nativeElement);

  }
  cancel() {
    this.router.navigate(['dashboard']);
  }






  createTransactionDEPOSIT(): void {
    const currentTimestamp = new Date().toISOString();
    const payload = {
      transactionType: "DEPOSIT",
      amount: this.amount,
      timeStamp:currentTimestamp,
      marketdata: {


      },
      order: {

      },
      portfolioStockId:""
    };

    this.Appservice.createTransaction(payload).subscribe(
      (createdTransaction:any) => {

        console.log('Transazione creata con successo:', createdTransaction);
      },
      (error:any) => {
        console.error('Errore durante la creazione della transazione:', error);
      }
    );
  }









}


