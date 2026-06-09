import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  cdr = inject(ChangeDetectorRef);

  isLoginMode = true;
  username = '';
  password = '';
  loading = false;
  error = '';
  successMessage = '';
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  isSubmitting = false; // Prevent multiple rapid submissions

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.successMessage = '';
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.isLoginMode = true;
    this.username = '';
    this.password = '';
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.password = ''; // Passwort zurücksetzen für neuen Versuch
  }

  async handleSubmit() {
    // Prevent multiple rapid clicks
    if (this.isSubmitting) {
      return;
    }

    if (!this.username || !this.password) {
      this.error = 'Bitte fülle alle Felder aus.';
      return;
    }

    this.isSubmitting = true;
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
        const result = await this.auth.register(this.username, this.password);
        if (result.success) {
          // Show modal instead of just text
          this.showSuccessModal = true;
          this.successMessage = 'Account erfolgreich erstellt! Du kannst dich jetzt einloggen.';
        } else {
          this.showErrorModal = true;
          this.errorMessage = result.error || 'Registrierung fehlgeschlagen.';
        }
      }
    } finally {
      this.loading = false;
      // Reset the submission flag after a small delay to prevent accidental double submissions
      setTimeout(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges(); // Ensure UI updates even if we lost Zone context
      }, 500);
      this.cdr.detectChanges(); // Force UI update immediately
    }
  }
}
