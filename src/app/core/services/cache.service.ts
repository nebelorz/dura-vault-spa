import { Injectable } from '@angular/core';

/**
 * Generic caching service for storing and retrieving data in memory.
 * Can be used across the application to cache any data.
 */
@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private dataStore = new Map<string, unknown>();

  /**
   * Retrieves cached data by key.
   * @param key - The cache key.
   * @returns The cached data, or undefined if not found.
   */
  get<T>(key: string): T | undefined {
    return this.dataStore.get(key) as T | undefined;
  }

  /**
   * Stores data in the cache with the specified key.
   * @param key - The cache key.
   * @param value - The data to cache.
   */
  set<T>(key: string, value: T): void {
    this.dataStore.set(key, value);
  }

  /**
   * Checks if a key exists in the cache.
   * @param key - The cache key to check.
   * @returns True if the key exists, false otherwise.
   */
  has(key: string): boolean {
    return this.dataStore.has(key);
  }

  /**
   * Clears all cached data.
   */
  clearAll(): void {
    this.dataStore.clear();
  }

  /**
   * Clears cached data for keys matching a specific pattern.
   * @param pattern - Substring to match in cache keys for deletion.
   */
  clearByPattern(pattern: string): void {
    const keysToDelete: string[] = [];
    this.dataStore.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.dataStore.delete(key));
  }

  /**
   * Deletes a specific cache entry.
   * @param key - The cache key to delete.
   * @returns True if the entry was deleted, false if it didn't exist.
   */
  delete(key: string): boolean {
    return this.dataStore.delete(key);
  }
}
