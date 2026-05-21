import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { MusicService } from './services/music.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Wir holen uns die "Gehirne" der App (Services)
  auth = inject(AuthService);
  music = inject(MusicService);

  // Felder für das Login-Formular
  username = '';
  password = '';

  constructor() {
    // Sobald die App startet, laden wir die Musikliste
    this.music.loadSongs();
  }

  // Diese Funktion wird aufgerufen, wenn man auf "Einloggen" klickt
  async einloggen() {
    const geklappt = await this.auth.login(this.username, this.password);
    if (geklappt) {
      // Felder leer machen
      this.username = '';
      this.password = '';
    }
  }
}
