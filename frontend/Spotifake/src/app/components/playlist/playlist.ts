import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class PlaylistComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  playlistService = inject(PlaylistService);
  music = inject(MusicService);

  playlist: any = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPlaylist(id);
      }
    });
  }

  async loadPlaylist(id: string) {
    this.playlist = await this.playlistService.getPlaylist(id);
  }

  async removeSong(songId: string, event: Event) {
    event.stopPropagation(); // Verhindert, dass der Song abgespielt wird beim Klicken
    if (!this.playlist) return;
    
    const success = await this.playlistService.removeSong(this.playlist._id, songId);
    if (success) {
      this.loadPlaylist(this.playlist._id);
    }
  }

  async deletePlaylist() {
    if (!this.playlist) return;
    if (confirm(`Playlist "${this.playlist.name}" wirklich löschen?`)) {
       try {
         const response = await fetch(`/api/v1/playlists/${this.playlist._id}`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
         });
         if(response.ok) {
           this.playlistService.loadPlaylists();
           this.router.navigate(['/songs']); // Navigate to song list
         }
       } catch (e) {
         console.error(e);
       }
    }
  }
}
