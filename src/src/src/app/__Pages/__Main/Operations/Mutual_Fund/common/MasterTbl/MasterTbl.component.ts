import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { mutualFund } from 'src/app/__Model/__MutualFund';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'mf-common-MasterTbl',
  templateUrl: './MasterTbl.component.html',
  styleUrls: ['./MasterTbl.component.css']
})
export class MasterTblComponent implements OnInit {
  __columns = ["sl_no", 'tin_id', 'edit', 'delete'];
  @Output() __selectedItems: EventEmitter<mutualFund> = new EventEmitter(null);
  @Input() __MstDT = new MatTableDataSource<mutualFund>([]);
  @Input() __paginate: any=[];
  @Input() __pageNumber: any;
  @Input() api_name:string;
  @Input() __transType_id: string;
  @Input() __prod_id: string;
  @Input() __trans_id: string;
  constructor(
    private __dbIntr: DbIntrService
  ) {
    console.log("Masterblcomp Loaded");

  }

  ngOnInit() {
    console.log(this.__trans_id);
    
  }
  populateDT(__elements: mutualFund) {
    console.log(__elements);

    // this.__selectedItems.emit(__elements);
  }
  ngOnChanges(__ev) {
    console.log(__ev.__MstDT.currentValue.data.length);
  }
  getval(__paginate){
    this.__pageNumber= __paginate.toString();
    this.getPaginate();
 }
 getPaginate(__paginate: any | null = null){
    if(__paginate){
     this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber) + (this.__trans_id ? ('&trans_id=' + this.__trans_id) : '')).pipe(map((x: any) => x.data)).subscribe((res: any) => {
       this.setPaginator(res);
     })
    }
    else{
      this.__dbIntr.api_call(0,this.api_name ,'paginate='+this.__pageNumber).pipe(map((x: any) => x.data)).subscribe((res: any) => {
         this.setPaginator(res);

       })
    }
 }
 getSearchItem(__ev) {
  if (__ev.flag == 'A') {}
  else if (__ev.flag == 'F') {
    this.__MstDT = new MatTableDataSource([__ev.item]);
  }
  else {
    this.getPaginate();
  }
}
  setPaginator(res){
   this.__MstDT = new MatTableDataSource(res.data);
   this.__paginate = res.links;
  }

}
