import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlayerComponent } from './components/player/player';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';
import { PlaylistService } from './services/playlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, PlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  auth = inject(AuthService);
  socketService = inject(SocketService);
  router = inject(Router);
  playlistService = inject(PlaylistService);

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.playlistService.loadPlaylists();
    }
  }

  createNewPlaylist() {
    const name = window.prompt('Wie soll die Playlist heißen?');
    if (name && name.trim()) {
      this.playlistService.createPlaylist(name.trim()).then(newPlaylist => {
        if (newPlaylist) {
          this.router.navigate(['/playlist', newPlaylist._id]);
        }
      });
    }
  }
}
