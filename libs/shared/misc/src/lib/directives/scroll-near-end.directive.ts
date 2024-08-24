import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective {
  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();

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
