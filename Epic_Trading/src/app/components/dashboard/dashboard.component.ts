import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showingPortfolio = false;
  showingTransactions = false;
  showingProfile=false;
  currentUserInfo!: { name: string, email: string,phoneNumber: string, surname: string, username: string,balance: number};
  constructor( private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getCurrentUserInfo().subscribe(userInfo => {
      this.currentUserInfo = userInfo;
      console.log(this.currentUserInfo);
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



}
