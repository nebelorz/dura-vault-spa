import { Routes } from '@angular/router';
import { HighscoreSectionComponent } from './features/highscore-section/highscore-section.component';
import { OnlineActivitySectionComponent } from './features/online-activity-section/online-activity-section.component';
import { PlayerDetailComponent } from './features/player-detail/player-detail.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { DeathsSectionComponent } from './features/deaths-section/deaths-section.component';

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
    component: OnlineActivitySectionComponent,
  },
  {
    path: 'deaths',
    component: DeathsSectionComponent,
  },
  {
    path: 'player/:name',
    component: PlayerDetailComponent,
  },
];
