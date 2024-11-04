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
        padding: '0 2.5rem',
      }),
    ]),
    query(':enter', [animate('600ms ease', style({ opacity: 1 }))]),
  ]),
]);
