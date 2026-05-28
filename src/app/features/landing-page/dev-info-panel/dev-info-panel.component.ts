import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

type TagColor = 'error' | 'warn' | 'info' | 'rank' | 'experience';

interface DevInfoTag {
  label: string;
  color?: TagColor;
}

interface DevInfoEntry {
  date: Date;
  title: string;
  body: string;
  entryType?: 'versionMajor' | 'versionMinor' | 'info' | 'fix';
  tags?: DevInfoTag[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dev-info-panel',
  imports: [DatePipe, NgClass],
  templateUrl: './dev-info-panel.component.html',
  styleUrl: './dev-info-panel.component.scss',
  encapsulation: ViewEncapsulation.None, // Allow own styles on markdown content
})
export class DevInfoPanelComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly expandedIndices = signal<Set<number>>(new Set([0, 1, 2]));

  toggleEntry(i: number): void {
    const next = new Set(this.expandedIndices());
    if (next.has(i)) {
      next.delete(i);
    } else {
      next.add(i);
    }
    this.expandedIndices.set(next);
  }

  isExpanded(i: number): boolean {
    return this.expandedIndices().has(i);
  }

  getHtml(body: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(marked.parse(body.trim()) as string);
  }

  getTypeIcon(type?: DevInfoEntry['entryType']): string {
    const map: Record<string, string> = {
      versionMajor: 'pi pi-stop pi-spin',
      versionMinor: 'pi pi-code',
      info: 'pi pi-info-circle',
      fix: 'pi pi-wrench',
    };
    return map[type ?? 'info'] ?? 'pi pi-info-circle';
  }

  getTypeClass(type?: DevInfoEntry['entryType']): string {
    return `entry-type-${type ?? 'info'}`;
  }

  entries = signal<DevInfoEntry[]>([
    {
      date: new Date('2026-05-28'),
      title: '2.4.0 released',
      entryType: 'versionMinor',
      tags: [
        { label: 'new feature' },
        { label: 'UI/UX', color: 'info' },
        { label: 'fix', color: 'warn' },
      ],
      body: `
## Highscores Section
Added a right-hand panel to the highscores section displaying top player per vocation.  
Added a right-hand panel to the highscores section displaying gains/losses by vocation.  

## UI/UX Improvements
Updated color system implementation with improved management.  
Updated styling on highscores section.  
Unified loading spinners across the app for a consistent experience.  
Added animations to stat panels and charts for a smoother visual experience.

## Fixes & Optimizations
Fixed minor alignment issues in player stats display.  
Enhanced theme switching for better dark mode UX.

## Coming soon...
🟡 New charts for the **highscores section**.  
⚫ **Misc. section** - extra data and insights about the player base and the server.  
💀 **Deaths section** - already collecting data, soon to be displayed.

Also I am setting up the foundation for tracking and analytics on the new server from day one.
 `,
    },
    {
      date: new Date('2026-04-24'),
      title: '2.3.0 released',
      entryType: 'versionMajor',
      tags: [
        { label: 'minor version', color: 'experience' },
        { label: 'new feature' },
        { label: 'UI/UX', color: 'info' },
      ],
      body: `
## Player Details - Two New Tabs

Player Details has been restructured into two separate tabs: **Character** and **Performance**, providing a clear separation between live current data and historical vault records.

## Character Tab

Fetches data directly from the official Dura page on every visit.  
**Character** = player's current information: name, former names, level, residence, guild, houses etc.  
**Account** = creation date, position, ban status and the full list of characters, with real-time online status.  
**Deaths** = each row shows the date, level at death, and killers. Unjustified kills are highlighted in red; regular kills from players in yellow.  
> Basically everything you can find on the official character page plus additional insights and historical data.

## Performance Tab

The Performance tab preserves the classic Dura Vault experience: a gains summary (total and average level, XP, and rank) and the historical chart across the selected period.  
Nothing changed here apart from UI/UX. It just lives in its own dedicated tab now.

## NEW! Achievements Panel

A new **Achievements panel** has been added to the right side of the Player Details page. It shows every level, magic level, skill, and fishing milestone the player has reached, with the first date it was recorded in the vault.  
Each section displays a badge with the highest milestone reached, plus the full list of unlocked milestones with their dates.

> Dura Vault started tracking in early December 2025, so milestone dates reflect the earliest recorded scrape and they may predate the actual achievement. Player renames also break history continuity.

## UI/UX

- Online Activity section now lives in the left side panel.
- Last Login in the Online Activity section is now sourced from live data, always reflecting the player's actual last login.
- The player detail chart now shows rank in a more subtle way, keeping it as context without visually competing with the main metric.
- Updated font styles for a more consistent and polished look across all player detail sections.
- Updated the dev-posts/changelog entry layout.
      `,
    },
    {
      date: new Date('2026-04-13'),
      title: '2.2.1 released',
      entryType: 'versionMinor',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'UI/UX', color: 'info' },
        { label: 'new feature' },
      ],
      body: `
## Features

- Added **current & best historic streak** on player details for each section.

## UI/UX

- Sections on player details are now ordered as displayed in-game.
- Removed unnecessary available data info on highscore tables.
- Moved the selected period date range to display underneath the period selector for better clarity.
- Added info on avg. time window on player detail.
- Added rank on the player detail chart.

## Fixes

- Fixed an issue not displaying the fist section on the daily summary.
- Fixed an issue not displaying last gain correctly on mouse-over in player details.

## Extras

- Added a component to support Dura Vault through Buy Me a Coffee.

This way Dura Vault will keep growing with more features, bigger datasets, and better performance. Check it out if you like the project :)
      `,
    },
    {
      date: new Date('2026-03-30'),
      title: '2.2.0 released',
      entryType: 'versionMinor',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'UI/UX', color: 'info' },
      ],
      body: `
## UI/UX

- Updated landing page banner and favicon.
- Revamped player detail section: added empty messages and improved layout for better clarity.
- Revamped daily summary gadget to match consistency with other sections.

## Improvements & Fixes

- Added a new menu on player details to search the character directly on Dura.
- Set default period for a player detail view to **Active Period**.
- Fixed an issue not displaying the player vocation on player details.
- Minor improvements to player detail section and backend for better consistency and clarity.
      `,
    },
    {
      date: new Date('2026-03-29'),
      title: '2.1.0 released',
      entryType: 'versionMinor',
      tags: [{ label: 'UI/UX', color: 'info' }, { label: 'new feature' }],
      body: `
## UI/UX

- Unified color system across the entire app: XP values, skill gains, rank changes, and warnings now use a consistent color language everywhere.
- Consistent typography across all stat panels player detail, online stats, and ranking overlays now share the same sizes and weights.
- Overlays are now visually consistent across all sections: highscores, online rankings, and player pages.

## Online Stats & Player Details

- Revamped layout for online stats, providing a clearer and more consistent presentation.
- New **Player Stats section** on player details, with a clear layout for all stats Dura Vault has tracked about the player.
- New **Consistency** metric more accurately reflects what it measures: days with data out of the player's tracked span.
      `,
    },
    {
      date: new Date('2026-03-16'),
      title: '2.0.0 released',
      entryType: 'versionMajor',
      tags: [{ label: 'major version', color: 'experience' }, { label: 'new feature' }],
      body: `
## Online Activity

New Online Activity section explore player and world activity with interactive charts displaying vocation, level, and time period breakdowns.

- Interactive charts show online time distribution by vocation, level, and period: most active vocations, most active times by day of week or hour, and more.
- Top most active players displayed with breakdowns for daily average, total hours, and days active.
- Player details now include a dedicated **Online Stats** section: activity window, average online time, days active, and last seen.

## Top Highscores

- Brand new **podium component** highlights the top 3 in all rankings, with improved visuals.
- Highscore tables revamped: all relevant values at a glance, with overlays for podium details.
- Integrated filters and real-time search in all tables.

## Design Overhaul

- Unified color and style system for a more consistent and attractive visual experience.
- Centralized constants and technical improvements to remove hardcoded values.

This release lays the foundation for advanced analytics and community tracking features in the future.
      `,
    },
    {
      date: new Date('2026-03-12'),
      title: '1.1.0b released',
      entryType: 'versionMinor',
      tags: [{ label: 'fix', color: 'warn' }, { label: 'new feature' }],
      body: `
## Fixes

- Fixed experience loss values displaying incorrectly for certain players.

## New Features

- Added **Experience Loss section** shows the top daily losers with XP lost, level lost, and rank change. Now included in Highscores and the daily summary.
- Updated data processing logic to begin collecting online times.
- *Online activity feature coming soon.*
      `,
    },
    {
      date: new Date('2026-03-10'),
      title: '1.0.2b released',
      entryType: 'fix',
      tags: [{ label: 'fix', color: 'warn' }],
      body: `
Skills are back to normal and should display correct values for all dates, excluding the affected period between **February 4th and March 8th**.

## Fixes

- Fixed dates on highscore summary and tables displaying incorrect values (was showing +1 from the actual comparison date).
- Fixed level/rank gains on the daily summary not displaying neutral values correctly.
      `,
    },
    {
      date: new Date('2026-03-08'),
      title: '1.0.1b released',
      entryType: 'fix',
      tags: [
        { label: 'fix', color: 'warn' },
        { label: 'data loss', color: 'error' },
      ],
      body: `
> **Data loss notice:** Due to a recent change on the Dura highscore pages, skills data between **February 4th and March 8th** has been permanently removed. Skill values for this period will be compromised.

## Fixes

- Fixed data retrieval process.

Skill highscores will be fully back to normal within two days.
      `,
    },
    {
      date: new Date('2026-01-05'),
      title: '1.0.0b released',
      entryType: 'versionMajor',
      body: `
With the current feature set, Dura Vault now provides a solid experience for a first major release.

**Welcome to Dura Vault.**

- Player details now include simple and clear performance and gain metrics for quick interpretation.
- Improved data querying in player details to support deeper insights in future updates.
- Daily Top entries on the landing page are now clickable and link directly to player details.
- Multiple UI and performance upgrades across the application.
      `,
    },
    {
      date: new Date('2025-12-26'),
      title: '0.3b released',
      entryType: 'versionMinor',
      body: `
- New side menu added to improve navigation across the app.
- Top highscore tables now include toast messages to give clear possible user actions.
- Small UX and layout adjustments across the page.
      `,
    },
    {
      date: new Date('2025-12-22'),
      title: '0.2b released',
      entryType: 'versionMinor',
      body: `
- Added a highscore summary for the day on the landing page for quick overviews.
- Added **Daily Top Gainers** gadget on the landing page.
      `,
    },
    {
      date: new Date('2025-12-20'),
      title: '0.1b released',
      entryType: 'versionMinor',
      body: `
This is just the foundation. More features and improvements are coming.

- Initial release focused on tracking player statistics, highscores, and the Dura player base.
      `,
    },
  ]);
}
