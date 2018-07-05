import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

const EASING_IN = '750ms cubic-bezier(0.19, 1, 0.22, 1)';
const EASING_OUT = '750ms 100ms cubic-bezier(0.19, 1, 0.22, 1)';

export const routerTransition = trigger('routerTransition', [
  transition('list => post', [
    /* order */
    group([
      query(':enter', style({ position: 'fixed', width:'100%' }), { optional: true }),
      query(':leave', style({ position: 'absolute', width:'100%' }), { optional: true }),
      query('.footer', style({ opacity: 0 }), { optional: true }),
    ]),
    /* 2 */ group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(20%)', opacity: 0 }),
        animate(EASING_OUT, style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate(EASING_IN, style({ transform: 'translateX(-20%)', opacity: 0 }))
      ], { optional: true }),
    ])
  ]),
  transition('post => list', [
    /* order */
    group([
      query(':enter', style({ position: 'absolute', width:'100%' }), { optional: true }),
      query(':leave', style({ position: 'absolute', width:'100%' }), { optional: true }),
      query('.footer', style({ opacity: 0 }), { optional: true })
    ]),
    /* 2 */ group([  // block executes in parallel
      query(':enter', [
        style({ transform: 'translateX(-20%)', opacity: 0 }),
        animate(EASING_OUT, style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate(EASING_IN, style({ transform: 'translateX(20%)', opacity: 0 }))
      ], { optional: true }),
    ])
  ])
])
