import { Routes } from '@angular/router';
import { EntryComponent } from './components/entry/entry';
import { LoginComponent } from './components/login/login';
import { SongListComponent } from './components/song-list/song-list';
import { AdminComponent } from './components/admin/admin';
import { PlaylistComponent } from './components/playlist/playlist';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

//  Guard um zu prüfen ob jemand eingeloggt ist
const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.parseUrl('/auth');
};

export const routes: Routes = [
    { path: '', component: EntryComponent },
    { path: 'auth', component: LoginComponent },
    { path: 'songs', component: SongListComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    { path: 'playlist/:id', component: PlaylistComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
