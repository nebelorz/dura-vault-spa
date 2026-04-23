import { environment } from '@env';

export function getDuraHomeUrl(): string {
  return `${environment.dura.baseURL}/`;
}

export function getDuraPlayerUrl(name: string): string {
  return `${environment.dura.baseURL}/?characters/${name}`;
}

export function getDuraGuildUrl(name: string): string {
  return `${environment.dura.baseURL}/?guilds/${name}`;
}
