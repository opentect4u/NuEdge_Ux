import { Component, ElementRef, EventEmitter, Input, OnInit,Output,Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-core-srch',
  templateUrl: './srch.component.html',
  styleUrls: ['./srch.component.css']
})
export class SrchComponent implements OnInit, ControlValueAccessor{
  @Input() label: string; /** For Label */
  @Input() placeholder: string; /** For Placeholder */
  @ViewChild('searchList') search: ElementRef;
  @Input() isPending: boolean = false; /** For Loader */
  @Input() listItems: any =[]; /** After Typeing some text in Input field, get the result for that corrosponding text */
  @Input() flag: string; /** To identify the type of search ex: client,scheme or bank etc */
  @Input()  set displayMode(Visibility){
        this.displaySearchReult(Visibility)
  } /** For Show Or Hide the search result on click on outside or click inside the list */


  @Input() isRequired: boolean = false; /** displaying asterik sign after label */
  @Input() isClientExistMsg: string; /** For Showing does not exist when no item found */
  @Input() propertiesToShow: string[] = [];
  @Input() isExists:boolean; /** for checking whether the search item exist or not */
  @Output() selectedItems = new EventEmitter<any>(); /** send the select item from parent to child */
  @Output() setDisplayMode = new EventEmitter<any>();
  @Input()  noDataFoundTitle: string; /** No data found message Title */
  @Input()  noDataFoundSubTitle: string; /** No data found message SubTitle */

  constructor(@Self() public ngControl:NgControl) {
      ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {
    // console.log(obj);
  }
  registerOnChange(fn: any): void {
    // console.log(fn);
  }
  registerOnTouched(fn: any): void {
    // console.log(fn);
  }
  ngOnInit(): void {
  }

  /** select the item from list */
  getItems(item){
    this.selectedItems.emit({item:item,flag:this.flag})
  }

  /** Trigger after click on outside of this search div*/
  outsideClickforClient(ev){
    if(ev){
      this.setDisplayMode.emit('none');
    }
  }
  /** show or hide the result */
  displaySearchReult(display_mode){
    console.log(this.search);

    if(display_mode && this.search){
      this.search.nativeElement.style.display = display_mode;
    }
  }
}
