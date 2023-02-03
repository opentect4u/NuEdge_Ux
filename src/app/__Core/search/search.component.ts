import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {  debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'core-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchResult') __searchRlt: ElementRef;
  @Output() __searchItem: EventEmitter<any> = new EventEmitter();
  @Input() __flag: string;
  @Input() __placeholder: string;
  @Input() __api_name: string;
  __pageTitle: any;
  __items: any = [];
  __SearchForm: FormGroup = new FormGroup({
    searchItem: new FormControl('')  
  })
  constructor(
    private __dbIntr: DbIntrService, 
    private __loc: Location, 
    private __utility: UtiliService,
    private __datePipe: DatePipe) {
    this.__utility.__route$
      .subscribe((res) => {
        this.__pageTitle = res;
        console.log(this.__pageTitle?.trans_type_id);
        
      })
  }

  ngOnInit() {
    console.log('res');
   }
  ngAfterViewInit() {
    this.__SearchForm.controls['searchItem'].valueChanges.
      pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(dt => dt?.length > 1 ? 
          this.__dbIntr.searchItems(this.__api_name, dt + (this.__pageTitle?.trans_type_id ? "&trans_type_id=" + this.__pageTitle?.trans_type_id : ''))
          : []),
      ).subscribe({
        next: (value) => {
          this.__items = value.data;
          this.searchResultVisibility('block');
        },
        complete: () => console.log('completed'),
        error: (err) => console.log(err)

      })
  }

  getItems(__items) {
    this.__SearchForm.controls['searchItem'].reset(this.getSelectItemFromSearchList(__items), { onlySelf: true, emitEvent: false });
    this.generateData(__items.id, 'F', __items);
    this.searchResultVisibility('none');
  }
  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  navigate() {
    this.__loc.back();
  }
  addMasters(__id: number) {
    this.generateData(__id, 'A', '');
    console.log(__id);

  }
  generateData(_id: number, __flag: string, __items) {
    var dt = {
      id: _id,
      flag: __flag,
      item: __items
    }
    this.__searchItem.emit(dt);
  }
  ClearText() {
    var dt = {
      id: 0,
      flag: 'C',
      item: ''
    }
    this.__searchItem.emit(dt);
    this.__SearchForm.controls['searchItem'].reset('');
  }
  getSelectItemFromSearchList(__items) {
    let item = this.__pageTitle.id == 13 ? __items.rnt_name
      : this.__pageTitle.id == 4 ? __items.amc_name
        : this.__pageTitle.id == 5 ? __items.cat_name
          : this.__pageTitle.id == 6 ? __items.subcategory_name
            : this.__pageTitle.id == 7 ? __items.bank_name
              : this.__pageTitle.id == 8 ? __items.scheme_name
                : this.__pageTitle.id == 17 ? __items.doc_type
                  : this.__pageTitle.id == 19 ? __items.temp_tin_id + '|' + __items.product_name
                    : this.__pageTitle?.id == 2 ?
                      __items.client_code + '|' + __items.client_name + '|' + __items.pan + '|' + __items.mobile 
                      : this.__pageTitle?.trans_type_id ? __items.tin_no + ' | ' + this.__datePipe.transform(__items.entry_date,'dd/MM-YYYY') 
                      : this.__pageTitle?.id == 33 ? __items.plan_name 
                      : this.__pageTitle?.id == 37 ? __items.opt_name : '';
      ;

    return item;
  }
}
