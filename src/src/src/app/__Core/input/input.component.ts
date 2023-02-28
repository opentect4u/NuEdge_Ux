import { Component, Input, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'core-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
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
