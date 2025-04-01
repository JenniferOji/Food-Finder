import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpService } from '../services/http.service';
import { LocationService } from '../services/location.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline, ellipsisHorizontal } from 'ionicons/icons';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent ],
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

  // returning an array of objects - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private router: Router, private hs: HttpService, private ls: LocationService){
    addIcons({
        homeOutline,
        heartOutline,
        mapOutline,
        ellipsisHorizontal
    });
 }

  ngOnInit() {
    // need to subscribe to an observable to get the data
    this.hs.get("https://jsonblob.com/api/jsonBlob/1356640862804828160").subscribe({
      next: (data) => {
        this.restaurants = data;
        this.groupRestaurantsByCuisine();

      },
      error: (err) => {
        console.log(JSON.stringify(err))
      },
      complete: () => {
        console.log("complete")
      }
    });
    // getting the users location when the component is loaded 
    this.getUserLocation();
  }

  async getUserLocation() {
    try {
      this.position = await this.ls.getCurrentLocation();
      console.log(this.position);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  }

  groupRestaurantsByCuisine() {
    this.cuisines = {}; // initialising an empty object has keys cuisines and array of restaurants as values
  
    this.restaurants.forEach((restaurant: any) => {
      // checking if the cuisine cataegory already exists in the cusisine object 
      if (!this.cuisines[restaurant.cuisine]) { 
        this.cuisines[restaurant.cuisine] = []; // if not it creates an empty array for that cuisine
      }
      this.cuisines[restaurant.cuisine].push(restaurant); // adding the restaurant to the corresponding cuisine category 
    });
  }

  goHome() {
    this.router.navigate(['/restaurants'])
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




