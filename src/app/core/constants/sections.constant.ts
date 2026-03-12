import { MenuItem } from 'primeng/api';
import { CustomSection, HighscoreSection, Section } from '../models/highscore.model';

export interface SectionConfig {
  readonly value: HighscoreSection;
  readonly label: string;
  readonly icon: string;
}

export interface CustomSectionConfig {
  readonly value: CustomSection;
  readonly label: string;
  readonly icon: string;
}

export const HIGHSCORE_SECTIONS: readonly SectionConfig[] = [
  { value: 'experience', label: 'Experience', icon: 'pi pi-box' },
  { value: 'magic', label: 'Magic', icon: 'pi pi-box' },
  { value: 'fist', label: 'Fist', icon: 'pi pi-box' },
  { value: 'club', label: 'Club', icon: 'pi pi-box' },
  { value: 'sword', label: 'Sword', icon: 'pi pi-box' },
  { value: 'axe', label: 'Axe', icon: 'pi pi-box' },
  { value: 'distance', label: 'Distance', icon: 'pi pi-box' },
  { value: 'shield', label: 'Shield', icon: 'pi pi-box' },
  { value: 'fishing', label: 'Fishing', icon: 'pi pi-box' },
] as const;

export const CUSTOM_SECTIONS: readonly CustomSectionConfig[] = [
  { value: 'experience_loss', label: 'Experience Loss', icon: 'pi pi-box' },
] as const;

export function toMenuItems(sections: readonly SectionConfig[] = HIGHSCORE_SECTIONS): MenuItem[] {
  return sections.map((section) => ({
    label: section.label,
    icon: section.icon,
    routerLink: [`/top/${section.value}`],
  }));
}

export function toCustomMenuItems(
  sections: readonly CustomSectionConfig[] = CUSTOM_SECTIONS,
): MenuItem[] {
  return sections.map((section) => ({
    label: section.label,
    icon: section.icon,
    badge: 'NEW',
    badgeStyleClass: 'badge-new',
    routerLink: [`/top/${section.value}`],
  }));
}

export interface SectionOption {
  label: string;
  value: HighscoreSection;
}

export function toSectionOptions(
  sections: readonly SectionConfig[] = HIGHSCORE_SECTIONS,
): SectionOption[] {
  return sections.map((section) => ({
    label: section.label,
    value: section.value,
  }));
}

export function getSectionLabel(sectionValue: Section): string {
  const standard = HIGHSCORE_SECTIONS.find((s) => s.value === sectionValue);
  if (standard) return standard.label;
  return CUSTOM_SECTIONS.find((s) => s.value === sectionValue)?.label ?? sectionValue;
}
