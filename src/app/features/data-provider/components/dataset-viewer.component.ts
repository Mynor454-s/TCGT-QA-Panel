import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dataset-viewer',
  standalone: true,
  template: `
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden" data-testid="dataset-viewer">
      <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 class="text-sm font-semibold text-gray-900">
          {{ datasetName() }} → {{ keyName() }}
        </h3>
      </div>
      <div class="p-4">
        <pre class="text-xs font-mono text-gray-700 bg-gray-50 rounded-md p-3 overflow-x-auto max-h-96">{{ formattedContent() }}</pre>
      </div>
    </div>
  `,
})
export class DatasetViewerComponent {
  datasetName = input.required<string>();
  keyName = input.required<string>();
  content = input.required<unknown>();

  formattedContent(): string {
    try {
      return JSON.stringify(this.content(), null, 2);
    } catch {
      return String(this.content());
    }
  }
}
