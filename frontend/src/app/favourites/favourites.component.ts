import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline, ellipsisHorizontal, heartCircleOutline , heartCircle, heart} from 'ionicons/icons';
import { FavouritesService } from '../services/favourites.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, ],
  // the icons being used in this page
  template: `<ion-icon name="home-outline"></ion-icon>
             <ion-icon name="heart-outline"></ion-icon>
             <ion-icon name="map-outline"></ion-icon>
             <ion-icon name="ellipsis-horizontal"></ion-icon>
             <ion-icon name="heart-circle-outline"></ion-icon>
             <ion-icon name="heart-circle"></ion-icon>`
})
  
export class FavouritesComponent  implements OnInit {
  // storing the favourtied restaurants from the database
  favourites: any[] = [];

  constructor(private router: Router, private favs: FavouritesService) { 
    addIcons({
      homeOutline,
      heartOutline,
      mapOutline,
      ellipsisHorizontal,
      heartCircleOutline,
      heartCircle
    });
  }

  ngOnInit() {
    this.loadFavourites();
    // setting an interval to check for new favourites every 3 seconds 
    interval(3000).subscribe(() => {
      this.loadFavourites();
    });
  }

  // getting the users favourtied restaurants from the database
  loadFavourites() {
    this.favs.getFavourites().subscribe({
      next: (data) => {
        this.favourites = data;
      },
      error: (error) => {
        console.error("Error getting favourites:", error);
      }
    });
  }

  // deleting a restaurant from favourites 
  deleteFromFavourites(restaurantId: string) {
    this.favs.deleteFavourite(restaurantId).subscribe({
      next: () => {
        console.log(restaurantId, "removed from favourites:");
        this.ngOnInit();
      },
      error: (error) => console.error("Error removing favourite:", error)
    });
  }


  // navigation buttons for the footer 
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
}
