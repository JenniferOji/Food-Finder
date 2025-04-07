import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline, ellipsisHorizontal, heartCircleOutline , heartCircle, heart} from 'ionicons/icons';
import { FoursquareService } from '../services/foursquare.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText ],
  // the icons being used in this page
  template: `<ion-icon name="home-outline"></ion-icon>
             <ion-icon name="heart-outline"></ion-icon>
             <ion-icon name="map-outline"></ion-icon>
             <ion-icon name="ellipsis-horizontal"></ion-icon>
             <ion-icon name="heart-circle-outline"></ion-icon>
             <ion-icon name="heart-circle"></ion-icon>`
})
export class ReviewsComponent  implements OnInit {
  reviews: any[] = [];
  fsqId!: string; 
  constructor(private router: Router, private fsqs: FoursquareService, private route: ActivatedRoute,
  ) { 
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
    https://www.samjulien.com/how-to-use-route-parameters-in-angular/#:~:text=The%20first%20way%20is%20through,get%20%2C%20getAll%20%2C%20and%20has%20.
    this.fsqId = this.route.snapshot.paramMap.get('id') || "";
    this.fsqs.getReviews(this.fsqId).subscribe({
      next: (data: any) => {
        this.reviews = data; 
        // grouping the restaurants from the api by cusisine 
        console.log(this.reviews);
      },
      error: (error) => {
        console.error('error getting reviews:', error);
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
  
  goToMap() {
    this.router.navigate(['/map'])
  }
    
  logOut() {
    this.router.navigate(['/home'])
  }

}
