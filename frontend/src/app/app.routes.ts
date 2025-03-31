import { Routes } from '@angular/router';
import { RestaurantsComponent } from './restaurants/restaurants.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {path:"restaurants", component:RestaurantsComponent},

];
