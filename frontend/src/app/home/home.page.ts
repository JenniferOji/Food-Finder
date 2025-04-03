import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor(private router: Router) {}

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRestaurants() {
    this.router.navigate(['/restaurants']);
  }
}
