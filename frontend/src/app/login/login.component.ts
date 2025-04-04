import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, IonButton} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, IonButton, FormsModule],

})
export class LoginComponent  implements OnInit {
  email = "";
  password = "";

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit() {}

  logOut() {
    this.router.navigate(['/home'])
  }

  validateUser() {
    console.log("Creating account with:", this.email, this.password);
    // passing the users detaisl to the sign up pservice
    this.auth.loginUser(this.email, this.password).subscribe({ 
      // if the post is successful
      next: (response) => {
        const userId = response.id;
        localStorage.setItem('userId', userId); // storing the users id in local storage
        this.router.navigate(['/restaurants']);
      },
      // if the post is unsuccessful
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to create account');
      }
    });
  }

}

