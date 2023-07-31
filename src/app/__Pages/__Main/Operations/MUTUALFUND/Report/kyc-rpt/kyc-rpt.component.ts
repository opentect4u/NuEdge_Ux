import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { kycClm } from 'src/app/__Model/ClmSelector/kycClm';
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'report-kyc-rpt',
  templateUrl: './kyc-rpt.component.html',
  styleUrls: ['./kyc-rpt.component.css']
})
export class KycRptComponent implements OnInit {
  __columns: column[] = [];
  selectedColmn:string[] =[];
   ClmList:column[] =(kycClm.Details.filter(x => !['ack_form_view','mu_frm_view','edit'].includes(x.field)));
  @Input() __pageNumber;
  @Input() selectBtn;
  @Input() itemsPerPage;
  @Input() trnsTypeId:number;
  isOpenMegaMenu:boolean = false;
  sort = new sort();
  __paginate: any = [];
  __getKycFormData:any;
  @Output() sendNFOFilteredDt =new EventEmitter();
  __kycMst: any=[]
  @Input() set transaction(trans_id: number){
    this._trns_id = trans_id;
    // this.setColumns(this.transFrm.value.option,this.trnsTypeId,trans_id);
    if(trans_id){
      this.submitNFOReport();
    }
  }
  get transaction(): number{
    return this._trns_id;
  }
  private _trns_id: number;

  constructor(private __dbIntr:DbIntrService) { }

  ngOnInit(): void {
    this.setColumns(2);
  }
getKycRpt(kycFormDt){
  this.__getKycFormData = kycFormDt;
  if(this.transaction){
    this.submitNFOReport();
  }
}
reset(ev){
   this.sort= new sort();
   this.__pageNumber = '10';
   this.getKycRpt(ev)
}
getSelectedColumns(columns){
  const clm = ['edit', 'app_form_view'];
  this.__columns = columns.map(({ field, header }) => ({field, header}));
}
getPaginate(__paginate){
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&option='+  this.__getKycFormData.options)
        +  ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
        +  ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
        + (('&client_code=' + (this.__getKycFormData.client_code ? this.__getKycFormData.client_code : ''))
        + ('&login_at=' + this.__getKycFormData.kyc_login_at.map(item => {return item['id']}))
        + ('&login_type=' + this.__getKycFormData.kyc_login)
        +('&from_date='+global.getActualVal(this.__getKycFormData.frm_dt))
        +('&to_date='+global.getActualVal(this.__getKycFormData.to_dt))
        +('&tin_no='+global.getActualVal(this.__getKycFormData.tin_no)))
        )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        // this.__kycRpt = new MatTableDataSource(res.data);
        this.__kycMst = res.data;
        this.__paginate = res.links;
      });
  }
}
onselectItem(ev){
  this.submitNFOReport();
}
submitNFOReport(){
 const __kyc = new FormData();
 __kyc.append('paginate',this.__pageNumber);
 __kyc.append('option', this.__getKycFormData.options);
 __kyc.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
 __kyc.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
 __kyc.append('from_date',global.getActualVal(this.__getKycFormData.frm_dt));
 __kyc.append('to_date',global.getActualVal(this.__getKycFormData.to_dt));
 __kyc.append('login_at',JSON.stringify(this.__getKycFormData.kyc_login_at.map(item => {return item['id']})));
 __kyc.append('login_type',global.getActualVal(this.__getKycFormData.kyc_login));
 __kyc.append('client_code', this.__getKycFormData.client_code ? this.__getKycFormData.client_code : '');
 __kyc.append('tin_no',this.__getKycFormData.tin_no ? this.__getKycFormData.tin_no : '');
 __kyc.append('trans_id', this.transaction.toString());
 __kyc.append('trans_type_id' ,this.trnsTypeId.toString());
 this.__dbIntr.api_call(1,'/kycDetailSearch',__kyc).pipe(pluck("data")).subscribe((res: any) =>{
     this.__kycMst = res.data;
     this.__paginate = res.links;
 })
}
setColumns(res){

  this.__getKycFormData = typeof(res) == 'object' ? res : '';
  const clmToRemoved = ['edit','app_form_view','ack_form_view','mu_frm_view','delete'];
  this.__columns = res.options == 1 ? (kycClm.Details.filter(x => !['ack_form_view','mu_frm_view','edit'].includes(x.field))) : (kycClm.Summary_copy.filter((x: any) => !['ack_form_view','mu_frm_view','edit'].includes(x.field)));
  this.selectedColmn =  this.__columns.map(item => {return item['field']});
}
DocView(kycDtls,mode){

}
customSort(ev){
  this.sort.order =ev.sortOrder;
  this.sort.field =ev.sortField;
  if(ev.sortField){
    this.getKycRpt(this.__getKycFormData);
  }
}
}
