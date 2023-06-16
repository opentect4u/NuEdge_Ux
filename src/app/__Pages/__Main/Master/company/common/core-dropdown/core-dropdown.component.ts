import { Component, EventEmitter, Input, OnInit, Output, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';


@Component({
  selector: 'common-core-dropdown',
  templateUrl: './core-dropdown.component.html',
  styleUrls: ['./core-dropdown.component.css']
})
export class CoreDropdownComponent implements OnInit,ControlValueAccessor {
  @Input() items: any = [];
  @Input() label: string;
  @Input() id: string;
  @Input() flag: string;
  @Output() getselectedItem = new EventEmitter<any>();
  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }
  ngOnInit(): void {}
  writeValue(obj: any): void {
    // console.log(obj);
  }

  registerOnChange(fn: any): void {
    // console.log(fn);
  }
  registerOnTouched(fn: any): void {
    // console.log(fn);
  }
  ngAfterViewInit(){
    this.ngControl.valueChanges.subscribe(res =>{
        this.getselectedItem.emit({id:res,flag:this.flag});
    })
  }
}
