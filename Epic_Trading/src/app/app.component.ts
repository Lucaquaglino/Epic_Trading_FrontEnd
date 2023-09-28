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

    // Definisci un elenco di rotte in cui vuoi mostrare la navbar
    const routesWithNavbar = ['/market', '/marketAnalyst', '/dashboard', '/paypal', '/confirmPaypal'];

    // Verifica se l'URL attuale è tra le rotte in cui vuoi mostrare la navbar
    return routesWithNavbar.includes(currentUrl) || currentUrl.startsWith('/marketAnalyst')|| currentUrl.startsWith('/confirmPaypal')
  }

}
