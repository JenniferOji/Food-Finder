import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  // posting the users credentials to the database
  registerUser(email: string, password: string): Observable<any> { 
    return this.http.post(`${environment.backendUrl}/register`, { email, password }); // passing the users email and password in the request body
  }

  // posting the users credentials to the database
  loginUser(email: string, password: string): Observable<any> { 
    return this.http.post(`${environment.backendUrl}/login`, { email, password }); 
  }
}
