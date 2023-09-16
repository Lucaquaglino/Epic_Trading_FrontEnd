import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PortfolioStock } from 'src/app/models/portfolioStock.interface';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Route, Router } from '@angular/router';
import { userInfo } from 'src/app/models/userInfo.interface';
import { Transactions } from 'src/app/models/transactions.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showingPortfolio = false;
  showingTransactions = false;
  showingProfile=false;


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
          qunatity:number
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
        qunatity:number
      }
    }
};



  constructor( private authService: AuthService,private AppService: AppService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe(userInfo => {
      // this.currentUserInfo = userInfo;
      this.originalUserInfo = { ...userInfo };
      this.currentUserInfo = { ...userInfo };
      console.log(this.currentUserInfo);
      const userId = this.currentUserInfo.id;
      this.loadUserPortfolioStocks(userId);
      this.loadUserTransactions(userId)
    //       setInterval(() => {
    //   this.loadUserPortfolioStocks(userId);
    // }, 10000);
    });


  }
  showPortfolio() {
    this.showingPortfolio = true;
    this.showingTransactions = false;
    this.showingProfile=false;
  }
  showProfile() {
    this.showingPortfolio = false;
    this.showingTransactions = false;
    this.showingProfile=true;
  }
  showTransactions() {
    this.showingPortfolio = false;
    this.showingTransactions = true;
    this.showingProfile=false;
  }


  viewDetails(stockId: string) {
    // Naviga alla pagina dei dettagli delle azioni con l'ID come parametro
    this.router.navigate(['/marketAnalyst', stockId]);
  }



  loadUserPortfolioStocks(userId: string): void {
    this.AppService.getUserPortfolioStocks(userId, this.page, 'id').subscribe(
      (response) => {
        console.log("portfolio",response);
        this.userPortfolioStocks = response.content;
      },
      (error) => {
        console.error("Error fetching user's portfolioStocks:", error);
      }
    );
  }


  loadUserTransactions(userId: string): void {
    this.AppService.getUserTransactions(userId, this.page, 'id').subscribe(
      (response) => {
        console.log("transazioniUtente",response);
        this.transactions= response.content;
      },
      (error) => {
        console.error("Error fetching user's portfolioStocks:", error);
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
      },
      (error) => {
        console.error('Errore durante l\'aggiornamento dell\'utente:', error);

      }
    );
  }



  onFieldChange(): void {
    this.isFormDirty = true;
  }


}
