import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-list.html',
  styleUrl: './song-list.css'
})
export class SongListComponent {
  // Service Injection
  music = inject(MusicService);

  constructor() {
    // Daten beim Start laden
    this.music.loadSongs();
  }
}
