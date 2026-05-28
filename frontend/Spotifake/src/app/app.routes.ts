import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SongListComponent } from './components/song-list/song-list';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
    { path: '', redirectTo: 'songs', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'songs', component: SongListComponent },
    { path: 'admin', component: AdminComponent },
];
