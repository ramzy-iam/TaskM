import { Directive, ElementRef, HostListener, Renderer2, input, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Directive({
  standalone: true,
  selector: '[appClipboard]',
})
export class ClipboardDirective {
  private el = inject(ElementRef);
  private clipboard = inject(Clipboard);
  private renderer = inject(Renderer2);

  readonly tempMessage = input<string | HTMLElement>('Copied!');
  readonly duration = input(1000);
  readonly value = input(''); // Text to be copied to clipboard

  private originalContent!: string;

  @HostListener('click') onClick() {
    this.copyToClipboard();
    this.replaceContentTemporarily();
  }

  private copyToClipboard(): void {
    const value = this.value();
    if (value) {
      this.clipboard.copy(value);
    }
  }

  private replaceContentTemporarily(): void {
    this.originalContent = this.el.nativeElement.innerHTML;

    const tempMessage = this.tempMessage();
    if (typeof tempMessage === 'string') {
      this.el.nativeElement.innerHTML = tempMessage;
    } else if (tempMessage instanceof HTMLElement) {
      this.el.nativeElement.innerHTML = '';
      this.renderer.appendChild(this.el.nativeElement, tempMessage);
    }

    setTimeout(() => {
      this.el.nativeElement.innerHTML = this.originalContent;
    }, this.duration());
  }
}
