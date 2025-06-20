import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[srchScroll]'
})
export class ScrollDirective {

  @Output() reachEnd = new EventEmitter<unknown>();
  /**
   * @description This method listens for scroll events on the element associated with this directive.
   * When the user scrolls to the bottom of the element, it emits an event indicating that the end has been reached.
   * 
   * @param event - The scroll event object containing information about the scroll position.
   */
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
