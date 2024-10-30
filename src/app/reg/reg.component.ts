import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-reg',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink,RouterOutlet,HomeComponent], // Import FormsModule for ngModel
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css'],
})
export class RegComponent {
  fullname: string = '';
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Form submission handler
  onSubmit(): void {
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9]*\d+@gmail\.com$/;
    if (!emailPattern.test(this.email)) {
      alert("Email must start with letters, contain numbers, and end with '@gmail.com'.");
      return;
    }
    // Basic client-side validation
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Send the data to the server using fetch
    fetch('http://localhost:5200/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: this.fullname,
        username: this.username,
        email: this.email,
        phone: this.phone,
        password: this.password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        this.successMessage = data.message;
        alert(data.message); // Optional: show success alert
        this.router.navigate(['/login']); // Optional: navigate to login after success
      } else {
        this.errorMessage = "Registration failed.";
      }
    })
    .catch(error => {
      console.error('Error:', error);
      this.errorMessage = 'Registration failed!';
    });
  }
}