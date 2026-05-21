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

  constructor() {
    // Event-Listener für Fehler beim Abspielen
    this.audio.addEventListener('error', (e) => {
      console.error('❌ Audio Fehler:', e);
      console.error('Audio Error Code:', this.audio.error?.code);
      this.isPlaying.set(false);
    });

    // Wenn das Lied zu Ende ist
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });

    // Wenn das Lied geladen wurde
    this.audio.addEventListener('canplay', () => {
      console.log('✅ Audio kann jetzt abgespielt werden');
    });

    this.audio.addEventListener('loadstart', () => {
      console.log('🔄 Audio wird geladen...');
    });
  }

  // Holt alle Lieder vom Server
  async loadSongs() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      // Wir füllen unser Signal mit den Liedern
      this.songs.set(data);
      console.log('✅ Songs geladen:', data);
    } catch (error) {
      console.error('Fehler beim Laden der Songs', error);
    }
  }

  // Startet ein Lied
  play(song: any) {
    this.currentSong.set(song);
    
    // Die Adresse zum Streamen bauen
    const streamUrl = `${this.apiUrl}/${song._id}/stream`;
    
    console.log('🎵 Starte Song:', song.title);
    console.log('📡 Stream URL:', streamUrl);
    
    // Dem Player sagen, welches Lied er laden soll
    this.audio.src = streamUrl;
    this.audio.crossOrigin = 'anonymous'; // CORS aktivieren
    
    // Probiere abzuspielen
    const playPromise = this.audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Abspielen gestartet!');
          this.isPlaying.set(true);
        })
        .catch((error) => {
          console.error('❌ Fehler beim Abspielen:', error);
          this.isPlaying.set(false);
        });
    }
  }

  // Pause oder Play umschalten
  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
      console.log('⏸ Pausiert');
    } else {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('❌ Fehler beim Fortsetzen:', error);
        });
      }
      console.log('▶ Abgespielt');
    }
    this.isPlaying.update(wert => !wert);
  }
}
