import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  
  // Signal für die letzte Benachrichtigung
  lastEvent = signal<string | null>(null);

  constructor() {
    // Verbindung zum Backend herstellen (Relativ zum Host)
    this.socket = io();

    this.socket.on('connect', () => {
      console.log('WebSocket verbunden!');
    });

    // Auf Ereignisse vom Server warten
    this.socket.on('user_playing', (data: any) => {
      console.log('Jemand hört Musik:', data);
      this.lastEvent.set(`Jemand hört gerade: ${data.title} von ${data.artist}`);
      
      // Benachrichtigung nach 5 Sekunden ausblenden
      setTimeout(() => this.lastEvent.set(null), 5000);
    });
  }

  // Event an den Server senden
  sendPlayEvent(song: any) {
    this.socket.emit('play_song', song);
  }
}
