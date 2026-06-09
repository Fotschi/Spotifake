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
      
      // Handle auth errors - don't logout here, just log error
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized access to playlists');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        this.playlists.set(data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Playlists', error);
    }
  }

  async createPlaylist(name: string, imageFile?: File) {
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: formData
      });
      
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized to create playlist');
        return null;
      }
      
      if (response.ok) {
        await this.loadPlaylists();
        return await response.json();
      }
    } catch (error) {
      console.error('Fehler beim Erstellen', error);
    }
    return null;
  }

  async updatePlaylist(id: string, name?: string, imageFile?: File) {
    try {
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.authService.getToken()}`
        },
        body: formData
      });
      
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized to update playlist');
        return null;
      }
      
      if (response.ok) {
        await this.loadPlaylists();
        return await response.json();
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren', error);
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
      
      // Handle auth errors - return null instead of logging out
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized to access playlist:', id);
        return null;
      }
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 404) {
        console.error('Playlist not found:', id);
        return null;
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
      
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized to add song to playlist');
        return false;
      }
      
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
      
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized to remove song from playlist');
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.error('Fehler beim Entfernen', error);
      return false;
    }
  }
}
