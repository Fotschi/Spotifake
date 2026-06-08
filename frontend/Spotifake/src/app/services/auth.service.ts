import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // User wird als Signal gespeichert
  currentUser = signal<any>(null);

  // computed Signal schaut von selba, ob man eingeloggt ist
  isLoggedIn = computed(() => !!this.currentUser());

  // Die Adresse von Backend (Relativ für Docker/Proxy)
  private apiUrl = '/api/v1/auth';

  private router = inject(Router);

  constructor() {
    this.checkSession();
  }

  private checkSession() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        this.currentUser.set(JSON.parse(user));
      } catch (e) {
        this.logout();
      }
    }
  }

  // Einloggen-Funktion
  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Token und User speichern
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      this.currentUser.set(data.user);
      
      return true;
    } catch (error) {
      console.error('Login Fehler:', error);
      return false;
    }
  }

  // Registrieren-Funktion
  async register(username: string, password: string) {
    try {
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      return response.ok;
    } catch (error) {
      console.error('Register Fehler:', error);
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
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }
}
