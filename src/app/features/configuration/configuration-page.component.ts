import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CONFIGURATION_SERVICE } from '../../core/tokens/service-tokens';
import { AppConfiguration, EnvironmentConfig } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-configuration-page',
  standalone: true,
  imports: [FormsModule, CardComponent],
  template: `
    <div data-testid="configuration-page">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>

      @if (config()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Connection -->
          <app-card title="Conexión con TCGT-QA">
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Modo</label>
                <select [(ngModel)]="config()!.connection.mode" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" data-testid="connection-mode">
                  <option value="local">Local (filesystem)</option>
                  <option value="remote">Remoto (API)</option>
                </select>
              </div>
              @if (config()!.connection.mode === 'local') {
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Path local</label>
                  <input type="text" [(ngModel)]="config()!.connection.localPath" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2 font-mono" data-testid="local-path-input" />
                </div>
              } @else {
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">URL de API</label>
                  <input type="text" [(ngModel)]="config()!.connection.remoteUrl" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" placeholder="https://api.example.com" data-testid="remote-url-input" />
                </div>
              }
            </div>
          </app-card>

          <!-- Environments -->
          <app-card title="Ambientes">
            <div class="space-y-4">
              @for (env of ['qa', 'stg']; track env) {
                <div class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <p class="text-xs font-semibold text-gray-700 uppercase mb-2">{{ env }}</p>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Base URL</label>
                    <input type="text" [ngModel]="getEnvUrl(env)" (ngModelChange)="setEnvUrl(env, $event)" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2 font-mono" [attr.data-testid]="'env-url-' + env" />
                  </div>
                </div>
              }
            </div>
          </app-card>

          <!-- BrowserStack -->
          <app-card title="BrowserStack">
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Username</label>
                <input type="text" [(ngModel)]="bsUsername" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" data-testid="bs-username" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Access Key</label>
                <input type="password" [(ngModel)]="bsAccessKey" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" data-testid="bs-access-key" />
              </div>
            </div>
          </app-card>

          <!-- Preferences -->
          <app-card title="Preferencias">
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Ambiente por defecto</label>
                <select [(ngModel)]="config()!.preferences.defaultEnvironment" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" data-testid="default-env">
                  <option value="qa">QA</option>
                  <option value="stg">STG</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Modo por defecto</label>
                <select [(ngModel)]="config()!.preferences.defaultMode" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" data-testid="default-mode">
                  <option value="local">Local</option>
                  <option value="browserstack">BrowserStack</option>
                </select>
              </div>
            </div>
          </app-card>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            (click)="save()"
            data-testid="save-config-btn"
          >
            Guardar configuración
          </button>
        </div>
      }
    </div>
  `,
})
export class ConfigurationPageComponent implements OnInit {
  private readonly configService = inject(CONFIGURATION_SERVICE);
  private readonly notificationService = inject(NotificationService);

  config = signal<AppConfiguration | null>(null);
  bsUsername = '';
  bsAccessKey = '';

  ngOnInit(): void {
    this.configService.getConfiguration().subscribe((config) => {
      this.config.set(config);
      this.bsUsername = config.browserstack?.username ?? '';
      this.bsAccessKey = config.browserstack?.accessKey ?? '';
    });
  }

  save(): void {
    const current = this.config();
    if (!current) return;

    const updated: AppConfiguration = {
      ...current,
      browserstack: this.bsUsername
        ? { username: this.bsUsername, accessKey: this.bsAccessKey }
        : undefined,
    };

    this.configService.updateConfiguration(updated).subscribe(() => {
      this.notificationService.success('Configuración guardada exitosamente');
    });
  }

  getEnvUrl(env: string): string {
    return this.config()?.environments[env as 'qa' | 'stg']?.baseUrl ?? '';
  }

  setEnvUrl(env: string, url: string): void {
    const current = this.config();
    if (current) {
      current.environments[env as 'qa' | 'stg'].baseUrl = url;
    }
  }
}
