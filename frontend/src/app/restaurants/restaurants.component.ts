import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocationService } from '../services/location.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption, IonText, IonPopover, IonMenu, IonMenuButton, IonLabel, IonRadioGroup, IonRadio} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline, ellipsisHorizontal } from 'ionicons/icons';
import { FoursquareService } from '../services/foursquare.service';
import { FavouritesService } from '../services/favourites.service';
import { MenuController, GestureController, Gesture } from '@ionic/angular';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption , IonText, IonPopover, IonMenu, IonMenuButton, IonLabel, IonRadioGroup, IonRadio],
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
  chosenDistance!: number;
  distanceMenuChildren: boolean = false;
  chosenRating!: number;
  ratingMenuChildren: boolean = false;

  // returning an array of objects - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private router: Router, private fsqs: FoursquareService,  private ls: LocationService, private favs: FavouritesService, private menu: MenuController, private gesture: GestureController){
    addIcons({
        homeOutline,
        heartOutline,
        mapOutline,
        ellipsisHorizontal
    });
 }

  ngOnInit() {
    // getting the restaurants when the page is loaded
    this.getNearbyRestaurants();
  }

  ngAfterViewInit() {
    // swiping to close the menu 
    const menuElement = document.querySelector('ion-menu');
    if (menuElement) {
      const swipeGesture: Gesture = this.gesture.create({
        el: menuElement,
        gestureName: 'swipe-gesture',
        direction: 'x', // detecting a swipe in the horizontal
        threshold: 15,
        onEnd: (event) => {
          // closing the menu when swiped left
          if (event.deltaX < -50) {
            this.menu.close(); 
          }
        }
      });
      swipeGesture.enable();
    }
  }

  distances = [
    { label: '2 km', value: 2000 }, 
    { label: '5 km', value: 5000 }, 
    { label: '10 km', value: 10000 }, 
    { label: '15 km', value: 20000 } 
  ];

  ratings = [
    { label: '1 star', value: 1 }, 
    { label: '2 star', value: 2 }, 
    { label: '3 star', value: 3 }, 
    { label: '4 star', value: 4 },
    { label: '5 star', value: 5 }
  ];

  // passing in the users coordinates to get restaurants in their area 
  getNearbyRestaurants() {
    // getting the users location when the page is loaded 
    const latitude = parseFloat(localStorage.getItem('latitude')!);
    const longitude = parseFloat(localStorage.getItem('longitude')!);

    this.fsqs.getRestaurants(latitude, longitude).subscribe({
      next: (data: any) => {
        this.restaurants = data.results; 

      // getting a photo for each restaurant
      this.restaurants.forEach((restaurant: any) => {
        this.fsqs.getRestaurantPhotos(restaurant.fsq_id).subscribe({
          next: (photos: any) => {
            if (photos.length > 0) {
              const photo = photos[0]; // getting the first photo from the returned array of photos
              restaurant.photoURL = `${photo.prefix}original${photo.suffix}`; //https://stackoverflow.com/questions/33148300/how-do-i-use-the-link-for-a-foursquare-photo
            } 
            // displaying the app logo if a restaurant does not have an image 
            else {
              restaurant.photoURL = 'assets/images/logo.png';
            }
          },
          error: () => {
            restaurant.photoURL = 'assets/images/logo.png'; 
          }
        });
      });

        // grouping the restaurants from the api by cusisine 
        this.groupRestaurantsByCuisine();
        console.log(this.restaurants);
      },
      error: (error) => {
        console.error('error getting restaurants:', error);
      }
    });
  }

  // displaying the distance options on the menu
  showDistances(): void {
    this.distanceMenuChildren = !this.distanceMenuChildren; // changing to true / false - to show / hide the buttons
  }
  
  // function to filter the restaurants based on distance 
  changeDistance(distance: number) {
    this.chosenDistance = distance; // the distance th euser chose out of the options 
    const lat = parseFloat(localStorage.getItem("latitude")!);
    const lon = parseFloat(localStorage.getItem("longitude")!);

    this.fsqs.getRestaurants(lat, lon).subscribe({
      next: (data: any) => {
        // filtering through the returned restaurants results 
        this.restaurants = data.results.filter((restaurant: any) => {
          return restaurant.distance <= this.chosenDistance; // only returning restaurants whos distances are less than the chosen distance 
        });
        // regrouping the restaurants based on the filter 
        this.groupRestaurantsByCuisine(); 
        this.distanceMenuChildren = !this.distanceMenuChildren; // changing to true / false - to show / hide the buttons

      },
      error: (error) => {
        console.error('error filtering restaurants:', error);
      }
    });
  }

  openNow() {
    
  }

  changeRating(chosenRating: number) {
    this.restaurants = this.restaurants.filter((restaurant: any) => {
      console.log(restaurant.average_rating);
      return restaurant.average_rating >= this.chosenRating;
    });
    this.groupRestaurantsByCuisine();
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
    this.favs.addToFavourties(restaurant.fsq_id, restaurant.name, restaurant.photoURL, restaurant.location?.formatted_address).subscribe({ 
      next: (response) => {
        console.log(restaurant.name + restaurant.id + " added to favourties");
      },
      error: (error) => {
        console.log("error: " + error)
      }
    });
  }

  // going to the page that will display the clicked on restaurants reviews 
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




