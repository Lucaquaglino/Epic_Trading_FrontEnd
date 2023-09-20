import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  amount = 0  ;

  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;

  constructor(private router: Router, private payment: PaymentService) { }

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
                  value: 10,
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
              this.router.navigate(['confirm']);
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


}


