import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayerComponent } from './components/player/player';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, PlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Wir brauchen den AuthService auch hier, um zu wissen was wir anzeigen müssen
  auth = inject(AuthService);
  socketService = inject(SocketService);
}
