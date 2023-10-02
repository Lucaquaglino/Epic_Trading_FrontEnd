import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-confirm-paypal',
  templateUrl: './confirm-paypal.component.html',
  styleUrls: ['./confirm-paypal.component.scss']
})
export class ConfirmPaypalComponent implements OnInit {

  constructor( private route: ActivatedRoute,private router: Router) {}

details:any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams:any) => {
       this.details = JSON.parse(queryParams.details || '{}');
      console.log( "dettagli ricevuti pagamento ",this.details);
      if (Object.keys(this.details).length === 0 && this.details.constructor === Object) {
        this.router.navigate(['/**']);
      }
}
    )}


// METTO MAIUSCOLA LA PRIMA LETTERA DI NOME E COGNOME CHE MI RESTITUISCE DETAILS
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

}
