import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline, ellipsisHorizontal } from 'ionicons/icons';
import { FavouritesService } from '../services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel ],
  // the icons being used in this page
  template: `<ion-icon name="home-outline"></ion-icon>
             <ion-icon name="heart-outline"></ion-icon>
             <ion-icon name="map-outline"></ion-icon>
             <ion-icon name="ellipsis-horizontal"></ion-icon>`
})
  
export class FavouritesComponent  implements OnInit {
  // storing the favourtied restaurants from the database
  favourites: any[] = [];

  constructor(private router: Router, private favs: FavouritesService) { 
    addIcons({
      homeOutline,
      heartOutline,
      mapOutline,
      ellipsisHorizontal
    });
  }

  ngOnInit() {
    // getting the users favourtied restaurants when the page loads 
    this.loadFavourites(); 
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

  // navigation buttons for the footer 
  goToHome() {
    this.router.navigate(['/restaurants'])
  }

  goToFavourites() {
    this.router.navigate(['/favourites'])
  }

  logOut() {
    this.router.navigate(['/home'])
  }
}
