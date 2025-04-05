import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption, IonText, IonPopover} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline } from 'ionicons/icons';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption , IonText, IonPopover],
  // the icons being used in this page
  template: `<ion-icon name="home-outline"></ion-icon>
             <ion-icon name="heart-outline"></ion-icon>
             <ion-icon name="map-outline"></ion-icon>`
})
export class MapComponent implements OnInit { 
  // displaying map on screen - https://www.youtube.com/watch?v=lkIRttJimsY
  private map!: L.Map; 

  latitude = parseFloat(localStorage.getItem('latitude')!);
  longitude = parseFloat(localStorage.getItem('longitude')!);    
  private centroid: L.LatLngExpression = [this.latitude, this.longitude]; // users coords 

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      heartOutline,
      mapOutline
    });
   }

  ngOnInit() {}

  // after the componenet has fully loaded to properly render the map 
  ngAfterViewInit(): void {
    this.initMap();
    // recalculating the size of the map 
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.setView(this.centroid); // centering the map on the users coords 
    }, 100);
  }

  // creating and displaying the map 
  private initMap(): void {
    // inititalising the map and setting it on the users loaction
    this.map = L.map('map', {
      center: this.centroid,
      zoom:20
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom:10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"> OpenStreetMap</a>'
    });
  
    tiles.addTo(this.map)
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
