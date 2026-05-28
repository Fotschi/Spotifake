import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Wir merken uns den User in einem Signal
  currentUser = signal<any>(null);

  // Ein "computed" Signal berechnet automatisch, ob wir eingeloggt sind
  isLoggedIn = computed(() => !!this.currentUser());

  // Die Adresse von unserem Backend
  private apiUrl = 'http://localhost:3000/api/v1/auth';

  // Einloggen-Funktion
  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        alert('Falsche Zugangsdaten!');
        return false;
      }

      const data = await response.json();
      
      // Token und User speichern
      localStorage.setItem('token', data.token);
      this.currentUser.set(data.user);
      
      return true;
    } catch (error) {
      console.error('Login Fehler:', error);
      return false;
    }
  }

  // Token aus dem LocalStorage holen
  getToken() {
    return localStorage.getItem('token');
  }

  // Ausloggen
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('token');
  }
}
