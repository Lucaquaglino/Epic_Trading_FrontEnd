import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { AppService } from '../../services/app.service';
import { userInfo } from 'src/app/models/userInfo.interface';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {
  amount!:number  ;

  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;


  constructor(private router: Router, private payment: PaymentService, private Appservice:AppService,private authService :AuthService) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe(userInfo => {
      // this.currentUserInfo = userInfo;
this.currentUserInfo = userInfo;
      console.log(this.currentUserInfo);
      const userId = this.currentUserInfo.id;
      this.loadUserTransactions(userId);
    });


    this.amount = this.payment.totalAmount;
    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          label: 'paypal',

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
              this.router.navigate(['confirmPaypal'], { queryParams: { details: JSON.stringify(details) } });
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
        this.loadUserTransactions(this.currentUserInfo.id)
        this.authService.getCurrentUserInfo().subscribe(
          (userInfo) => {
            // Aggiorna le informazioni utente con i nuovi dati.
            this.currentUserInfo = userInfo;
            // this.currentNumber

          })
        console.log('Transazione creata con successo:', createdTransaction);
      },
      (error:any) => {
        console.error('Errore durante la creazione della transazione:', error);
      }
    );
  }



page = 0;
transactions!:userInfo[];
currentUserInfo!: {
  id:string,
  name: string,
   email: string,phoneNumber: string,
    surname: string,
     username: string,
     balance: number,
    portfolioStock:{
    purchasePrice:number,
    id:string},
    transaction:{
      amount:number,
      transactionType: string,
      order:{
        marketData:{
        name:string,
        symbol:string,
        }
        quantity:number
      }
    }
};
  totalSellBuyTransactionCount : number = 0;
  loadUserTransactions(userId: string): void {
    this.Appservice.getUserTransactions(userId, this.page, 'id').subscribe(
      (response) => {
        console.log("transazioniUtente", response);

        const transactions: userInfo[] = response.content;
        let sellBuyTransactionCount = 0;
        // Conta le transazioni di tipo "SELL" e "BUY"
        transactions.forEach((transaction) => {
          if (transaction.transactionType === "SELL"|| transaction.transactionType === "BUY") {
            sellBuyTransactionCount++;
          }
        });

        this.totalSellBuyTransactionCount = sellBuyTransactionCount;


        this.transactions = transactions;

      },
      (error) => {
        console.error("Error fetching user's transactions:", error);
      }
    );
  }




}


