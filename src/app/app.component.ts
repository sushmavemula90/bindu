import { Component, HostListener, ViewChild, ElementRef} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AgentRegComponent } from './agent-reg/agent-reg.component';
import { AdminComponent } from './admin/admin.component';
import { RegComponent } from './reg/reg.component';
import { AccommodationComponent } from './accommodation/accommodation.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HomeComponent,
    AccommodationComponent,
    GalleryComponent,
    FeedbackComponent,
    AgentRegComponent,
    AdminComponent,
    RegComponent,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'proj';
  isRecording = false;
  showLoginDropdown = false;
  showPassword = false;
  username = '';
  password = '';

  @ViewChild('speechToText', { static: false }) speechToText!: ElementRef;

  constructor(private router: Router) {}

  toggleLoginDropdown() {
    this.showLoginDropdown = !this.showLoginDropdown;
  }

  closeLoginDropdown() {
    this.showLoginDropdown = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Voice recognition
  record() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-GB';
    this.isRecording = true;

    recognition.onresult = (event: any) => {
      this.speechToText.nativeElement.value = event.results[0][0].transcript;
      this.checkKeywordAndNavigate();
    };

    recognition.onend = () => {
      this.isRecording = false;
    };

    recognition.onerror = () => {
      this.isRecording = false;
    };

    recognition.start();
  }

  // Check for keywords in input and navigate
  onEnter(event: any) {
    if ((event as KeyboardEvent).key === 'Enter') {
      this.checkKeywordAndNavigate();
    }
  }

  checkKeywordAndNavigate() {
    const inputText = this.speechToText.nativeElement.value.toLowerCase().trim();

    if (inputText) {
        if (inputText.includes('rajasthan')) {
            this.router.navigate(['/rajasthan']);
        } else if (inputText.includes('uttar pradesh') || inputText.includes('uttarpradesh')) {
            this.router.navigate(['/uttarpradesh']);
        } else if (inputText.includes('kerala')) {
            this.router.navigate(['/kerala']);
        } else if (inputText.includes('maharashtra')) {
            this.router.navigate(['/maharashtra']);
        } else if (inputText.includes('tamil nadu') || inputText.includes('tamilnadu')) {
            this.router.navigate(['/tamilnadu']);
        } else if (inputText.includes('karnataka')) {
            this.router.navigate(['/karnataka']);
        } else if (inputText.includes('west bengal') || inputText.includes('westbengal')) {
            this.router.navigate(['/westbengal']);
        } else if (inputText.includes('gujarat')) {
            this.router.navigate(['/gujarat']);
        } else if (inputText.includes('punjab')) {
            this.router.navigate(['/punjab']);
        } else if (inputText.includes('telangana')) {
            this.router.navigate(['/telangana']);
        } else if (inputText.includes('odisha')) {
            this.router.navigate(['/odisha']);
        } else if (inputText.includes('andhra pradesh') || inputText.includes('andhrapradesh')) {
            this.router.navigate(['/andhrapradesh']);
        } else if (inputText.includes('delhi')) {
            this.router.navigate(['/delhi']);
        }

        // Delay clearing input to ensure navigation works smoothly
        setTimeout(() => {
            this.speechToText.nativeElement.value = '';
        }, 100);
    }
}


  // Handle form submission
  onSubmit(): void {
    if (!this.username || !this.password) {
      alert('Please enter both username and password.');
      return;
    }

    fetch('http://localhost:5200/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.username, password: this.password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid username or password');
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message || 'Login successful!');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  // Close dropdown if clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownContainer = document.getElementById('login-dropdown-container');
    if (this.showLoginDropdown && dropdownContainer && !dropdownContainer.contains(target)) {
      this.closeLoginDropdown();
    }
  }
}
