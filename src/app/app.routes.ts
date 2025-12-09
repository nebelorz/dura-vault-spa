import { Routes } from '@angular/router';
import { HighscoreTableComponent } from './features/highscore-table/highscore-table.component';

export const routes: Routes = [
  {
    path: 'top/:section',
    component: HighscoreTableComponent,
  },
  {
    path: '',
    redirectTo: '/top/experience',
    pathMatch: 'full',
  },
];
