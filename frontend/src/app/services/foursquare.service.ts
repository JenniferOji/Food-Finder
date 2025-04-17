import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// the service makes calls to the foursquare api to get restaurants
export class FoursquareService {
  private nearbyRestaurantsApi = 'https://api.foursquare.com/v3/places/search';
  private apiKey = environment.foursquareApiKey; 

  constructor(private http: HttpClient) { }

  getRestaurants(latitude: number, longitude: number) {
    // need headers for api authentication
    const headers = new HttpHeaders({ 'Authorization': this.apiKey });
    const params = {
      ll: `${latitude},${longitude}`, // the users location (latitude and logitude)
      categories: '13065', // searching for restaurants specifically  query: 'restaurant'
      limit: '50', // the number of results
    };

    return this.http.get(this.nearbyRestaurantsApi, { headers, params });
  }

  private restaurantsApi = "https://jsonblob.com/api/jsonBlob/1356640862804828160";
  private reviews = "http://jsonblob.com/api/jsonBlob/1358363956711972864";

  public getRestaurantsjson(){
    return this.http.get(this.restaurantsApi);
  }

  public getReviews(fsqId: string){
    const headers = new HttpHeaders({ 'Authorization': this.apiKey });
    // finding the reviews for the passed in restaurant using its fsq_id
    const reviews = `https://api.foursquare.com/v3/places/${fsqId}/tips`;

    // return this.http.get(this.reviews);
    return this.http.get(reviews, { headers });
  }

  public getRestaurantPhotos(fsqId: string) {
    const headers = new HttpHeaders({ 'Authorization': this.apiKey });
    // calling the api to access photos
    const url = `https://api.foursquare.com/v3/places/${fsqId}/photos`;
    
    return this.http.get(url, { headers });
  }


}
