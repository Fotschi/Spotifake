import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);
  playlistService = inject(PlaylistService);

  isLoginMode = true;
  username = '';
  password = '';
  loading = false;
  error = '';
  successMessage = '';

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.successMessage = '';
  }

  async handleSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Bitte fülle alle Felder aus.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    try {
      if (this.isLoginMode) {
        const success = await this.auth.login(this.username, this.password);
        if (success) {
          this.playlistService.loadPlaylists();
          this.successMessage = 'Erfolgreich angemeldet! Weiterleitung...';
          setTimeout(() => {
            this.router.navigate(['/songs']);
          }, 1000);
        } else {
          this.error = 'Login fehlgeschlagen. Überprüfe Benutzername und Passwort.';
        }
      } else {
        const success = await this.auth.register(this.username, this.password);
        if (success) {
          this.successMessage = 'Account erfolgreich erstellt! Du kannst dich jetzt einloggen.';
          this.isLoginMode = true;
          this.username = '';
          this.password = '';
        } else {
          this.error = 'Registrierung fehlgeschlagen. Benutzername eventuell schon vergeben.';
        }
      }
    } finally {
      this.loading = false;
    }
  }
}
