import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpService } from '../services/http.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  imports: [CommonModule],
  styleUrls: ['./restaurants.component.scss'],
})
export class RestaurantsComponent  implements OnInit {
  restaurants!: any;
  position: any;
 constructor(private router: Router, private hs: HttpService, private ls: LocationService){}

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

}




