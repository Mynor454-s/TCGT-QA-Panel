import { Injectable, inject } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { IConfigurationService } from '../../interfaces/configuration.interface';
import {
  AppConfiguration,
  EnvironmentConfig,
  ConnectionTestResult,
  DEFAULT_CONFIGURATION,
} from '../../models';
import { IndexedDBService, STORES } from './indexeddb.service';

const CONFIG_ID = 'app-config';

interface StoredConfig {
  id: string;
  data: AppConfiguration;
}

@Injectable({ providedIn: 'root' })
export class LocalConfigurationService implements IConfigurationService {
  private readonly db = inject(IndexedDBService);
  private readonly config$ = new BehaviorSubject<AppConfiguration>(DEFAULT_CONFIGURATION);
  private initialized = false;

  getConfiguration(): Observable<AppConfiguration> {
    if (!this.initialized) {
      this.initialized = true;
      return this.db.getById<StoredConfig>(STORES.configuration, CONFIG_ID).pipe(
        map((stored) => stored?.data ?? DEFAULT_CONFIGURATION),
        tap((config) => this.config$.next(config)),
      );
    }
    return this.config$.asObservable();
  }

  updateConfiguration(partial: Partial<AppConfiguration>): Observable<void> {
    return this.config$.pipe(
      take(1),
      map((current) => ({ ...current, ...partial }) as AppConfiguration),
      tap((updated) => this.config$.next(updated)),
      switchMap((updated) =>
        this.db.put<StoredConfig>(STORES.configuration, { id: CONFIG_ID, data: updated }),
      ),
    );
  }

  getEnvironmentConfig(env: 'qa' | 'stg'): Observable<EnvironmentConfig> {
    return this.config$.pipe(map((config) => config.environments[env]));
  }

  testConnection(): Observable<ConnectionTestResult> {
    // Mock implementation — always succeeds in v1
    return of({
      success: true,
      message: 'Conexión local disponible',
      testsFound: 0,
    });
  }

  getConnectionMode(): Observable<'local' | 'remote'> {
    return this.config$.pipe(map((config) => config.connection.mode));
  }
}
