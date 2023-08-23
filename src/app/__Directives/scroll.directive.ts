import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[srchScroll]'
})
export class ScrollDirective {

  @Output() reachEnd = new EventEmitter<unknown>();

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    // do tracking
    // console.log('scrolled', event.target.scrollTop);
    // Listen to click events in the component
    let tracker = event.target;
    let limit = tracker.scrollHeight - tracker.clientHeight;
    if (event.target.scrollTop === limit) {
      // console.log('end');
      this.reachEnd.emit(event);
    }
  }

  constructor() {}

}
