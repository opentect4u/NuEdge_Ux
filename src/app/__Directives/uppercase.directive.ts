import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef, private control: NgControl) {}
  /**
   * @description This method listens for input events on the element associated with this directive.
   * When the user types in the input field, it converts the input value to uppercase.
   * It also preserves the cursor position after the transformation.
   * 
   * @param event - The input event object containing information about the input value and cursor position.
   */
  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const upper = input.value.toUpperCase();
    if (input.value !== upper) {
      this.control.control?.setValue(upper, { emitEvent: false });
      setTimeout(() => {
        input.setSelectionRange(start, end);
      });
    }
  }
}