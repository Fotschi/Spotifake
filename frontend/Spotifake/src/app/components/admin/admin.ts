import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  musicService = inject(MusicService);
  authService = inject(AuthService);

  // Formular-Daten
  newSong = { title: '', artist: '' };
  selectedFile: File | null = null;
  
  editingSongId: string | null = null;

  constructor() {
    this.musicService.loadSongs();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async uploadSong() {
    if (!this.selectedFile || !this.newSong.title || !this.newSong.artist) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    const formData = new FormData();
    formData.append('song', this.selectedFile);
    formData.append('title', this.newSong.title);
    formData.append('artist', this.newSong.artist);

    try {
      const response = await fetch('http://localhost:3000/api/v1/songs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Song hochgeladen!');
        this.newSong = { title: '', artist: '' };
        this.selectedFile = null;
        this.musicService.loadSongs();
      } else {
        const err = await response.json();
        alert('Fehler: ' + err.error);
      }
    } catch (e) {
      console.error(e);
      alert('Upload fehlgeschlagen');
    }
  }

  async deleteSong(id: string) {
    if (!confirm('Wirklich löschen?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/songs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        }
      });

      if (response.ok) {
        this.musicService.loadSongs();
      }
    } catch (e) {
      console.error(e);
    }
  }

  editSong(song: any) {
    this.editingSongId = song._id;
    this.newSong = { title: song.title, artist: song.artist };
  }

  async updateSong() {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/songs/${this.editingSongId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: JSON.stringify(this.newSong)
      });

      if (response.ok) {
        this.editingSongId = null;
        this.newSong = { title: '', artist: '' };
        this.musicService.loadSongs();
      }
    } catch (e) {
      console.error(e);
    }
  }

  cancelEdit() {
    this.editingSongId = null;
    this.newSong = { title: '', artist: '' };
  }
}
