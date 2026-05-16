import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const DB_NAME = 'tcgt-qa-panel';
const DB_VERSION = 1;

export const STORES = {
  configuration: 'configuration',
  history: 'history',
  schedules: 'schedules',
} as const;

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private db: IDBDatabase | null = null;

  private openDB(): Observable<IDBDatabase> {
    if (this.db) {
      return of(this.db);
    }

    return new Observable<IDBDatabase>((subscriber) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.configuration)) {
          db.createObjectStore(STORES.configuration, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.history)) {
          const historyStore = db.createObjectStore(STORES.history, { keyPath: 'id' });
          historyStore.createIndex('startedAt', 'startedAt', { unique: false });
          historyStore.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.schedules)) {
          db.createObjectStore(STORES.schedules, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        subscriber.next(this.db);
        subscriber.complete();
      };

      request.onerror = () => {
        subscriber.error(new Error('Failed to open IndexedDB'));
      };
    });
  }

  getAll<T>(storeName: string): Observable<T[]> {
    return this.openDB().pipe(
      map((db) => {
        return new Promise<T[]>((resolve, reject) => {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result as T[]);
          request.onerror = () => reject(request.error);
        });
      }),
      from_promise(),
      catchError(() => of([] as T[])),
    );
  }

  getById<T>(storeName: string, id: string): Observable<T | undefined> {
    return this.openDB().pipe(
      map((db) => {
        return new Promise<T | undefined>((resolve, reject) => {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result as T | undefined);
          request.onerror = () => reject(request.error);
        });
      }),
      from_promise(),
      catchError(() => of(undefined)),
    );
  }

  put<T>(storeName: string, item: T): Observable<void> {
    return this.openDB().pipe(
      map((db) => {
        return new Promise<void>((resolve, reject) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const request = store.put(item);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }),
      from_promise(),
    );
  }

  delete(storeName: string, id: string): Observable<void> {
    return this.openDB().pipe(
      map((db) => {
        return new Promise<void>((resolve, reject) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const request = store.delete(id);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }),
      from_promise(),
    );
  }

  clear(storeName: string): Observable<void> {
    return this.openDB().pipe(
      map((db) => {
        return new Promise<void>((resolve, reject) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }),
      from_promise(),
    );
  }
}

/** Helper operator to unwrap Promise from map */
function from_promise<T>() {
  return (source: Observable<Promise<T>>): Observable<T> => {
    return new Observable<T>((subscriber) => {
      source.subscribe({
        next: (promise) => {
          promise.then(
            (value) => {
              subscriber.next(value);
              subscriber.complete();
            },
            (err) => subscriber.error(err),
          );
        },
        error: (err) => subscriber.error(err),
      });
    });
  };
}
