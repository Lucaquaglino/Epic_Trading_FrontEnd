import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username: string = '';
  password: string = '';
  name :string = '';
  surname: string = '';
  role :string = 'ADMIN';
  email :string = '';
  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) {}

  ngOnInit() {
    // Ottieni l'email dalla rotta e precompila il campo email
    this.route.queryParams.subscribe((params) => {
      this.email = params["email"] || '';
    });
  }


register(){
  this.authService.register(this.username, this.name, this.surname, this.email, this.password, this.role).subscribe(
    (response) => {
      console.log('Registrazione effettuata:', response);
      this.router.navigate(['/login']);
    },
    (error) => {
      console.error('Registration error:', error);

    }
  );
}
}
