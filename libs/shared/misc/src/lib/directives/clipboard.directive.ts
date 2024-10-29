import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Directive({
  standalone: true,
  selector: '[appClipboard]',
})
export class ClipboardDirective {
  @Input() tempMessage: string | HTMLElement = 'Copied!';
  @Input() duration = 1000;
  @Input() value = ''; // Text to be copied to clipboard

  private originalContent!: string;

  constructor(
    private el: ElementRef,
    private clipboard: Clipboard,
    private renderer: Renderer2,
  ) {}

  @HostListener('click') onClick() {
    this.copyToClipboard();
    this.replaceContentTemporarily();
  }

  private copyToClipboard(): void {
    if (this.value) {
      this.clipboard.copy(this.value);
    }
  }

  private replaceContentTemporarily(): void {
    this.originalContent = this.el.nativeElement.innerHTML;

    if (typeof this.tempMessage === 'string') {
      this.el.nativeElement.innerHTML = this.tempMessage;
    } else if (this.tempMessage instanceof HTMLElement) {
      this.el.nativeElement.innerHTML = '';
      this.renderer.appendChild(this.el.nativeElement, this.tempMessage);
    }

    setTimeout(() => {
      this.el.nativeElement.innerHTML = this.originalContent;
    }, this.duration);
  }
}
