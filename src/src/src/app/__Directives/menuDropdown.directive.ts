import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, Inject } from '@angular/core';

@Directive({
  selector: '[__MenuShow]'
})
export class MenuDropdownDirective {

  constructor(
    @Inject(DOCUMENT) private __document: any
    ) { }
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement): void {
    if (!targetElement) {
      return;
    }
    var boxes = (this.__document.body.getElementsByClassName('dropdown-content')) as HTMLCollectionOf<HTMLElement>;
    if(!targetElement.matches('.dropbtn')){
      for (let i = 0; i < boxes.length; i++) {
        var openDropdown = boxes[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
}
