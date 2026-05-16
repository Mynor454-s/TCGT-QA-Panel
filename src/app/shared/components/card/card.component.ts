import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
})
export class CardComponent {
  title = input<string>();
  subtitle = input<string>();
  clickable = input<boolean>(false);

  cardClick = output<void>();

  onClick(): void {
    if (this.clickable()) {
      this.cardClick.emit();
    }
  }
}
