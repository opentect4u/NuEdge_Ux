import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClOutsideClick]'
})
export class ClOutsideClickDirective {
  @Output()
  appOutsideClick = new EventEmitter();


  constructor(private __el: ElementRef) {
  }

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
