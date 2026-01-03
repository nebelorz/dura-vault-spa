import { Routes } from '@angular/router';
import { HighscoreTableComponent } from './features/highscore-table/highscore-table.component';
import { PlayerDetailComponent } from './features/player-detail/player-detail.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'top/:section',
    component: HighscoreTableComponent,
  },
  {
    path: 'player/:name',
    component: PlayerDetailComponent,
  },
];
