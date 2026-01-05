import { Component, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

interface DevInfoEntry {
  date: Date;
  title: string;
  content: string[];
  type?: 'versionMajor' | 'versionMinor' | 'info' | 'fix';
}

@Component({
  selector: 'app-dev-info-panel',
  imports: [TimelineModule, DatePipe, CommonModule],
  templateUrl: './dev-info-panel.component.html',
  styleUrls: ['./dev-info-panel.component.scss'],
})
export class DevInfoPanelComponent {
  entries = signal<DevInfoEntry[]>([
    {
      date: new Date('2026-01-05'),
      title: 'v 1.0.0b released',
      content: [
        '+ Player details now include simple and clear performance and gain metrics for quick interpretation.',
        '+ Improved data querying in player details to support deeper insights in future updates.',
        '+ Daily Top entries on the landing page are now clickable and link directly to player details.',
        '+ Multiple UI and performance upgrades across the application.',
        '',
        'With the current feature set, Dura Vault now provides a solid experience for a first major release.',
        'Welcome to Dura Vault.',
      ],
      type: 'versionMajor',
    },
    {
      date: new Date('2025-12-26'),
      title: 'v 0.3b released',
      content: [
        '+ New side menu added to improve navigation across the app.',
        '+ Top highscore tables now include toast messages to give clear possible user actions.',
        '+ Small UX and layout adjustments across the page.',
      ],
      type: 'versionMinor',
    },
    {
      date: new Date('2025-12-22'),
      title: 'v 0.2b released',
      content: [
        '+ Added Daily Top Gainers gadget on the landing page.',
        '+ Shows the top 3 experience gainers and the top skill player with the highest gain in the last 24 hours.',
        '',
        'This is the first step towards short-term progression tracking.',
      ],
      type: 'versionMinor',
    },
    {
      date: new Date('2025-12-21'),
      title: 'Next steps',
      content: [
        'Currently working on small info widgets for the landing page.',
        'Exploring better ways to display dev posts and general project updates.',
        'Planning a monthly reward system for the most active or top Dura players.',
        'Feedback and suggestions are always welcome: Discord neBelorz#8759',
      ],
      type: 'info',
    },
    {
      date: new Date('2025-12-20'),
      title: 'v 0.1b released',
      content: [
        'Initial release focused on tracking player statistics, highscores and the Dura player base.',
        'This is just the foundation. More features and improvements are coming!',
      ],
      type: 'versionMinor',
    },
  ]);

  getTypeIcon(type?: DevInfoEntry['type']) {
    return {
      versionMajor: 'pi pi-stop pi-spin',
      versionMinor: 'pi pi-code',
      info: 'pi pi-info-circle',
      fix: 'pi pi-wrench',
    }[type ?? 'info'];
  }

  getTypeClass(type?: DevInfoEntry['type']) {
    return `entry-type-${type ?? 'info'}`;
  }
}
