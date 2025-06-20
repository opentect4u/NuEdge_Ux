import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[__searchResVisibility]'
})
export class SearchResVisibilityDirective {
  @Output()
  appOutsideClick = new EventEmitter();


  constructor(private __el: ElementRef) {
  }
  /**
   * @description This method listens for click events on the document.
   * If the click occurs outside the element associated with this directive,
   * it emits an event with a value of true; otherwise, it emits false.
   *
   * @param targetElement - The element that was clicked.
   */
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this.__el.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.appOutsideClick.emit(true);
    } else {
      this.appOutsideClick.emit(false);
    }
  }

}
