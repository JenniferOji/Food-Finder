import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {

  constructor(private http: HttpClient) {}

  // posting the favourited restaurant to the database
  addToFavourties(restaurantId: string, restaurantName: string): Observable<any> { 
    const userId = localStorage.getItem('userId'); 
    return this.http.post(`${environment.backendUrl}/favourites`, { userId, restaurantId, restaurantName}); 
  }

  // getting the users favourtied restaurants from the database
  getFavourites(): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    return this.http.get(`${environment.backendUrl}/favourites/${userId}`);
  }
  

}
