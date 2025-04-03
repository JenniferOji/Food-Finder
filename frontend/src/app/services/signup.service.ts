import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) {}

  // posting the users credentials to the database
  registerUser(email: string, password: string): Observable<any> { 
    return this.http.post(`${environment.backendUrl}/register`, { email, password }); // passing the users email and password in the request body
  }

}
