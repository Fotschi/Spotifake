import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  // Hier speichern wir die Liste aller Songs
  songs = signal<any[]>([]);
  
  // Hier speichern wir, welches Lied gerade ausgewählt wurde
  currentSong = signal<any>(null);
  
  // Hier merken wir uns, ob die Musik gerade "läuft"
  isPlaying = signal(false);

  private apiUrl = 'http://localhost:3000/api/v1/songs';
  
  // DAS IST NEU: Unser echter Audio-Player im Hintergrund
  private audio = new Audio();

  // Holt alle Lieder vom Server
  async loadSongs() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      // Wir füllen unser Signal mit den Liedern
      this.songs.set(data);
    } catch (error) {
      console.error('Fehler beim Laden der Songs', error);
    }
  }

  // Startet ein Lied
  play(song: any) {
    this.currentSong.set(song);
    
    // Die Adresse zum Streamen bauen
    const streamUrl = `${this.apiUrl}/${song._id}/stream`;
    
    // Dem Player sagen, welches Lied er laden soll
    this.audio.src = streamUrl;
    this.audio.load();
    this.audio.play();
    
    this.isPlaying.set(true);
  }

  // Pause oder Play umschalten
  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying.update(wert => !wert);
  }
}
