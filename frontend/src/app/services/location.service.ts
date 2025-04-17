import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}
  //https://jigneshkumar1494.medium.com/how-to-get-current-location-in-angular-14-cbb1fa403560#:~:text=getCurrentLocation()%3B,and%20longitude%20on%20the%20console.
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      // checking if geolocation is supported before proceeding
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              console.log('Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude);
              // extracting the latitude and longitude
              let latitude = position.coords.latitude;
              let longitude = position.coords.longitude;

              const location = {
                latitude,
                longitude,
              };
              resolve(location);
            }
          },
          (error) => console.log(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
}

