import { environment } from '@env';

export function getDuraPlayerUrl(name: string): string {
  return `${environment.dura.baseURL}/?characters/${name}`;
}
