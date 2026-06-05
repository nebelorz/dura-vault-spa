import { Routes } from '@angular/router';
import { HighscoreSectionComponent } from './features/highscore-section/highscore-section.component';
import { OnlineTableComponent } from './features/online-table/online-table.component';
import { PlayerDetailComponent } from './features/player-detail/player-detail.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'top/:section',
    component: HighscoreSectionComponent,
  },
  {
    path: 'online',
    component: OnlineTableComponent,
  },
  {
    path: 'player/:name',
    component: PlayerDetailComponent,
  },
];
