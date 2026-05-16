import { Component, input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent implements OnInit, OnDestroy {
  placeholder = input<string>('Buscar...');
  debounceMs = input<number>(300);

  searchChange = output<string>();

  value = signal('');
  private readonly input$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.input$
      .pipe(debounceTime(this.debounceMs()), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => this.searchChange.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(value: string): void {
    this.value.set(value);
    this.input$.next(value);
  }

  clear(): void {
    this.value.set('');
    this.input$.next('');
  }
}
