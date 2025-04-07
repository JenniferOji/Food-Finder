import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationService } from '../services/location.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption, IonText, IonPopover} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline, ellipsisHorizontal } from 'ionicons/icons';
import { FoursquareService } from '../services/foursquare.service';
import { FavouritesService } from '../services/favourites.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption , IonText, IonPopover],
  styleUrls: ['./restaurants.component.scss'],
  // the icons being used in this page
  template: `<ion-icon name="home-outline"></ion-icon>
             <ion-icon name="heart-outline"></ion-icon>
             <ion-icon name="map-outline"></ion-icon>
             <ion-icon name="ellipsis-horizontal"></ion-icon>`
})
export class RestaurantsComponent  implements OnInit {
  restaurants!: any;
  cuisines!: any;
  position: any;
  userId!: any;

  // returning an array of objects - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private router: Router, private fsqs: FoursquareService,  private ls: LocationService, private favs: FavouritesService){
    addIcons({
        homeOutline,
        heartOutline,
        mapOutline,
        ellipsisHorizontal
    });
 }

  ngOnInit() {
    // getting the users location when the component is loaded 
    const latitude = parseFloat(localStorage.getItem('latitude')!);
    const longitude = parseFloat(localStorage.getItem('longitude')!);    
    console.log(latitude, longitude);
    this.getNearbyRestaurants(latitude, longitude);
  }

  // passing in the users coordinates to get restaurants in their area 
  getNearbyRestaurants(lat: number, lon: number) {
    this.fsqs.getRestaurants(lat, lon).subscribe({
      next: (data: any) => {
        this.restaurants = data.results; 
        // grouping the restaurants from the api by cusisine 
        this.groupRestaurantsByCuisine();
        console.log(this.restaurants);
      },
      error: (error) => {
        console.error('error getting restaurants:', error);
      }
    });
  }

  // grouping the restaurants resuts by restaurant type - i.e : mexican, italian etc
  groupRestaurantsByCuisine() {
    this.cuisines = {}; // initialising an empty object has keys cuisines and array of restaurants as values
  
    this.restaurants.forEach((restaurant: any) => {
      // checking if the cuisine cataegory already exists in the cusisine object 
      if (!this.cuisines[restaurant.categories?.[0]?.plural_name]) { 
        this.cuisines[restaurant.categories?.[0]?.plural_name ] = []; // if not it creates an empty array for that cuisine
      }
      this.cuisines[restaurant.categories?.[0]?.plural_name ].push(restaurant); // adding the restaurant to the corresponding cuisine category 
    });
    console.log(this.cuisines)
  }

  // adding a restaurant to the favourties page 
  addRestaurantToFavourites(restaurant: any) {
    console.log("restaurant:", restaurant );
    // passing the selected restaurant to the service
    this.favs.addToFavourties(restaurant.fsq_id, restaurant.name).subscribe({ 
      next: (response) => {
        console.log(restaurant.name + restaurant.id + " added to favourties");
      },
      error: (error) => {
        console.log("error: " + error)
      }
    });
  }

  checkReviews(restaurant: any){
    const fsqId = restaurant.fsq_id;
    this.router.navigate(['/reviews', fsqId])
  }
  // navigation buttons on the footer
  goToHome() {
    this.router.navigate(['/restaurants'])
  }

  goToFavourites() {
    this.router.navigate(['/favourites'])
  }

  goToMap() {
    this.router.navigate(['/map'])
  }

  logOut() {
    this.router.navigate(['/home'])
  }


  stars(rating: any): string {
    // converting the number to a float 
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating)) {
      return "assets/images/rating0.png"; // displaying a default image if the number is not valid 
    }
  
    // rounding the number and displaying the corresponding image 
    const roundRating = Math.round(parsedRating * 2.0) / 2.0; 
    return `assets/images/rating${roundRating}.png`;
  }
}




