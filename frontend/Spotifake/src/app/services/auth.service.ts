import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Wir merken uns den User in einem Signal
  // Das ist wie eine Variable, die der Webseite sagt: "Hey, ich habe mich geändert!"
  currentUser = signal<any>(null);

  // Die Adresse von unserem Backend
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  // Einloggen-Funktion
  async login(username: string, password: string) {
    try {
      // Wir schicken Name und Passwort an den Server
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        alert('Falsche Zugangsdaten!');
        return;
      }

      const data = await response.json();
      
      // Wir speichern den Token im Browser, damit wir eingeloggt bleiben
      localStorage.setItem('token', data.token);
      
      // Wir setzen das Signal auf den User
      this.currentUser.set(data.user);
      
      return true;
    } catch (error) {
      console.error('Login Fehler:', error);
      return false;
    }
  }

  // Ausloggen
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('token');
  }
}
