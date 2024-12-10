import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
})
export class ScrollNearEndDirective {
  readonly nearEnd = output<void>();

  @HostListener('scroll', ['$event'])
  windowScrollEvent(event: Event) {
    const target = event.target as HTMLElement;

    const scrollPercentage =
      (target.scrollTop / (target.scrollHeight - target.offsetHeight)) * 100;

    const threshold = 99;
    const errorMargin = 0.1;

    if (Math.floor(scrollPercentage) >= threshold - errorMargin)
      this.nearEnd.emit();
  }
}
