import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonSelect, IonSelectOption, IonText, IonPopover} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, mapOutline } from 'ionicons/icons';
import { FoursquareService } from '../services/foursquare.service';
import 'leaflet-gesture-handling';

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

  // https://leafletjs.com/examples/custom-icons/
  restaurantIcon = L.icon({
    iconUrl: 'assets/images/restaurant-marker.png',

    iconSize:     [65, 80], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  // https://leafletjs.com/examples/custom-icons/
  userIcon = L.icon({
    iconUrl: 'assets/images/user-marker.png',

    iconSize:     [55, 80], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

  latitude = parseFloat(localStorage.getItem('latitude')!);
  longitude = parseFloat(localStorage.getItem('longitude')!);    
  private centroid: L.LatLngExpression = [this.latitude, this.longitude]; // users coords as the centerpoint

  constructor(private router: Router, private fsqs: FoursquareService) {
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

    this.fsqs.getRestaurants(this.latitude, this.longitude).subscribe((res: any) => {
      const restaurants = res.results;
      restaurants.forEach((restaurant: any) => {
        const lat = restaurant.geocodes.main.latitude;
        const lang = restaurant.geocodes.main.longitude;
        const restaurantName = restaurant.name;

        L.marker([lat, lang], {icon: this.restaurantIcon}).addTo(this.map).bindPopup(restaurantName);

      });
    });

  }

  // creating and displaying the map 
  private initMap(): void {
    // inititalising the map and setting it on the users loaction
    this.map = L.map('map', {
      center: this.centroid,
      zoom:20,
      zoomControl: true,
      dragging: true,
      tap: false, // disables Ionics interference on mobile
      touchZoom: true, // enables pinch to zoom
      doubleClickZoom: true
    }as L.MapOptions & { tap: boolean });
    (this.map as any).options.tap = false; // overiding the ionic tap 

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom:10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright"> OpenStreetMap</a>'
    });
  
    tiles.addTo(this.map)

    L.marker([this.latitude, this.longitude], {icon: this.userIcon}).addTo(this.map).bindPopup("You are here!");

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
