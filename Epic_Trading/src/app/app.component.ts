import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Epic_Trading';

  constructor(private router: Router) {}

  shouldShowNavbar(): boolean {
    // Ottieni l'URL attuale dalla route
    const currentUrl = this.router.url;

    // Decidi se mostrare la navbar in base all'URL attuale
    // Ad esempio, se l'URL contiene "controlpanel", nascondi la navbar
    return !currentUrl.includes('controlPanel') && !currentUrl.includes('register')&& !currentUrl.includes('login');
  }
}
