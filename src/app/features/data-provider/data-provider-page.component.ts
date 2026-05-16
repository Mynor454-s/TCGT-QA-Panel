import { Component, inject, signal, OnInit } from '@angular/core';
import { DATA_PROVIDER_SERVICE } from '../../core/tokens/service-tokens';
import { Dataset, DatasetContent } from '../../core/interfaces/data-provider.interface';
import { CardComponent } from '../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DatasetViewerComponent } from './components/dataset-viewer.component';

@Component({
  selector: 'app-data-provider-page',
  standalone: true,
  imports: [CardComponent, EmptyStateComponent, DatasetViewerComponent],
  template: `
    <div data-testid="data-provider-page">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Data Providers</h1>

      @if (datasets().length === 0) {
        <app-empty-state title="Sin datasets" message="No se encontraron datasets configurados." />
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          @for (dataset of datasets(); track dataset.id) {
            <app-card [title]="dataset.name" [subtitle]="'Keys: ' + dataset.keys.join(', ')">
              <div class="space-y-2">
                <div class="flex flex-wrap gap-1">
                  @for (key of dataset.keys; track key) {
                    <button
                      class="text-xs px-2 py-1 rounded-md transition-colors"
                      [class.bg-blue-100]="selectedDataset()?.id === dataset.id && selectedKey() === key"
                      [class.text-blue-700]="selectedDataset()?.id === dataset.id && selectedKey() === key"
                      [class.bg-gray-100]="!(selectedDataset()?.id === dataset.id && selectedKey() === key)"
                      [class.text-gray-600]="!(selectedDataset()?.id === dataset.id && selectedKey() === key)"
                      (click)="selectDatasetKey(dataset, key)"
                      [attr.data-testid]="'dataset-key-' + dataset.id + '-' + key"
                    >
                      {{ key }}
                    </button>
                  }
                </div>
              </div>
            </app-card>
          }
        </div>

        @if (selectedContent()) {
          <div class="mt-6">
            <app-dataset-viewer
              [datasetName]="selectedDataset()!.name"
              [keyName]="selectedKey()!"
              [content]="selectedContent()!"
            />
          </div>
        }
      }
    </div>
  `,
})
export class DataProviderPageComponent implements OnInit {
  private readonly dataProviderService = inject(DATA_PROVIDER_SERVICE);

  datasets = signal<Dataset[]>([]);
  selectedDataset = signal<Dataset | null>(null);
  selectedKey = signal<string | null>(null);
  selectedContent = signal<unknown | null>(null);

  ngOnInit(): void {
    this.dataProviderService.getDatasets().subscribe((datasets) => this.datasets.set(datasets));
  }

  selectDatasetKey(dataset: Dataset, key: string): void {
    this.selectedDataset.set(dataset);
    this.selectedKey.set(key);
    this.dataProviderService.getDatasetContent(dataset.id).subscribe((content) => {
      this.selectedContent.set((content as Record<string, unknown>)[key] ?? null);
    });
  }
}
