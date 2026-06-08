import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { PlaylistService } from '../../services/playlist.service';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song-list.html',
  styleUrl: './song-list.css'
})
export class SongListComponent {
  music = inject(MusicService);
  playlistService = inject(PlaylistService);

  showPlaylistMenuFor: string | null = null;

  constructor() {
    this.music.loadSongs();
  }

  togglePlaylistMenu(songId: string, event: Event) {
    event.stopPropagation();
    if (this.showPlaylistMenuFor === songId) {
      this.showPlaylistMenuFor = null;
    } else {
      this.showPlaylistMenuFor = songId;
    }
  }

  async addToPlaylist(playlistId: string, songId: string, event: Event) {
    event.stopPropagation();
    const success = await this.playlistService.addSong(playlistId, songId);
    if (success) {
      alert('Zum Playlist hinzugefügt!');
    }
    this.showPlaylistMenuFor = null;
  }
}
