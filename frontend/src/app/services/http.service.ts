import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) { }

  private restaurantsApi = "https://jsonblob.com/api/jsonBlob/1356640862804828160";

  public getRestaurants(){
    return this.http.get(this.restaurantsApi);
  }
}
