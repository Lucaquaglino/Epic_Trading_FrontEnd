import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showingPortfolio = false;
  showingTransactions = false;


  constructor() { }

  ngOnInit(): void {
  }
  showPortfolio() {
    this.showingPortfolio = true;
    this.showingTransactions = false;
  }

  showTransactions() {
    this.showingPortfolio = false;
    this.showingTransactions = true;
  }
}
