import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { mutualFund } from 'src/app/__Model/__MutualFund';

import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'MF-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  __paginate: any=[];
  __pageNumber = 10;
  __trans_id: string = this.__rtDt.snapshot.queryParamMap.get('trans_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('trans_id')) : '';
  __transType_id: string =this.__rtDt.snapshot.queryParamMap.get('trans_type_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('trans_type_id')) : '';
  __prod_id: string =this.__rtDt.snapshot.queryParamMap.get('product_id') ?  atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '';
  __financMst = new MatTableDataSource<mutualFund>([]);
  constructor(private __dbIntr: DbIntrService,private __utility: UtiliService,private __rtDt: ActivatedRoute) {
    this.getFianancMaster();
    console.log(this.__rtDt.snapshot.queryParamMap.get('trans_type_id'));
    console.log(this.__rtDt.snapshot.queryParamMap.get('trans_id'));


  }

  ngOnInit() { }
  // + ('&trans_id='+ this.__trans_id)
  getFianancMaster(__paginate: string  | null = "10") {
    this.__dbIntr.api_call(0, '/mfTraxShow', 'trans_type_id=' + this.__transType_id + '&paginate='+ __paginate ).pipe(map((x: responseDT) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
  }
  setPaginator(__res) {
    this.__financMst = new MatTableDataSource(__res);
  }
  addRow(row_obj) {
    this.__financMst.data.unshift(row_obj);
    this.__financMst._updateChangeSubscription();
  }

  updateRow(row_obj) {
    this.__financMst.data[this.__financMst.data.findIndex((x: any) => x.tin_no == row_obj.tin_no)] = row_obj;
    this.__financMst._updateChangeSubscription();
  }

  getSelectedItemForUpdate(__ev: mutualFund) {
    console.log(__ev);
  }

  navigate(){
   this.__utility.navigatewithqueryparams('/main/operations/mfTraxEntry/prodTypeModification',{queryParams:{product_id:btoa("1"),trans_type_id:btoa("1")}});
  }
}
