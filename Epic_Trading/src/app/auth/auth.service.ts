import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { userInfo } from '../models/userInfo.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authSubj = new BehaviorSubject<null | userInfo>(null); // Serve per comunicare in tempo reale all'applicazione la presenza dell'utente autenticato
  response!: userInfo;
  user$ = this.authSubj.asObservable(); // La variabile di tipo BehaviourSubject che trasmetterà la presenza o meno dell'utente


  constructor(private http: HttpClient ) { }
urlUser:string="http://localhost:3001/users"
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>('http://localhost:3001/auth/login', credentials)
      .pipe(map(response => {
        console.log('Server Response:', response);
        if (response.accessToken) {
            // authguard
            this.authSubj.next(response);
            this.response=response;
          console.log('Token:', response.accessToken);
          localStorage.setItem('token', response.accessToken);


        }
        return response;
      }));
  }

  // getCurrentUserInfo() {
  //   return this.http.get<{ name: string, email: string }>('http://localhost:3001/users/current');
  // }


  getCurrentUserInfo(): Observable<any> {
    return this.http.get<any>('http://localhost:3001/users/current');
  }

  register(username:String, name:String,  surname: string,
    email: string,
    password: string,
    role: string): Observable<any> {
      const newUser = { email, password, name, surname,role, username};
    return this.http.post<any>('http://localhost:3001/auth/register', newUser);
  }
  logout() {
    this.authSubj.next(null);
    localStorage.removeItem('token');

    return this.http.post<any>('http://localhost:3001/auth/logout' ,null)


  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  updateUser(userId: string, userPayload: any): Observable<any> {
    const url = `${this.urlUser}/${userId}`;
    return this.http.put(url, userPayload);
  }


}
