import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

type TagColor = 'error' | 'warn' | 'info' | 'rank' | 'experience';

interface DevInfoTag {
  label: string;
  color?: TagColor;
}

interface ContentBlock {
  contentType: 'text' | 'heading' | 'icon-text' | 'image' | 'link' | 'callout' | 'divider';
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
  entryType?: 'versionMajor' | 'versionMinor' | 'info' | 'fix';
  tags?: DevInfoTag[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dev-info-panel',
  imports: [TimelineModule, DatePipe],
  templateUrl: './dev-info-panel.component.html',
  styleUrls: ['./dev-info-panel.component.scss'],
})
export class DevInfoPanelComponent {
  entries = signal<DevInfoEntry[]>([
    {
      date: new Date('2026-04-09'),
      title: 'v 2.2.1 released',
      content: [
        {
          contentType: 'heading',
          text: 'UI/UX',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'The sections on player details now are ordered as displayed in-game.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Removed unnecessary available data info on highscores tables.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Moved the actual period selected date range to display underneath the period selector for better clarity.',
        },
        { contentType: 'divider' },
        {
          contentType: 'heading',
          text: 'Fixes',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed an issue not displaying fist section on daily summary section.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed an issue not displaying last gain correctly when mouse-over on player details section.',
        },
        { contentType: 'divider' },
        {
          contentType: 'heading',
          text: 'Extras/Misc.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Added a new component to provide a way to help Dura Vault grow by supporting it through Buy Me a Coffee.',
        },
        { contentType: 'divider' },
        {
          contentType: 'text',
          text: 'This way Dura Vault will be able to keep growing and improving with more features, bigger datasets and better performance in the future. Check it out if you like the project and want to support it :)',
        },
      ],
      entryType: 'versionMinor',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'UI/UX', color: 'info' },
      ],
    },
    {
      date: new Date('2026-03-30'),
      title: 'v 2.2.0 released',
      content: [
        {
          contentType: 'heading',
          text: 'UI/UX',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Updated landing page banner.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Updated favicon.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Revamped player detail section. Added empty messages and improved layout for better clarity.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Revamped daily summary gadget to match the clarity and consistency alike other sections.',
        },
        { contentType: 'divider' },
        {
          contentType: 'heading',
          text: 'Improvements & Fixes',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Added a new menu on player details to search character directly on Dura.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Set default period for a player detail view to "Active Period".',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed an issue not displaying the player vocation on player details section.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Minor improvements on player detail section for better consistency and clarity.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Minor backend improvements for better consistency and clarity.',
        },
      ],
      entryType: 'versionMinor',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'UI/UX', color: 'info' },
      ],
    },
    {
      date: new Date('2026-03-29'),
      title: 'v 2.1.0 released',
      content: [
        {
          contentType: 'heading',
          text: 'UI/UX',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Unified color system across the entire app: XP values, skill gains, rank changes, and warnings now use a consistent color language everywhere.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Consistent typography across all stat panels - player detail, online stats, and ranking overlays now share the same sizes and weights.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Overlays are now visually consistent across all sections: highscores, online rankings, and player pages.',
        },
        { contentType: 'divider' },
        {
          contentType: 'heading',
          text: 'Online Stats',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Revamped layout for online stats, providing a clearer and more consistent presentation.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'New Player Stats section on player details, with a clear and consistent layout for all stats that Dura Vault has tracked about the player.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'New "Consistency" metric - more accurately reflects what it measures: days with data out of the player\'s tracked span.',
        },
      ],
      entryType: 'versionMinor',
      tags: [{ label: 'UI/UX', color: 'info' }, { label: 'new feature' }],
    },
    {
      date: new Date('2026-03-16'),
      title: 'v 2.0.0 released',
      content: [
        {
          contentType: 'heading',
          text: 'Online Activity',
        },
        {
          contentType: 'text',
          text: 'New Online Activity section - Explore player and world activity, with different graphs displaying vocation, level, and time period.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'New interactive charts show online time distribution by vocation, level, and period. Check most active vocations, most active times by day of week or hour etc.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Online Activity also displays the top most active players, with breakdowns for daily average, total hours, and days active.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Player details now include a dedicated Online Stats section: view activity window, average online, days active and last seen timestamp.',
        },
        { contentType: 'divider' },
        {
          contentType: 'heading',
          text: 'Tops Highscores',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Brand new podium component highlights the top 3 in all rankings, with improved visuals.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Highscore tables revamped: all relevant values at a glance, with overlays for the podium details.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Integrated filters and real-time search in all tables.',
        },
        { contentType: 'divider' },
        {
          contentType: 'heading',
          text: 'Design Overhaul',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Unified color and style system for a more consistent and attractive visual experience.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Centralized constants and technical improvements to remove hardcoded values.',
        },
        { contentType: 'divider' },
        {
          contentType: 'text',
          text: 'This release lays the foundation for advanced analytics and community tracking features in the future.',
        },
      ],
      entryType: 'versionMajor',
      tags: [{ label: 'major version', color: 'experience' }, { label: 'new feature' }],
    },
    {
      date: new Date('2026-03-12'),
      title: 'v 1.1.0b released',
      content: [
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed an issue that was causing experience loss values to display incorrectly for certain players.',
        },
        {
          contentType: 'text',
          text: 'Experience Loss values should now display correctly for all players, including those with high loss values.',
        },
        { contentType: 'divider' },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Added Experience Loss section — shows the top daily losers with experience points lost, level lost and rank change.',
        },
        {
          contentType: 'text',
          text: 'The tops and daily top summary sections now include Experience Loss, displaying the character with highest experience loss of the day.',
        },
        { contentType: 'divider' },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Updated and improved the data processing logic to start collecting online times.',
        },
        {
          contentType: 'text',
          text: 'Working on a new feature to display online times for players. This will be released soon.',
        },
      ],
      entryType: 'versionMinor',
      tags: [{ label: 'fix', color: 'warn' }, { label: 'new feature' }],
    },
    {
      date: new Date('2026-03-10'),
      title: 'v 1.0.2b released',
      content: [
        {
          contentType: 'text',
          text: 'Skills are back to normal and should display correct values for all dates, excluding the affected period between February 4th and March 8th.',
        },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed dates on highscore summary and highscore tables displaying incorrect date values (was showing +1 from actual comparison).',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed level/rank gains on the top daily summary not displaying neutral values correctly.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Revamped the dev-posts system to add better support for visually distinct post types (e.g. fixes vs new features).',
        },
      ],
      entryType: 'fix',
      tags: [{ label: 'fix', color: 'warn' }],
    },
    {
      date: new Date('2026-03-08'),
      title: 'v 1.0.1b released',
      content: [
        {
          contentType: 'callout',
          color: 'error',
          text: 'Due to a recent change in the highscore pages on Dura, skills data between February 4th and March 8th has been permanently removed.',
        },
        {
          contentType: 'text',
          text: 'Unfortunately, skill values for this period will be compromised :/',
        },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Fixed data retrieving process.',
        },
        {
          contentType: 'text',
          text: 'Skill highscores will be populating fully back to normal in two days.',
        },
      ],
      entryType: 'fix',
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
          contentType: 'text',
          text: 'With the current feature set, Dura Vault now provides a solid experience for a first major release.',
        },
        { contentType: 'divider' },
        { contentType: 'text', text: 'Welcome to Dura Vault.' },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Player details now include simple and clear performance and gain metrics for quick interpretation.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Improved data querying in player details to support deeper insights in future updates.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Daily Top entries on the landing page are now clickable and link directly to player details.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Multiple UI and performance upgrades across the application.',
        },
      ],
      entryType: 'versionMajor',
    },
    {
      date: new Date('2025-12-26'),
      title: 'v 0.3b released',
      content: [
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'New side menu added to improve navigation across the app.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Top highscore tables now include toast messages to give clear possible user actions.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-wrench',
          text: 'Small UX and layout adjustments across the page.',
        },
      ],
      entryType: 'versionMinor',
    },
    {
      date: new Date('2025-12-22'),
      title: 'v 0.2b released',
      content: [
        {
          contentType: 'text',
          text: 'Added a highscore summary for the day on the landing page (right side) for quick overviews.',
        },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Added Daily Top Gainers gadget on the landing page.',
        },
      ],
      entryType: 'versionMinor',
    },
    {
      date: new Date('2025-12-21'),
      title: 'Next steps',
      content: [
        {
          contentType: 'text',
          text: 'Currently working on small info widgets for the landing page.',
        },
        {
          contentType: 'text',
          text: 'Exploring better ways to display dev posts and general project updates.',
        },
        {
          contentType: 'text',
          text: 'Planning a monthly reward system for the most active or top Dura players.',
        },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-discord',
          text: 'Feedback and suggestions are always welcome: neBelorz#8759',
        },
      ],
      entryType: 'info',
    },
    {
      date: new Date('2025-12-20'),
      title: 'v 0.1b released',
      content: [
        {
          contentType: 'text',
          text: 'This is just the foundation. More features and improvements are coming.',
        },
        { contentType: 'divider' },
        {
          contentType: 'icon-text',
          icon: 'pi pi-code',
          text: 'Initial release focused on tracking player statistics, highscores and the Dura player base.',
        },
      ],
      entryType: 'versionMinor',
    },
  ]);

  getTypeIcon(type?: DevInfoEntry['entryType']) {
    return {
      versionMajor: 'pi pi-stop pi-spin',
      versionMinor: 'pi pi-code',
      info: 'pi pi-info-circle',
      fix: 'pi pi-wrench',
    }[type ?? 'info'];
  }

  getTypeClass(type?: DevInfoEntry['entryType']) {
    return `entry-type-${type ?? 'info'}`;
  }
}
