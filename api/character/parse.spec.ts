import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  decodeHtmlEntities,
  extractField,
  parseAccountCreated,
  parseBanishedUntil,
  parseCharacters,
  parseDeaths,
  parseFormerNames,
  parseGuild,
  parseHouses,
  toISO,
} from './parse';

const fixture = readFileSync(
  join(process.cwd(), 'api', 'character', 'fixtures', 'character.html'),
  'utf8',
);

describe('character parsers against the fixture', () => {
  it('extractField returns the decoded value for a matching field', () => {
    expect(extractField(fixture, 'Name')).toBe('Raven Knight');
    expect(extractField(fixture, 'Level')).toBe('100');
  });

  it('extractField returns null for an unknown field', () => {
    expect(extractField(fixture, 'NotAField')).toBeNull();
    expect(extractField('<td>Only:</td>', 'Only')).toBeNull();
  });

  it('parseCharacters extracts the character list with online status', () => {
    expect(parseCharacters(fixture)).toEqual([
      { name: 'Raven Knight', level: 100, vocation: 'Elite Knight', isOnline: true },
      { name: 'Night Stalker', level: 80, vocation: 'Master Sorcerer', isOnline: false },
    ]);
  });

  it('parseDeaths extracts deaths with level and killers, skipping the header row', () => {
    const deaths = parseDeaths(fixture);
    expect(deaths).toHaveLength(2);
    expect(deaths[0]).toEqual({
      date: expect.any(String),
      level: 95,
      description: 'Killed at level 95 by a Dragon and Night Stalker.',
      killers: ['Dragon', 'Night Stalker'],
    });
    expect(deaths[1]).toMatchObject({
      level: null,
      description: 'Died on level 30 of a Secret Service Investigation.',
    });
  });

  it('parseHouses extracts houses, leaving non-numeric sizes as null', () => {
    const houses = parseHouses(fixture);
    expect(houses).toHaveLength(2);
    expect(houses[0]).toMatchObject({
      name: 'Sunrise Villa',
      rent: '10,000',
      size: 5,
      beds: 3,
    });
    expect(houses[1]).toMatchObject({
      name: 'Moonlight Cottage',
      rent: '7,500',
      size: null,
      beds: 1,
    });
  });

  it('parseGuild extracts the guild rank and name', () => {
    expect(parseGuild(fixture)).toEqual({ rank: 'Leader', name: 'Order of the Phoenix' });
  });

  it('parseFormerNames splits and trims the former names', () => {
    expect(parseFormerNames(fixture)).toEqual(['Dark Avenger', 'Night Stalker']);
  });

  it('parseAccountCreated returns the created date from the account block', () => {
    expect(parseAccountCreated(fixture)).toBe('01/01/2020');
  });

  it('parseBanishedUntil returns the banished date from the account block', () => {
    expect(parseBanishedUntil(fixture)).toBe('15/02/2026');
  });
});

describe('character parser helpers', () => {
  it('decodeHtmlEntities decodes named, decimal, and hex entities', () => {
    expect(decodeHtmlEntities('a &amp; b &#65; &#x42;')).toBe('a & b A B');
  });

  it('decodeHtmlEntities leaves unknown entities untouched', () => {
    expect(decodeHtmlEntities('&unknown;')).toBe('&unknown;');
  });

  it('toISO returns null for a null input', () => {
    expect(toISO(null)).toBeNull();
  });

  it('toISO normalizes a valid UTC date and drops milliseconds', () => {
    expect(toISO('2026-08-06T12:00:00.000Z')).toBe('2026-08-06T12:00:00Z');
  });

  it('toISO returns the raw string when the date is invalid', () => {
    expect(toISO('not a date')).toBe('not a date');
  });

  it('returns empty results when the sentinel comments are absent', () => {
    expect(parseDeaths('<html></html>')).toEqual([]);
    expect(parseHouses('<html></html>')).toEqual([]);
    expect(parseCharacters('<html></html>')).toEqual([]);
    expect(parseAccountCreated('<html></html>')).toBeNull();
    expect(parseBanishedUntil('<html></html>')).toBeNull();
    expect(parseGuild('<html></html>')).toBeNull();
    expect(parseFormerNames('<html></html>')).toEqual([]);
  });
});
