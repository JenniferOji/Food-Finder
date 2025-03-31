import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpService } from '../services/http.service';
import { LocationService } from '../services/location.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline  } from 'ionicons/icons';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon],
  styleUrls: ['./restaurants.component.scss'],
  // the icons being used in this page
  template: `<ion-icon name="home-outline"></ion-icon>
             <ion-icon name="heart-outline"></ion-icon>
             <ion-icon name="map-outline"></ion-icon>`
})
export class RestaurantsComponent  implements OnInit {
  restaurants!: any;
  position: any;

 constructor(private router: Router, private hs: HttpService, private ls: LocationService){
  addIcons({
      homeOutline,
      heartOutline,
      mapOutline
    });
 }

  ngOnInit() {
    // need to subscribe to an observable to get the data
    this.hs.get("https://jsonblob.com/api/jsonBlob/1356247305552060416").subscribe({
      next: (data) => {
        this.restaurants = data;
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

  goHome() {
    this.router.navigate(['/restaurants'])
  }

  logOut() {
    this.router.navigate(['/home'])
  }

}




