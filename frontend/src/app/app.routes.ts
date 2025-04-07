import { Routes } from '@angular/router';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { ReviewsComponent } from './reviews/reviews.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'restaurants',
    component: RestaurantsComponent
  },
  {
    path: 'favourites',
    component: FavouritesComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  { path: 'restaurants/:userId', 
    component: RestaurantsComponent
  }, 
  { path: 'login', 
    component: LoginComponent
  }, 
  { path: 'map', 
    component: MapComponent
  }, 
  { path: 'reviews', 
    component: ReviewsComponent
  }, 
  { path: 'reviews/:id', 
    component: ReviewsComponent
  }, 

];