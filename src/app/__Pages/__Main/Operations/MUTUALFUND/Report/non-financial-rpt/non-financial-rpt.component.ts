import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-non-financial-rpt',
  templateUrl: './non-financial-rpt.component.html',
  styleUrls: ['./non-financial-rpt.component.css']
})
export class NonFinancialRPTComponent implements OnInit {
  private _trns_id;
  sort = new sort();
  @Input() Title:string;
  @Input() set transaction(trans_id: number){
    this._trns_id = trans_id;
    if(trans_id && this.trnsTypeId){
      this.submitNonFinReport();
    }
  }
  get transaction(): number{
    return this._trns_id;
  }
  @Input() trnsTypeId:number;
  @Input() nonfinancialMst:any= [];
  /** Filter Criteria */
  transFrm = new FormGroup({
    btnType: new FormControl(''),
    option: new FormControl('2'),
    date_periods_type: new FormControl(''),
    date_range: new FormControl(''),
    tin_no: new FormControl(''),
    client_dtls: new FormControl(''),
    amc_id: new FormControl([], { updateOn: 'blur' }),
    scheme_id: new FormControl([]),
    rnt_id: new FormArray([]),
    is_all_rnt: new FormControl(false),
    brn_cd: new FormControl([]),
    bu_type: new FormControl([]),
    rm_name: new FormControl([]),
    sub_brk_cd: new FormControl([]),
    euin_no: new FormControl([]),
    frm_dt: new FormControl(''),
    to_dt: new FormControl('')
  });
  /*** End */
  @Output() sendNonFinancialFilteredDt = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    // if(trans_id){
      this.submitNonFinReport();
    // }
  }

   get rnt_id(): FormArray{
    return this.transFrm.get('rnt_id') as FormArray;
   }
  /** End */
  submitNonFinReport(){
    console.log(this.trnsTypeId);

    const finFrmDT = new FormData();
    finFrmDT.append('paginate','10');
    finFrmDT.append('option', this.transFrm.value.option);
    finFrmDT.append('trans_id', this.transaction.toString());
    finFrmDT.append('trans_type_id' ,this.trnsTypeId.toString());
    finFrmDT.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    finFrmDT.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
      finFrmDT.append('from_date',global.getActualVal(this.transFrm.getRawValue().frm_dt));
      finFrmDT.append(
        'to_date',global.getActualVal(this.transFrm.getRawValue().to_dt));

      finFrmDT.append(
        'client_code',
        this.transFrm.value.client_dtls
          ? this.transFrm.value.client_dtls
          : ''
      );
      finFrmDT.append(
        'sub_brk_cd',
        this.transFrm.value.sub_brk_cd ? JSON.stringify(this.transFrm.value.sub_brk_cd.map(item => {return item['id']})) : ''
      );
      finFrmDT.append(
        'tin_no',
        this.transFrm.value.tin_no ? this.transFrm.value.tin_no : ''
      );
      finFrmDT.append(
        'amc_name',
        this.transFrm.value.amc_id ? JSON.stringify(this.transFrm.value.amc_id.map(item => {return item["id"]})) : '[]'
      );
      finFrmDT.append(
        'scheme_name',
        this.transFrm.value.scheme_id ? JSON.stringify(this.transFrm.value.scheme_id.map(item => {return item["id"]})) : '[]'
      );
      finFrmDT.append(
        'euin_no',
        this.transFrm.value.euin_no ? JSON.stringify(this.transFrm.value.euin_no.map(item => {return item['id']})) : '[]'
      );
      finFrmDT.append(
        'brn_cd',
        this.transFrm.value.brn_cd ? JSON.stringify(this.transFrm.value.brn_cd.map(item => {return item['id']})) : '[]'
      );
      finFrmDT.append('rnt_name',
      JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']}))
      );
      finFrmDT.append(
        'bu_type',
        this.transFrm.value.bu_type ?
        JSON.stringify(this.transFrm.value.bu_type.map(item => {return item['id']})): '[]'
      );
      this.sendNonFinancialFilteredDt.emit(finFrmDT);
}

}
