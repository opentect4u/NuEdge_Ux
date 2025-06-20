import { DatePipe, Location } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'core-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild('searchResult') __searchRlt: ElementRef;
  @Output() __searchItem: EventEmitter<any> = new EventEmitter();
  @Input() __flag: string;
  @Input() __placeholder: string;
  @Input() __api_name: string;
  @Input() __paginate: string;
  __pageTitle: any;
  __items: any = [];
  __SearchForm: FormGroup = new FormGroup({
    searchItem: new FormControl(''),
  });
  constructor(
    private __dbIntr: DbIntrService,
    private __loc: Location,
    private __utility: UtiliService,
    private __datePipe: DatePipe
  ) {
    this.__utility.__route$.subscribe((res) => {
      this.__pageTitle = res;
      console.log(this.__pageTitle?.trans_type_id);
    });
  }

  ngOnInit() {
    console.log('res');
  }
  ngAfterViewInit() {
    this.__SearchForm.controls['searchItem'].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchItems(
                this.__api_name,
                dt +
                  (this.__pageTitle?.trans_type_id
                    ? '&trans_type_id=' + this.__pageTitle?.trans_type_id
                    : '') +
                  '&paginate=' + this.__paginate
              )
            : []
        )
      )
      .subscribe({
        next: (value) => {
          this.__items = value.data;
          this.searchResultVisibility('block');
        },
        complete: () => console.log('completed'),
        error: (err) => console.log(err),
      });
  }
  /**
   * @description This function is used to get the selected item from the search result
   * @param __items - The selected item from the search result
   * It resets the searchItem control with the selected item's details and emits the data to the parent component.
   * It also hides the search result dropdown.
   */
  getItems(__items) {
    this.__SearchForm.controls['searchItem'].reset(
      this.getSelectItemFromSearchList(__items),
      { onlySelf: true, emitEvent: false }
    );
    this.generateData(__items.id, 'F', __items);
    this.searchResultVisibility('none');
  }
  /**
   * @description This function is triggered when the user clicks outside the search result dropdown.
   * It hides the search result dropdown.
   * @param __ev - The event object containing the click event details
   * It checks if the event is defined and then calls the searchResultVisibility method to hide the dropdown.
   */
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  /**
   * @description This function is used to control the visibility of the search result dropdown.
   * @param display_mode - The display mode to set for the search result dropdown (e.g., 'block', 'none')
   * It sets the display style of the search result element based on the provided display_mode parameter.
   */
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  /**
   * @description This function is used to navigate back to the previous page.
   * It uses the Location service to go back in the browser history.
   * It is typically called when the user clicks a back button or wants to return to the previous page.
   */
  navigate() {
    this.__loc.back();
  }
  /**
   * @description This function is used to add masters based on the provided ID.
   * @param __id - The ID of the master to be added
   * It generates data with the specified ID, flag 'A', and an empty item string.
   * The generated data is then emitted through the __searchItem EventEmitter.
   */
  addMasters(__id: number) {
    this.generateData(__id, 'A', '');
    console.log(__id);
  }
  /**
   * @description This function is used to generate data for the search item.
   * @param _id - The ID of the item
   */
  generateData(_id: number, __flag: string, __items) {
    var dt = {
      id: _id,
      flag: __flag,
      item: __items,
    };
    this.__searchItem.emit(dt);
  }
  /**
   * @description This function is used to clear the search text input.
   * It emits an event with an object containing id 0, flag 'C', and an empty item string.
   * It also resets the searchItem control in the SearchForm to an empty string.
   * This function is typically called when the user wants to clear the search input field.
   */
  ClearText() {
    var dt = {
      id: 0,
      flag: 'C',
      item: '',
    };
    this.__searchItem.emit(dt);
    this.__SearchForm.controls['searchItem'].reset('');
  }
  /**
   * @description This function is used to get the selected item from the search list based on the page title ID.
   * It returns a formatted string based on the ID of the page title.
   * @param __items - The item from the search list
   * It checks the ID of the page title and returns a specific property or combination of properties from the __items object.
   * This is used to display the selected item in a user-friendly format.
   */
  getSelectItemFromSearchList(__items) {
    let item =
      this.__pageTitle.id == 13
        ? __items.rnt_name
        : this.__pageTitle.id == 4
        ? __items.amc_name
        : this.__pageTitle.id == 5
        ? __items.cat_name
        : this.__pageTitle.id == 6
        ? __items.subcategory_name
        : this.__pageTitle.id == 7
        ? __items.bank_name
        : this.__pageTitle.id == 8
        ? __items.scheme_name
        : this.__pageTitle.id == 50
        ? __items.doc_type
        : this.__pageTitle.id == 19
        ? __items.temp_tin_no
        : this.__pageTitle?.id == 2 || this.__pageTitle?.id == 12
        ? (__items.client_code ? __items.client_code + '|' : '') +
          __items.client_name +
          '|' +
          (__items.pan ? __items.pan + '|' : '') +
          __items.mobile
        : this.__pageTitle?.trans_type_id
        ? __items.tin_no +
          ' | ' +
          this.__datePipe.transform(__items.entry_date, 'dd/MM-yyyy')
        : this.__pageTitle?.id == 33
        ? __items.plan_name
        : this.__pageTitle?.id == 37
        ? __items.opt_name
        : '';
    return item;
  }
}
