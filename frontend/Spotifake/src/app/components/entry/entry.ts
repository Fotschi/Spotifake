import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="entry-container">
      <div class="entry-content">
        <h1 class="logo-text">Spotifake</h1>
        <p class="tagline">Musik für alle.</p>
        
        <div class="button-group">
          <a routerLink="/auth" class="btn btn-primary">APP STARTEN</a>
          <a href="/api-docs" class="btn btn-outline">SWAGGER DOCS</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .entry-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #000000;
      color: #ffffff;
    }

    .entry-content {
      text-align: center;
    }

    .logo-text {
      font-size: 5rem;
      font-weight: 900;
      letter-spacing: -2px;
      margin-bottom: 10px;
    }

    .tagline {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 40px;
      color: #b3b3b3;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: center;
    }

    .btn {
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 700;
      padding: 14px 40px;
      border-radius: 500px;
      letter-spacing: 1.5px;
      transition: all 0.2s ease;
      width: 250px;
      text-align: center;
    }

    .btn-primary {
      background-color: #1db954;
      color: #000000;
    }

    .btn-primary:hover {
      background-color: #1ed760;
      transform: scale(1.05);
    }

    .btn-outline {
      background-color: transparent;
      color: #ffffff;
      border: 1px solid #b3b3b3;
    }

    .btn-outline:hover {
      border-color: #ffffff;
      transform: scale(1.05);
    }

    @media (max-width: 600px) {
      .logo-text { font-size: 3.5rem; }
    }
  `]
})
export class EntryComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/songs']);
    }
  }
}
