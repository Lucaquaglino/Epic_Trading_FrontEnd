import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }


  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Login effettuato con successo
        const token = this.authService.getToken();
        console.log('Token:', token); // Verifica il token nella console
        this.router.navigate(['/dashboard']);
        console.log('Login effettuato:', response);
      },
      (error) => {
        console.error('Errore di login:', error);
      }
    );
  }
}
