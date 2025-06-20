import { Component, ElementRef, EventEmitter, Input, OnInit,Output,QueryList,Self, ViewChild, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ListItemComponent } from '../list-item/list-item.component';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ENTER,DOWN_ARROW,UP_ARROW } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-core-srch',
  templateUrl: './srch.component.html',
  styleUrls: ['./srch.component.css']
})
export class SrchComponent implements OnInit, ControlValueAccessor{

  @ViewChildren(ListItemComponent) items: QueryList<ListItemComponent>;
  private keyManager: ActiveDescendantKeyManager<ListItemComponent>;
  @Input() isTopDefined:string;
  @Input() label: string; /** For Label */
  @Input() placeholder: string; /** For Placeholder */
  @ViewChild('searchList') search: ElementRef;
  @Input() isPending: boolean = false; /** For Loader */
  @Input() listItems: any =[]; /** After Typeing some text in Input field, get the result for that corrosponding text */
  @Input() flag: string; /** To identify the type of search ex: client,scheme or bank etc */
  @Input()  set displayMode(Visibility){
        this.displaySearchReult(Visibility)
  } /** For Show Or Hide the search result on click on outside or click inside the list */
  @Input() disabled:boolean | undefined = false;

  @Input() isRequired: boolean = false; /** displaying asterik sign after label */
  @Input() isClientExistMsg: string; /** For Showing does not exist when no item found */
  @Input() propertiesToShow: string[] = [];
  @Input() isExists:boolean; /** for checking whether the search item exist or not */
  @Output() selectedItems = new EventEmitter<any>(); /** send the select item from parent to child */
  @Output() setDisplayMode = new EventEmitter<any>();
  @Input()  noDataFoundTitle: string; /** No data found message Title */
  @Input()  noDataFoundSubTitle: string; /** No data found message SubTitle */

  @Output() scrollToEnd = new EventEmitter<unknown>();

  constructor(@Self() public ngControl:NgControl) {
      ngControl.valueAccessor = this;
  }
  /**
   * @description This function is used to write the value to the control
   * It is part of the ControlValueAccessor interface and is called by Angular when the value of the control changes.
   * In this case, it does not perform any action as it is not required for this component.
   * @param obj - The value to be written to the control.
   * @returns {void}
   */
  writeValue(obj: any): void {
    // console.log(obj);
  }
  /**
   * @description This function is used to register a callback function that will be called when the control's value changes
   * It is part of the ControlValueAccessor interface and is called by Angular when the control's value changes.
   * In this case, it does not perform any action as it is not required for this component.
   * @param fn - The callback function to be registered.
   * @returns {void}
   */
  registerOnChange(fn: any): void {
    // console.log(fn);
  }
  /**
   * @description This function is used to register a callback function that will be called when the control is touched
   * It is part of the ControlValueAccessor interface and is called by Angular when the control is touched.
   * In this case, it does not perform any action as it is not required for this component.
   * @param fn - The callback function to be registered.
   * @returns {void}
   */
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
      this.listItems.length = 0;
      this.keyManager.setActiveItem(-1);
      this.setDisplayMode.emit('none');
    }
  }
  /** show or hide the result */
  displaySearchReult(display_mode){
    if(display_mode && this.search){
      this.search.nativeElement.style.display = display_mode;
    }
  }

  ngAfterViewInit() {
    this.keyManager = new ActiveDescendantKeyManager(this.items)
      .withWrap(true);
      // .withTypeAhead()
  }
  /**
   * 
   * @param event - This function is used to handle the key up event on the search input field
   * It stops the event propagation and checks if the pressed key is Enter, Down Arrow, or Up Arrow.
   * If Enter is pressed, it calls the getItems function with the active item's items.
   * If Down Arrow or Up Arrow is pressed, it calls the keyManager's onKeydown method to navigate through the list.
   * @returns {void}
   */
  onKeyUp(event:KeyboardEvent) {
    event.stopPropagation();
    if (event.keyCode === ENTER) {
      this.getItems(this.keyManager.activeItem.items);
    } else if(event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
      this.keyManager.onKeydown(event);
    }
  }
  /**
   * 
   * @param event - This function is used to handle the scroll event on the search list
   * It checks if the scroll position is at the end of the list and emits the scrollEnd event with the event object.
   * @returns {void}
   */
  scrollEnd = (event) =>{
    this.scrollToEnd.emit(event);
  }
}
