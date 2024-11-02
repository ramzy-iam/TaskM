import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0) translateY(100%)',
        padding: '0 2.5rem',
      }),
    ]),
    query(':enter', [
      animate(
        '500ms ease',
        style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
      ),
    ]),
  ]),
]);
