import { Component, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

interface DevInfoEntry {
  date: Date;
  title: string;
  content: string[];
  type?: 'feature' | 'info' | 'fix' | 'update';
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
      date: new Date('2025-12-26'),
      title: 'v0.0.3b released',
      content: [
        'New side menu added to improve navigation across the app.',
        'Top tables now include toast messages to give clear possible user actions.',
        'Small UX and layout adjustments across the page.',
      ],
      type: 'feature',
    },
    {
      date: new Date('2025-12-22'),
      title: 'v0.0.2b released',
      content: [
        'Added Daily Top Gainers section.',
        'Shows the top 3 experience gainers and the top player with the highest gain in the last 24 hours.',
        'This is the first step towards short-term progression tracking.',
      ],
      type: 'feature',
    },
    {
      date: new Date('2025-12-21'),
      title: 'Work in progress',
      content: [
        'Currently working on small info widgets for the landing page.',
        'Exploring better ways to display dev posts and general project updates.',
        'Planning a monthly reward system for the most active or top Dura players.',
        'Feedback and suggestions are always welcome: Discord neBelorz#8759',
      ],
      type: 'fix',
    },
    {
      date: new Date('2025-12-20'),
      title: 'v0.0.1b released',
      content: [
        'Welcome to Dura Vault.',
        'Initial release focused on tracking player statistics, highscores and the Dura player base.',
        'This is just the foundation. More features and improvements are coming!',
      ],
      type: 'feature',
    },
  ]);

  getTypeIcon(type?: DevInfoEntry['type']) {
    return {
      feature: 'pi pi-stop pi-spin',
      info: 'pi pi-info-circle',
      fix: 'pi pi-wrench',
      update: 'pi pi-refresh',
    }[type ?? 'info'];
  }

  getTypeClass(type?: DevInfoEntry['type']) {
    return `entry-type-${type ?? 'info'}`;
  }
}
