import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, IonButton} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonInput, IonButton, FormsModule],
})
export class SignupComponent  implements OnInit {
  
  email = "";
  password = "";

  constructor(private router: Router, private signup: SignupService) { }

  ngOnInit() {}

  logOut() {
    this.router.navigate(['/home'])
  }

  createAccount() {
    console.log("Creating account with:", this.email, this.password);
    // passing the users detaisl to the sign up pservice
    this.signup.registerUser(this.email, this.password).subscribe({ 
      // if the post is successful
      next: (response) => {
        const userId = response.id;
        this.router.navigate(['/restaurants', userId]);
      },
      // if the post is unsuccessful
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to create account');
      }
    });
  }

}
