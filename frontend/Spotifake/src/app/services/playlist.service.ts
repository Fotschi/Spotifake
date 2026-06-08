import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlists = signal<any[]>([]);
  private apiUrl = '/api/v1/playlists';

  constructor(private authService: AuthService) {}

  async loadPlaylists() {
    if (!this.authService.isLoggedIn()) return;
    
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        this.playlists.set(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Playlists', error);
    }
  }

  async createPlaylist(name: string) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: JSON.stringify({ name })
      });
      
      if (response.ok) {
        await this.loadPlaylists(); // Liste neu laden
        return await response.json();
      }
    } catch (error) {
      console.error('Fehler beim Erstellen', error);
    }
    return null;
  }

  async getPlaylist(id: string) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Fehler beim Laden der Playlist', error);
    }
    return null;
  }

  async addSong(playlistId: string, songId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: JSON.stringify({ songId })
      });
      return response.ok;
    } catch (error) {
      console.error('Fehler beim Hinzufügen', error);
      return false;
    }
  }

  async removeSong(playlistId: string, songId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Fehler beim Entfernen', error);
      return false;
    }
  }
}
