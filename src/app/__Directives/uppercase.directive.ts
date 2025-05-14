import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

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