import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged,map,switchMap } from 'rxjs/operators';
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
  @Input() __api_name:string;
  __pageTitle:any;
  __items: any=[];
  __SearchForm: FormGroup = new FormGroup({
    searchItem: new FormControl(''),
  })
  constructor(private __dbIntr: DbIntrService,private __loc:Location,private __utility: UtiliService) {
       this.__utility.__route$
       .subscribe((res) => {
       this.__pageTitle = res;  
    })
   }

  ngOnInit() { }
  ngAfterViewInit() {
    this.__SearchForm.controls['searchItem'].valueChanges.
      pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(dt => dt.length > 1 ? this.__dbIntr.searchItems(this.__api_name,dt) : []),
      ).subscribe((value) => {
        this.__items = value.data;
        this.__searchRlt.nativeElement.style.display = 'block';
      })
  }

  getItems(__items) {
    // this.__SearchForm.controls['searchItem'].setValue(__items.title);
    console.log(__items);
    
    this.generateData(__items.id,'F',__items);
    this.__searchRlt.nativeElement.style.display = 'none';
  }
  outsideClick(__ev){
    if(__ev){
    this.__searchRlt.nativeElement.style.display = 'none';
    }
  }
  searchResultVisibility(display_mode){
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  navigate(){
   this.__loc.back();
  }
  addMasters(__id: number){this.generateData(__id,'A','');}
  generateData(_id: number,__flag: string,__items){
    var dt ={
      id:_id,
      flag:__flag,
      item:__items
    }
    this.__searchItem.emit(dt);
  }
}
