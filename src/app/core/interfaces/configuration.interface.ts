import { Observable } from 'rxjs';
import { AppConfiguration, EnvironmentConfig, ConnectionTestResult } from '../models';

export interface IConfigurationService {
  getConfiguration(): Observable<AppConfiguration>;
  updateConfiguration(config: Partial<AppConfiguration>): Observable<void>;
  getEnvironmentConfig(env: 'qa' | 'stg'): Observable<EnvironmentConfig>;
  testConnection(): Observable<ConnectionTestResult>;
  getConnectionMode(): Observable<'local' | 'remote'>;
}
