import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Route } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './auth/auth.guard';




import { TokenInterceptor } from './auth/token.interceptor';
import { AppService } from './services/app.service';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MarketComponent } from './components/market/market.component';
import { MarketAnalystComponent } from './components/market-analyst/market-analyst.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { ConfirmPaypalComponent } from './components/confirm-paypal/confirm-paypal.component';
import { ErrorComponent } from './components/error/error.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

const rotte: Route[] = [
  { path: '', redirectTo: 'controlPanel', pathMatch: 'full' },
  {
    path: 'controlPanel',
    component: LandingPageComponent,
    // canActivate: [AuthGuard]
  },
  { path: 'marketAnalyst/:marketDataId', component: MarketAnalystComponent },

  {
    path: 'market',
    component: MarketComponent,
     canActivate: [AuthGuard]
  },
  {
    path: 'marketAnalyst',
    component: MarketAnalystComponent,
     canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'paypal',
    component: PaypalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'confirmPaypal',
    component: ConfirmPaypalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'confirmPaypal:/details',
    component: ConfirmPaypalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: ErrorComponent,
    // canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
LandingPageComponent,
    NavbarComponent,
    MarketComponent,
    MarketAnalystComponent,
    PaypalComponent,
    ConfirmPaypalComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(rotte),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'), // Modifica 'access_token' con 'token'
        allowedDomains: ['localhost:3001'], // Rimuovi 'http://' e '/auth/login'
        disallowedRoutes: []
      }
    })
  ],
  providers: [
AppService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
