import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { pluck } from 'rxjs/operators';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  __isVisible:boolean = true;
  __istemporaryspinner:boolean =false;
  displayMode_forTemp_Tin:string;
  __insType: any = [];
  __compMst:insComp[] =[];
  __prodTypeMst:insPrdType[] =[];
  __prdMst:insProduct[] =[];
  __tinMst:any=[];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) { }
 __bu_oportunity_frm = new FormGroup({
    dt_type: new FormControl(''),
    dt_range: new FormControl(''),
    from_date:new FormControl(''),
    to_date: new FormControl(''),
    tin_no: new FormControl(''),
    proposer_code: new FormControl(''),
    proposer_name: new FormControl(''),
    ins_type_id: new FormControl([]),
    comp_id: new FormControl([]),
    prod_type_id: new FormControl([]),
    product_id: new FormControl([]),
    renewal_month: new FormControl(''),
    renewal_year: new FormControl(''),
    brn_cd: new FormControl([]),
    bu_type: new FormControl([]),
    rm_id: new FormControl([]),
    sub_brk_cd: new FormControl([])


 })
  ngOnInit(): void {
    this.getTransTypeMst();
  }

  ngAfterViewInit(){

    /** Changes in Insurance Type  */
      this.__bu_oportunity_frm.controls['ins_type_id'].valueChanges.subscribe(res =>{
        if(res.length > 0){
          this.getCompanyAgainstInsurancetype(res);
        }
        else{
           this.__bu_oportunity_frm.controls['comp_id'].setValue([],{emitEvent:true});
           this.__compMst.length = 0;
        }
      })
      /** End */

    /** Changes in Company  */
      this.__bu_oportunity_frm.controls['comp_id'].valueChanges.subscribe(res =>{
        if(res.length > 0){
          this.getProductTypeMst(res);
        }
        else{
           this.__bu_oportunity_frm.controls['prod_type_id'].setValue([],{emitEvent:true});
           this.__prodTypeMst.length = 0;
        }
      })
      /** End */

    /** Changes in product Type  */
      this.__bu_oportunity_frm.controls['prod_type_id'].valueChanges.subscribe(res =>{
        if(res.length > 0){
          this.getProductMst(res);
        }
        else{
           this.__bu_oportunity_frm.controls['product_id'].setValue([],{emitEvent:true});
           this.__prdMst.length = 0;
        }
      })
      /** End */
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  getTransTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
    this.__insType = res;
    })
  }
  getCompanyAgainstInsurancetype(ins_type_ids){
    this.__dbIntr
      .api_call(0, '/ins/company', 'arr_ins_type_id='+JSON.stringify(ins_type_ids.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: insComp[]) => {
        this.__compMst = res;
      });
  }
  getProductTypeMst(arr_comp_id) {
    this.__dbIntr
      .api_call(0, '/ins/productType', 'arr_comp_id='+ JSON.stringify(arr_comp_id.map(item => {return item['id']})))
      .pipe(pluck('data'))
      .subscribe((res: insPrdType[]) => {
        this.__prodTypeMst = res;
      });
  }
  getProductMst(arr_prod_type_id) {
       this.__dbIntr
        .api_call(1, '/ins/productDetails', 'arr_prod_type_id=' + JSON.stringify(arr_prod_type_id.map(item => {return item['id']})))
        .pipe(pluck('data'))
        .subscribe((res: insProduct[]) => {
          this.__prdMst = res;
        });
  }
  close(ev){
    this.__bu_oportunity_frm.patchValue({
      from_date: this.__bu_oportunity_frm.getRawValue().dt_range ? dates.getDateAfterChoose(this.__bu_oportunity_frm.getRawValue().dt_range[0]) : '',
      to_date: this.__bu_oportunity_frm.getRawValue().dt_range ? (global.getActualVal(this.__bu_oportunity_frm.getRawValue().dt_range[1]) ?  dates.getDateAfterChoose(this.__bu_oportunity_frm.getRawValue().dt_range[1]) : '') : ''
    });
  }
  getSelectedItemsFromParent(ev){

  }
  getItems(items,flag){
    // switch(flag)
  }
}
