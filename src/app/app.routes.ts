import { Routes } from '@angular/router';
import { HighscoreTableComponent } from './features/highscore-table/highscore-table.component';
import { PlayerDetailComponent } from './features/player-detail/player-detail.component';

export const routes: Routes = [
  {
    path: 'top/:section',
    component: HighscoreTableComponent,
  },
  {
    path: 'player/:section',
    component: PlayerDetailComponent,
  },
  {
    path: '',
    redirectTo: '/top/experience',
    pathMatch: 'full',
  },
];
