import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItem<T>(key: string, defaultValue?: T): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : (defaultValue ?? null);
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
