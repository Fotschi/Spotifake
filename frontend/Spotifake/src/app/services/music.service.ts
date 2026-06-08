import { Injectable, signal } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  songs = signal<any[]>([]);
  currentSong = signal<any>(null);
  isPlaying = signal(false);

  // Fortschritt und Lautstärke
  currentTime = signal(0);
  duration = signal(0);
  volume = signal(1); // 0 bis 1

  private apiUrl = '/api/v1/songs';
  
  private audio = new Audio();

  constructor(private socketService: SocketService) {
    // Zeit aktualisieren
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });

    // Gesamtdauer laden
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration);
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio Fehler:', e);
      console.error('Audio Error Code:', this.audio.error?.code);
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('canplay', () => {
      console.log('Audio kann jetzt abgespielt werden');
    });

    this.audio.addEventListener('loadstart', () => {
      console.log('Audio wird geladen...');
    });
  }

  async loadSongs() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      this.songs.set(data);
      console.log('Songs geladen:', data);
    } catch (error) {
      console.error('Fehler beim Laden der Songs', error);
    }
  }

  play(song: any) {
    this.currentSong.set(song);
    this.socketService.sendPlayEvent(song);

    const streamUrl = `${this.apiUrl}/${song._id}/stream`;
    this.audio.src = streamUrl;
    this.audio.crossOrigin = 'anonymous'; 
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying.set(true);
        })
        .catch((error) => {
          console.error('Fehler beim Abspielen:', error);
          this.isPlaying.set(false);
        });
    }
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Fehler beim Fortsetzen:', error);
        });
      }
    }
    this.isPlaying.update(wert => !wert);
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    this.audio.volume = value;
    this.volume.set(value);
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
}
