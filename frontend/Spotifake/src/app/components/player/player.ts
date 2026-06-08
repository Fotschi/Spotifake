import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class PlayerComponent {
  music = inject(MusicService);

  onProgressClick(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    const clickX = event.offsetX;
    const totalWidth = container.offsetWidth;
    const percentage = clickX / totalWidth;
    
    const newTime = percentage * this.music.duration();
    this.music.seek(newTime);
  }

  onVolumeClick(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    const clickX = event.offsetX;
    const totalWidth = container.offsetWidth;
    const volume = clickX / totalWidth;
    
    this.music.setVolume(volume);
  }

  getProgressWidth(): string {
    if (this.music.duration() === 0) return '0%';
    const percent = (this.music.currentTime() / this.music.duration()) * 100;
    return `${percent}%`;
  }

  getVolumeWidth(): string {
    return `${this.music.volume() * 100}%`;
  }
}
