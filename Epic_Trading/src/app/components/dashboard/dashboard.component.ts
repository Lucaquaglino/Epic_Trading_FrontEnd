import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { PortfolioStock } from 'src/app/models/portfolioStock.interface';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showingPortfolio = false;
  showingTransactions = false;
  showingProfile=false;
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

  };
  email: string = '';
  page = 0; // Imposta la pagina iniziale
  pageSize =20;
portfolioStock: PortfolioStock[] = [];

userId!: string;
user: any;

userPortfolioStocks: PortfolioStock[] = [];


  constructor( private authService: AuthService,private AppService: AppService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe(userInfo => {
      this.currentUserInfo = userInfo;
      console.log(this.currentUserInfo);

      // Carica solo i portfolioStock dell'utente corrente

      const userId = this.currentUserInfo.id;
      this.loadUserPortfolioStocks(userId);
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



  // loadUserPortfolioStocks(userId: string): void {
  //   this.AppService.getUserPortfolioStocks(userId, this.page, 'id').subscribe(
  //     (response) => {
  //       console.log(response); // Controlla i dati ricevuti qui

  //       // Accedi agli oggetti PortfolioStock all'interno di content
  //       this.userPortfolioStocks = response.content;
  //     },
  //     (error) => {
  //       console.error("Error fetching user's portfolioStocks:", error);
  //     }
  //   );

  // }
  loadUserPortfolioStocks(userId: string): void {
    this.AppService.getUserPortfolioStocks(userId, this.page, 'id').subscribe(
      (response) => {
        console.log("portfolio",response); // Controlla i dati ricevuti qui
        this.userPortfolioStocks = response.content; // Accedi al campo "content"
      },
      (error) => {
        console.error("Error fetching user's portfolioStocks:", error);
      }
    );
  }



  // loadPortfolioStock(): void {

  //   this.AppService.getPortfolioStock(this.page, 'id').subscribe(
  //     (portfolioStock : any) => {
  //       console.log("portafoglio",portfolioStock);
  //       this.portfolioStock = portfolioStock;
  //     },
  //     (error) => {
  //       console.error("Error fetching transaction:", error);
  //     }
  //   );
  // }


  // loadUserPortfolioStocks(userId: string): void {
  //   this.AppService.getUserPortfolioStocks(userId, this.page, 'id').subscribe(
  //     (portfolioStocks: portfolioStock[]) => {
  //       console.log(portfolioStocks);
  //       this.userPortfolioStocks = portfolioStocks;
  //     },
  //     (error) => {
  //       console.error("Error fetching user's portfolioStocks:", error);
  //     }
  //   );
  // }







}
