import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-long-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './long-text.component.html',
  styleUrl: './long-text.component.scss',
})
export class LongTextComponent {
  @Input() text: string = '';
  @Input() maxLength: number = 100;
  @Input() heading = false;

  get truncatedText(): string {
    if (this.text.length > this.maxLength) {
      return this.text.substring(0, this.maxLength) + '...';
    }
    return this.text;
  }
}
