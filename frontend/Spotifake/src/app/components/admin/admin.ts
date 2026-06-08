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
  selectedImage: File | null = null;
  
  editingSongId: string | null = null;
  loading = false;

  constructor() {
    this.musicService.loadSongs();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  async uploadSong() {
    if (!this.selectedFile || !this.newSong.title || !this.newSong.artist) {
      alert('Bitte alle Felder ausfüllen!');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('song', this.selectedFile);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
    formData.append('title', this.newSong.title);
    formData.append('artist', this.newSong.artist);

    try {
      const response = await fetch('/api/v1/songs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: formData
      });

      if (response.ok) {
        this.newSong = { title: '', artist: '' };
        this.selectedFile = null;
        this.selectedImage = null;
        this.musicService.loadSongs();
      } else {
        const err = await response.json();
        alert('Fehler: ' + err.error);
      }
    } catch (e) {
      console.error(e);
      alert('Upload fehlgeschlagen');
    } finally {
      this.loading = false;
    }
  }

  async deleteSong(id: string) {
    if (!confirm('Wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/v1/songs/${id}`, {
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
    this.selectedImage = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async updateSong() {
    this.loading = true;
    
    const formData = new FormData();
    formData.append('title', this.newSong.title);
    formData.append('artist', this.newSong.artist);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    try {
      const response = await fetch(`/api/v1/songs/${this.editingSongId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: formData
      });

      if (response.ok) {
        this.editingSongId = null;
        this.newSong = { title: '', artist: '' };
        this.selectedImage = null;
        this.musicService.loadSongs();
      } else {
         const err = await response.json();
         alert('Fehler beim Aktualisieren: ' + (err.error || 'Unbekannter Fehler'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  cancelEdit() {
    this.editingSongId = null;
    this.newSong = { title: '', artist: '' };
    this.selectedImage = null;
    this.selectedFile = null;
  }
}
