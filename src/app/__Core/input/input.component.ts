import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'core-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  animations:[ trigger('load', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 }))
    ]),
    transition(':leave', [
        style({ opacity: 1 }),
        animate(600, style({ opacity: 0 }))
    ])

])]
})
export class InputComponent {
  @Input() __class:string;
  @Input() _type: string;
  @Input() _placeholder: string;
  @Input() __required:boolean = false;
  @Input() __readonly:boolean = false;

  constructor(@Self() public ngControl: NgControl) { this.ngControl.valueAccessor = this;}
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  get control(): FormControl{
   return this.ngControl.control as FormControl
  }
}
