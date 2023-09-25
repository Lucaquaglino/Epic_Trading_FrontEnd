import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PortfolioStock } from 'src/app/models/portfolioStock.interface';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Route, Router } from '@angular/router';
import { userInfo } from 'src/app/models/userInfo.interface';
import { Transactions } from 'src/app/models/transactions.interface';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { interval } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('countTo', [
      state('in', style({ transform: 'scale(1)' })),
      transition('void => *', [
        style({ transform: 'scale(1.1)' }),
        animate('1000ms ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {



// *logica withdraw
amount=0;

 //*logica per mostrare piu o meno dati (TRANSACTIONS & PORTFOLIO)
 showAll = false;
 numberOfItemsToShow = 7;
 showAllPF = false;
 numberOfItemsToShowPF = 6;

// *SPINNER
showSpinner: boolean = true;

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

  email: string = '';
  page = 0; // Imposta la pagina iniziale
  pageSize =20;
portfolioStock: PortfolioStock[] = [];

userPortfolioStocks: PortfolioStock[] = [];

originalUserInfo!: {
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

// *logica calcolo percentuale
purchasePrice!: number
 currentPrice!: number
currentNumber = 0; // Il numero corrente che cambierà durante l'animazione
  constructor( private authService: AuthService,private AppService: AppService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.authService.getCurrentUserInfo().subscribe(userInfo => {
      // this.currentUserInfo = userInfo;
      this.originalUserInfo = { ...userInfo };
      this.currentUserInfo = { ...userInfo };
      console.log(this.currentUserInfo);
      const userId = this.currentUserInfo.id;

      this.loadUserPortfolioStocks(userId);
      this.loadUserTransactions(userId);
      setTimeout(() => {
        this.showSpinner = false;
      }, 2000);
    //       setInterval(() => {
    //   this.loadUserPortfolioStocks(userId);

    // }, 10000);

    this.startAnimation()

    });


  }


  viewDetails(stockId: string) {
    // Naviga alla pagina dei dettagli delle azioni con l'ID come parametro
    this.router.navigate(['/marketAnalyst', stockId]);
  }


  totalPortfolioQuantity: number = 0;
  previousPurchasePrices: number[] = [];
  // loadUserPortfolioStocks(userId: string): void {
  //   this.AppService.getUserPortfolioStocks(userId, this.page, 'id').subscribe(
  //     (response) => {
  //       console.log("portfolio", response);
  //       const userPortfolioStocks: PortfolioStock[] = response.content;
  //       let totalQuantity = 0;
  //       // Calcola la variazione percentuale e imposta il colore per ciascun PortfolioStock
  //       userPortfolioStocks.forEach((portfolioStock, index) => {
  //         totalQuantity += portfolioStock.quantity;
  //         if (this.previousPurchasePrices[index] !== undefined) {
  //           const priceChange = portfolioStock.marketData.price - this.previousPurchasePrices[index];
  //           const percentageChange = (priceChange / this.previousPurchasePrices[index]) * 100;


  //           // Assegna il colore in base alla variazione percentuale
  //           if (percentageChange > 0) {
  //             portfolioStock.color = 'green';
  //           } else if (percentageChange < 0) {
  //             portfolioStock.color = 'red';
  //           } else {
  //             portfolioStock.color = 'black';
  //           }
  //         }

  //         // Aggiorna il valore precedente con il nuovo prezzo di acquisto
  //         this.previousPurchasePrices[index] = portfolioStock.marketData.price;
  //       });
  //       this.totalPortfolioQuantity = totalQuantity;

  //       // console.log("test quantità portfolio",this.totalPortfolioQuantity)
  //       this.userPortfolioStocks = userPortfolioStocks;

  //     },
  //     (error) => {
  //       console.error("Error fetching user's portfolioStocks:", error);
  //     }
  //   );
  // }






  loadUserPortfolioStocks(userId: string): void {
    this.AppService.getUserPortfolioStocks(userId, this.page, 'id').subscribe(
      (response) => {
        console.log("portfolio", response);
        const userPortfolioStocks: PortfolioStock[] = response.content;
        let totalQuantity = 0;

        // Imposta isSelected su false per tutte le azioni inizialmente
        userPortfolioStocks.forEach((portfolioStock) => {
          portfolioStock.isSelected = false;
        });

        // Calcola la variazione percentuale e imposta il colore per ciascun PortfolioStock
        userPortfolioStocks.forEach((portfolioStock, index) => {
          totalQuantity += portfolioStock.quantity;
          if (this.previousPurchasePrices[index] !== undefined) {
            const priceChange = portfolioStock.marketData.price - this.previousPurchasePrices[index];
            const percentageChange = (priceChange / this.previousPurchasePrices[index]) * 100;

            // Assegna il colore in base alla variazione percentuale
            if (percentageChange > 0) {
              portfolioStock.color = 'green';
            } else if (percentageChange < 0) {
              portfolioStock.color = 'red';
            } else {
              portfolioStock.color = 'black';
            }
          }

          // Aggiorna il valore precedente con il nuovo prezzo di acquisto
          this.previousPurchasePrices[index] = portfolioStock.marketData.price;
        });

        this.totalPortfolioQuantity = totalQuantity;
        this.userPortfolioStocks = userPortfolioStocks;

      },
      (error) => {
        console.error("Error fetching user's portfolioStocks:", error);
      }
    );
  }

  // Funzione per aprire la finestra modale "modalSell" e impostare isSelected
  openSelllModal(stockId:any) {
    // Imposta isSelected su true solo per l'azione selezionata
    this.userPortfolioStocks.forEach((portfolioStock) => {
      if (portfolioStock.id === stockId) {
        portfolioStock.isSelected = true;
      } else {
        portfolioStock.isSelected = false;
      }
    });

    // Altri codici per aprire la finestra modale "modalSell"
  }










  totalSellBuyTransactionCount : number = 0;
loadUserTransactions(userId: string): void {
  this.AppService.getUserTransactions(userId, this.page, 'id').subscribe(
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

  isFormDirty = false;
  cancelPutUser():void{
    this.currentUserInfo = { ...this.originalUserInfo };
    this.isFormDirty=false
  }

  updateUser(userId: string ): void {
    this.authService.updateUser(userId, this.currentUserInfo).subscribe(
      (response) => {
        console.log('Utente aggiornato con successo:', response);
        this.isFormDirty = false;
        this.showModalOk = true;
      },
      (error) => {
        console.error('Errore durante l\'aggiornamento dell\'utente:', error);

      }
    );
  }


  showModalOk = false;
  onFieldChange(): void {
    this.isFormDirty = true;
    this.showModalOk = true;
  }


test():void{
  this.showModalOk = true;
}


createTransactionSELL(mdprice:number, newmarketData: string, quantity: number,portfolioId:string): void {
  const currentTimestamp = new Date().toISOString();
  const payload = {

    transactionType: "SELL",
    amount: 1000000,
    timeStamp: currentTimestamp,
    marketdata: {
      "id": newmarketData,
      "price": mdprice,
    },
    order: {
      orderType: "SELL",
      quantity: quantity,
      timeStamp: currentTimestamp,
    },
    portfolioStockId:portfolioId
  };

  this.AppService.createTransaction(payload).subscribe(
    (createdTransaction) => {
      console.log('Transazione di SELL creata con successo:', createdTransaction);
      this.loadUserPortfolioStocks(this.currentUserInfo.id);
      this.loadUserTransactions(this.currentUserInfo.id)

      this.authService.getCurrentUserInfo().subscribe(
        (userInfo) => {
          // Aggiorna le informazioni utente con i nuovi dati.
          this.currentUserInfo = userInfo;
          // this.currentNumber
          this.startAnimation()
        })
    },
    (error) => {
      console.error('Errore durante la creazione della transazione:', error);
    }
  );
}


createTransactionDEPOSIT(): void {
  const currentTimestamp = new Date().toISOString();
  const payload = {
    transactionType: "DEPOSIT",
    amount: 10000,
    timeStamp:currentTimestamp,
    marketdata: {


    },
    order: {

    },
    portfolioStockId:""
  };

  this.AppService.createTransaction(payload).subscribe(
    (createdTransaction) => {
      this.loadUserTransactions(this.currentUserInfo.id)
      this.authService.getCurrentUserInfo().subscribe(
        (userInfo) => {
          // Aggiorna le informazioni utente con i nuovi dati.
          this.currentUserInfo = userInfo;
          // this.currentNumber
          this.startAnimation()
        })
      console.log('Transazione creata con successo:', createdTransaction);
    },
    (error) => {
      console.error('Errore durante la creazione della transazione:', error);
    }
  );
}


createTransactionWITHDRAW(amount:number): void {
  const currentTimestamp = new Date().toISOString();
  const payload = {
    transactionType: "WITHDRAW",
    amount: amount,
    timeStamp:currentTimestamp,
    marketdata: {


    },
    order: {

    },
    portfolioStockId:""
  };

  this.AppService.createTransaction(payload).subscribe(
    (createdTransaction) => {
      this.loadUserTransactions(this.currentUserInfo.id)
      this.authService.getCurrentUserInfo().subscribe(
        (userInfo) => {
          // Aggiorna le informazioni utente con i nuovi dati.
          this.currentUserInfo = userInfo;
          // this.currentNumber
          this.startAnimation()
        })
      console.log('Transazione creata con successo:', createdTransaction);
    },
    (error) => {
      console.error('Errore durante la creazione della transazione:', error);
    }
  );
}


openWithdrawModal() {
  // Apre la modale quando viene fatto clic su "Settings"
  const settingsModal = document.getElementById('modalWithdraw');
  if (settingsModal) {
    settingsModal.classList.add('show');
    settingsModal.style.display = 'block';
  }
}

closeWithdrawModal() {
  // Chiude la modale
  const settingsModal = document.getElementById('modalWithdraw');
  if (settingsModal) {
    settingsModal.classList.remove('show');
    settingsModal.style.display = 'none';
  }
}

//*animazione per aumento balance
startAnimation() {
  let startValue = 0;
  const endValue = this.currentUserInfo.balance;
  const increment = 200; // Incremento desiderato

  const animationTimer = setInterval(() => {
    if (startValue + increment <= endValue) {
      startValue += increment;
      this.currentNumber = startValue;
    } else {
      this.currentNumber = endValue;
      clearInterval(animationTimer); // Ferma il timer quando il valore desiderato è stato raggiunto
    }
  }, 1); // Ogni millisecondo
}


// *calcolo variaione di prezzo portfolio
calculatePriceChange(purchasePrice: number, currentPrice: number): number {
  const priceChange = currentPrice - purchasePrice;
  return (priceChange / purchasePrice) * 100;
}





calculateGainLoss(transaction: userInfo): number {
  const   calculatedResult = transaction.amount - (transaction.order.quantity * transaction.order.marketData.price);


  if (calculatedResult > 0) {
    transaction.color = 'green';
  } else if (calculatedResult < 0) {
    transaction.color = 'red';
  } else {
    transaction.color = 'black';
  }



  return calculatedResult

}



calculateTotalPriceChange(portfolioStock:any): number {
  // Calcola il prezzo totale attuale
  const currentTotalPrice = portfolioStock.marketData.price * portfolioStock.quantity;

  // Calcola il prezzo totale all'acquisto
  const purchaseTotalPrice = portfolioStock.purchasePrice * portfolioStock.quantity;

  // Calcola la variazione percentuale
  if (purchaseTotalPrice === 0) {
    return 0; // Per evitare divisione per zero
  }

  const totalChange = (currentTotalPrice - purchaseTotalPrice );

  if (totalChange > 0) {
    portfolioStock.color = 'green';
  } else if (totalChange < 0) {
    portfolioStock.color = 'red';
  } else {
    portfolioStock.color = 'black';
  }


  return totalChange;

}




modalConfirmWithdraw():void{
const okModal = document.getElementById('modalConfirmWithdraw');
setTimeout(() => {
  okModal!.classList.add('show');
  okModal!.style.display = 'block';
}, 500);
  setTimeout(() => {
    okModal!.classList.remove('show');
    okModal!.style.display = 'none';
  }, 2500);
}



selectedStock:any;
openSellModal( price:number,id:string, quantity:number,idpS:string): void {
  const settingsModal = document.getElementById('modalSell');
  this.selectedStock = {
    id: id,
    price:price,
    quantity:quantity,
    idpS: idpS


  };
    settingsModal!.classList.add('show');
    settingsModal!.style.display = 'block';



}


closeSellModal():void{
  const settingsModal = document.getElementById('modalSell');
  if (settingsModal) {
    settingsModal.classList.remove('show');
    settingsModal.style.display = 'none';
  }

  this.userPortfolioStocks.forEach((portfolioStock) => {


      portfolioStock.isSelected = false;
    }
  );
}





  modalConfirmSell():void{
    const okModal = document.getElementById('modalConfirmSell');
    setTimeout(() => {
      okModal!.classList.add('show');
      okModal!.style.display = 'block';
    }, 500);
      setTimeout(() => {
        okModal!.classList.remove('show');
        okModal!.style.display = 'none';
      }, 2500);
    }




}
