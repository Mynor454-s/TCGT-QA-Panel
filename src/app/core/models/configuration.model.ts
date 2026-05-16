export interface AppConfiguration {
  connection: ConnectionConfig;
  environments: Record<'qa' | 'stg', EnvironmentConfig>;
  browserstack?: BrowserStackConfig;
  preferences: UserPreferences;
}

export interface ConnectionConfig {
  mode: 'local' | 'remote';
  localPath?: string;
  remoteUrl?: string;
}

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  variables: Record<string, string>;
}

export interface BrowserStackConfig {
  username: string;
  accessKey: string;
  projectName?: string;
}

export interface UserPreferences {
  defaultEnvironment: 'qa' | 'stg';
  defaultMode: 'local' | 'browserstack';
  theme: 'light' | 'dark';
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  testsFound?: number;
}

export const DEFAULT_CONFIGURATION: AppConfiguration = {
  connection: {
    mode: 'local',
    localPath: '../TCGT-QA',
  },
  environments: {
    qa: {
      name: 'QA',
      baseUrl: 'https://qa-tarjetadigital.incubadorabi.com',
      variables: {},
    },
    stg: {
      name: 'STG',
      baseUrl: 'https://stg-tarjetadigital.incubadorabi.com',
      variables: {},
    },
  },
  browserstack: undefined,
  preferences: {
    defaultEnvironment: 'qa',
    defaultMode: 'local',
    theme: 'light',
  },
};
