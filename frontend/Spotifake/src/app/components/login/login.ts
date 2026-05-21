import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  auth = inject(AuthService);

  username = '';
  password = '';

  async doLogin() {
    const success = await this.auth.login(this.username, this.password);
    if (success) {
      this.username = '';
      this.password = '';
    } else {
      alert('Login fehlgeschlagen!');
    }
  }
}
