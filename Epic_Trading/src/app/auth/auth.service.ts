import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient ) { }

  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>('http://localhost:3001/auth/login', credentials)
      .pipe(map(response => {
        console.log('Server Response:', response);
        if (response.accessToken) {
          console.log('Token:', response.accessToken);
          localStorage.setItem('token', response.accessToken);
        }
        return response;
      }));
  }


  register(username:String, name:String,  surname: string,
    email: string,
    password: string,
    role: string): Observable<any> {
      const newUser = { email, password, name, surname,role, username};
    return this.http.post<any>('http://localhost:3001/auth/register', newUser);
  }
  logout() {
    localStorage.removeItem('token');

    return this.http.post<any>('http://localhost:3001/auth/logout' ,null)


  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Potresti aggiungere altre funzioni per gestire il token
}
