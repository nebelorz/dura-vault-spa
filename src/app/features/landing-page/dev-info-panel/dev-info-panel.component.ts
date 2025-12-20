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
  standalone: true,
  imports: [TimelineModule, DatePipe, CommonModule],
  templateUrl: './dev-info-panel.component.html',
  styleUrls: ['./dev-info-panel.component.scss'],
})
export class DevInfoPanelComponent {
  entries = signal<DevInfoEntry[]>([
    {
      date: new Date('2025-12-21'),
      title: 'Working on...',
      content: [
        'Currently I am focusing on implementing some quick info in small gadgets for the landing page and a better approach to display these posts.',
        'Also I am thinking about creating a monthly "prize" system for the most active/top Dura players, more info will come soon!',
        'If you have any suggestions or feedback, feel free to reach out! neBelorz#8759',
      ],
      type: 'fix',
    },
    {
      date: new Date('2025-12-20'),
      title: 'v0.0.1b released',
      content: [
        'Welcome to Dura Vault! This is the initial release of the page, designed to track player statistics, highscores and Dura playerbase. Stay tuned for more features and updates.',
      ],
      type: 'info',
    },
  ]);

  getTypeIcon(type?: DevInfoEntry['type']) {
    return {
      feature: 'pi pi-sparkles',
      info: 'pi pi-info-circle',
      fix: 'pi pi-wrench',
      update: 'pi pi-refresh',
    }[type ?? 'info'];
  }

  getTypeClass(type?: DevInfoEntry['type']) {
    return `entry-type-${type ?? 'info'}`;
  }
}
