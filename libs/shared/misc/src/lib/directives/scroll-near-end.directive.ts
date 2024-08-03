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

    if (target.offsetHeight + target.scrollTop >= target.scrollHeight)
      this.nearEnd.emit();
  }
}
