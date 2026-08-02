import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { BadgeComponent, type BadgeVariant } from '@shared/components';

type TagColor = 'error' | 'warn' | 'info' | 'versionMajor' | 'versionMinor';

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
  imports: [DatePipe, NgClass, BadgeComponent],
  templateUrl: './dev-info-panel.component.html',
  styleUrl: './dev-info-panel.component.scss',
  encapsulation: ViewEncapsulation.None, // Allow own styles on markdown content
})
export class DevInfoPanelComponent implements OnInit {
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

  private readonly variantMap: Record<string, BadgeVariant> = {
    error: 'danger',
    warn: 'warn',
    info: 'info',
    versionMajor: 'xp',
    versionMinor: 'secondary-light',
  };

  variantFor(color?: TagColor): BadgeVariant {
    return this.variantMap[color ?? ''] ?? 'level';
  }

  // Ordered list of post dates (newest first)
  readonly postDates = [
    '2026-08-02',
    '2026-07-27',
    '2026-06-05',
    '2026-04-24',
    '2026-04-13',
    '2026-03-30',
    '2026-03-29',
    '2026-03-16',
    '2026-03-12',
    '2026-03-10',
    '2026-03-08',
    '2026-01-05',
    '2025-12-26',
    '2025-12-22',
    '2025-12-20',
  ];

  readonly entries = signal<DevInfoEntry[]>([]);

  ngOnInit(): void {
    this.loadEntries();
  }

  private async loadEntries(): Promise<void> {
    const results = await Promise.allSettled(
      this.postDates.map(async (date) => {
        const res = await fetch(`/dev-posts/${date}.md`);
        if (!res.ok) throw new Error(`Failed to load post ${date}`);
        const md = await res.text();
        return this.parsePost(md, date);
      }),
    );

    const entries: DevInfoEntry[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        entries.push(result.value);
      }
    }
    this.entries.set(entries);
  }

  private parsePost(md: string, date: string): DevInfoEntry | null {
    const frontmatterMatch = new RegExp(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/).exec(md);
    if (!frontmatterMatch) return null;

    const yaml = frontmatterMatch[1];
    const body = frontmatterMatch[2].trim();

    const data: { title?: string; entryType?: DevInfoEntry['entryType']; tags?: DevInfoTag[] } = {};

    for (const line of yaml.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('title:')) {
        data.title = trimmed
          .slice(6)
          .trim()
          .replace(/^['"]|['"]$/g, '');
      } else if (trimmed.startsWith('entryType:')) {
        data.entryType = trimmed.slice(10).trim() as DevInfoEntry['entryType'];
      } else if (trimmed.startsWith('tags:')) {
        const tagsStr = trimmed.slice(5).trim();
        if (tagsStr) {
          data.tags = tagsStr
            .split(',')
            .map((t) => {
              const [label, color] = t
                .trim()
                .split('|')
                .map((s) => s.trim());
              return color ? { label, color: color as TagColor } : { label };
            })
            .filter((t): t is DevInfoTag => !!t.label);
        }
      }
    }

    if (!data.title) return null;

    return {
      date: new Date(date),
      title: data.title,
      entryType: data.entryType,
      tags: data.tags,
      body,
    };
  }
}
