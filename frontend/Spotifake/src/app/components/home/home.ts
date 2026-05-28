import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Wenn nicht eingeloggt -->
      <div *ngIf="!auth.isLoggedIn()" class="not-logged-in">
        <div class="logo">🎧</div>
        <h1>Willkommen bei Spotifake</h1>
        <p>Dein persönlicher Musik-Streaming-Service</p>
        
        <button routerLink="/login" class="btn btn-primary">
          Anmelden
        </button>
      </div>

      <!-- Wenn eingeloggt -->
      <div *ngIf="auth.isLoggedIn()" class="logged-in">
        <div class="logo">🎧</div>
        <h1>Hallo, {{ auth.currentUser()?.username }}!</h1>
        <p>Was möchtest du machen?</p>
        
        <div class="options-grid">
          <button routerLink="/songs" class="option-card">
            <div class="icon">🎵</div>
            <h3>Musik Bibliothek</h3>
            <p>Höre deine Lieblingslieder</p>
          </button>
          
          <button routerLink="/admin" class="option-card">
            <div class="icon">⚙️</div>
            <h3>Verwaltung</h3>
            <p>Lieder hochladen und bearbeiten</p>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .not-logged-in,
    .logged-in {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 100%;
    }

    .logo {
      font-size: 80px;
      margin-bottom: 20px;
      display: block;
    }

    h1 {
      color: #333;
      font-size: 2.5em;
      margin: 20px 0;
      font-weight: bold;
    }

    p {
      color: #666;
      font-size: 1.1em;
      margin-bottom: 40px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 50px;
      font-size: 1.1em;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 40px;
    }

    .option-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border: 2px solid transparent;
      padding: 40px 20px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .option-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }

    .option-card:nth-child(1) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .option-card:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .icon {
      font-size: 60px;
      margin-bottom: 15px;
      display: block;
    }

    .option-card h3 {
      color: white;
      font-size: 1.5em;
      margin: 10px 0;
      font-weight: bold;
    }

    .option-card p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9em;
      margin: 0;
    }

    @media (max-width: 600px) {
      .not-logged-in,
      .logged-in {
        padding: 40px 20px;
      }

      h1 {
        font-size: 2em;
      }

      .options-grid {
        grid-template-columns: 1fr;
      }

      .option-card {
        min-height: 150px;
      }

      .icon {
        font-size: 50px;
      }

      .option-card h3 {
        font-size: 1.2em;
      }
    }
  `]
})
export class HomeComponent {
  auth = inject(AuthService);
}
