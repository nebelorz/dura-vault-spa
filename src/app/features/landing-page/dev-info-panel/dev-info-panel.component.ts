import { Component, signal } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

type TagColor = 'error' | 'warn' | 'info' | 'rank' | 'experience';

interface DevInfoTag {
  label: string;
  color?: TagColor;
}

interface ContentBlock {
  type: 'text' | 'heading' | 'icon-text' | 'image' | 'link' | 'callout' | 'divider';
  text?: string; // text, heading, icon-text, link, callout
  icon?: string; // icon-text
  src?: string; // image
  alt?: string; // image
  caption?: string; // image
  href?: string; // link
  color?: TagColor; // callout
}

interface DevInfoEntry {
  date: Date;
  title: string;
  content: ContentBlock[];
  type?: 'versionMajor' | 'versionMinor' | 'info' | 'fix';
  tags?: DevInfoTag[];
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
      date: new Date('2026-03-10'),
      title: 'v 1.0.2b released',
      content: [
        {
          type: 'text',
          text: 'Skills are back to normal and should display correct values for all dates, excluding the affected period between February 4th and March 8th.',
        },
        { type: 'divider' },
        {
          type: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed dates on highscore summary and highscore tables displaying incorrect date values (was showing +1 from actual comparison).',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed level/rank gains on the top daily summary not displaying neutral values correctly.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Revamped the dev-posts system to add better support for visually distinct post types (e.g. fixes vs new features).',
        },
      ],
      type: 'fix',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'revamp', color: 'info' },
      ],
    },
    {
      date: new Date('2026-03-08'),
      title: 'v 1.0.1b released',
      content: [
        {
          type: 'callout',
          color: 'error',
          text: 'Due to a recent change in the highscore pages on Dura, skills data between February 4th and March 8th has been permanently removed.',
        },
        {
          type: 'text',
          text: 'Unfortunately, skill values for this period will be compromised :/',
        },
        { type: 'divider' },
        {
          type: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed data retrieving process.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-info-circle',
          text: 'Skill highscores will be populating fully back to normal in two days.',
        },
      ],
      type: 'fix',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'data loss', color: 'error' },
      ],
    },
    {
      date: new Date('2026-01-05'),
      title: 'v 1.0.0b released',
      content: [
        {
          type: 'text',
          text: 'With the current feature set, Dura Vault now provides a solid experience for a first major release.',
        },
        { type: 'divider' },
        { type: 'text', text: 'Welcome to Dura Vault.' },
        { type: 'divider' },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Player details now include simple and clear performance and gain metrics for quick interpretation.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Improved data querying in player details to support deeper insights in future updates.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Daily Top entries on the landing page are now clickable and link directly to player details.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Multiple UI and performance upgrades across the application.',
        },
      ],
      type: 'versionMajor',
    },
    {
      date: new Date('2025-12-26'),
      title: 'v 0.3b released',
      content: [
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'New side menu added to improve navigation across the app.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Top highscore tables now include toast messages to give clear possible user actions.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Small UX and layout adjustments across the page.',
        },
      ],
      type: 'versionMinor',
    },
    {
      date: new Date('2025-12-22'),
      title: 'v 0.2b released',
      content: [
        {
          type: 'text',
          text: 'Added a highscore summary for the day on the landing page (right side) for quick overviews.',
        },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Added Daily Top Gainers gadget on the landing page.',
        },
      ],
      type: 'versionMinor',
    },
    {
      date: new Date('2025-12-21'),
      title: 'Next steps',
      content: [
        {
          type: 'text',
          text: 'Currently working on small info widgets for the landing page.',
        },
        {
          type: 'text',
          text: 'Exploring better ways to display dev posts and general project updates.',
        },
        {
          type: 'text',
          text: 'Planning a monthly reward system for the most active or top Dura players.',
        },
        { type: 'divider' },
        {
          type: 'icon-text',
          icon: 'pi pi-discord',
          text: 'Feedback and suggestions are always welcome: neBelorz#8759',
        },
      ],
      type: 'info',
    },
    {
      date: new Date('2025-12-20'),
      title: 'v 0.1b released',
      content: [
        {
          type: 'text',
          text: 'This is just the foundation. More features and improvements are coming.',
        },
        { type: 'divider' },
        {
          type: 'icon-text',
          icon: 'pi pi-code',
          text: 'Initial release focused on tracking player statistics, highscores and the Dura player base.',
        },
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
