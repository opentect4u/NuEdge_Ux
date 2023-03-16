import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import { RcvFormCrudComponent } from '../rcv-form-crud/rcv-form-crud.component';

@Component({
  selector: 'app-rcv-form-rpt',
  templateUrl: './rcv-form-rpt.component.html',
  styleUrls: ['./rcv-form-rpt.component.css']
})
export class RcvFormRPTComponent implements OnInit {
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  toppings = new FormControl();
  toppingList: any = [{id:'edit',text:'Edit'},
                          {id:'delete',text:'Delete'},
                          {id:'sl_no',text:'Sl No'},
                          {id:'temp_tin_no',text:'Temporary Tin Number'},
                          {id:'bu_type',text:'Buisness type'},
                          {id:'arn_no',text:'ARN Number'},
                          {id:'euin_no',text:'EUIN'},
                          {id:'ins_type_name',text:'Insurance Type'},
                          {id:'insure_bu_type',text:'Insure '},
                          {id:'proposer_name',text:'Proposer Name'},
                          {id:'rcv_datetime',text:'Receive DateTime'},
                          {id:'recv_from',text:'Reaceive From'}
                         ];
__bu_type = buType;
__kycStatus : any = [{"id":"Y","status":"With KYC"},{"id":"N","status":"Without KYC"}]
__export= new MatTableDataSource<any>([]);
__isAdd: boolean = false;
__isVisible:boolean= true;
__RcvForms = new MatTableDataSource<any>([]);
__pageNumber = new FormControl(10);
__paginate: any= [];
__columns: string[] = [];
__exportedClmns: string[] = ['sl_no', 'temp_tin_no',  'bu_type','rcv_datetime'];
__columnsForSummary: string[] = ['edit','delete','sl_no', 'temp_tin_no',  'bu_type','rcv_datetime'];
__columnsForDtls: string[] = ['edit',
                              'delete',
                              'sl_no',
                              'temp_tin_no',
                              'bu_type',
                              'arn_no',
                              'euin_no',
                              'ins_type_name',
                              'insure_bu_type',
                              'proposer_name',
                              'rcv_datetime',
                              'recv_from'

                              ]
__rcvForms  = new FormGroup({
   options:new FormControl('2'),
   proposer_code: new FormControl(''),
   recv_from: new FormControl(''),
   sub_brk_cd: new FormControl(''),
   euin_no: new FormControl(''),
   temp_tin_no: new FormControl(''),
   bu_type: new FormArray([])
})
__transType: any=[];
constructor(
private __Rpt: RPTService,
private __dialog: MatDialog,
private __utility: UtiliService,
public dialogRef: MatDialogRef<RcvFormRPTComponent>,
@Inject(MAT_DIALOG_DATA) public data: any,
private overlay: Overlay,
 private __dbIntr: DbIntrService
) {
}
__trans_types: any;
ngOnInit(){
this.__columns = this.__columnsForSummary;
this.toppings.setValue(this.__columns);
this.getRcvForm();
}


getRcvForm(column_name: string | null = '', sort_by: string| null | '' = 'asc'){
  const __rcvFormSearch = new FormData();
__rcvFormSearch.append('paginate',this.__pageNumber.value);
__rcvFormSearch.append('proposer_code',this.__rcvForms.value.proposer_code ? this.__rcvForms.value.proposer_code : '');
__rcvFormSearch.append('recv_from',this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : '');
__rcvFormSearch.append('sub_brk_cd',this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : '');
__rcvFormSearch.append('euin_no',this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : '');
__rcvFormSearch.append('bu_type',JSON.stringify(this.__rcvForms.value.bu_type));
__rcvFormSearch.append('temp_tin_no',this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : '');
__rcvFormSearch.append('column_name',column_name);
__rcvFormSearch.append('sort_by',sort_by ? sort_by : 'asc');
// __rcvFormSearch.append('kyc_status',JSON.stringify(this.__rcvForms.value.kyc_status));
this.__dbIntr.api_call(1,'/ins/formreceivedDetailSearch',__rcvFormSearch).pipe(map((x: any) => x.data)).subscribe((res: any) =>{
  this.__paginate = res.links;
  this.__RcvForms = new MatTableDataSource(res.data);
  this.__RcvForms._updateChangeSubscription();
  this.tableExport(column_name,sort_by,__rcvFormSearch);
})
}



onKycChange(e: any) {
const kyc_status: FormArray = this.__rcvForms.get('kyc_status') as FormArray;
if (e.target.checked) {
  kyc_status.push(new FormControl(e.target.value));
} else {
  let i: number = 0;
  kyc_status.controls.forEach((item: any) => {
    if (item.value == e.target.value) {
      kyc_status.removeAt(i);
      return;
    }
    i++;
  });
}
}

onbuTypeChange(e: any){
const bu_type: FormArray = this.__rcvForms.get('bu_type') as FormArray;
if (e.target.checked) {
  bu_type.push(new FormControl(e.target.value));
} else {
  let i: number = 0;
  bu_type.controls.forEach((item: any) => {
    if (item.value == e.target.value) {
      bu_type.removeAt(i);
      return;
    }
    i++;
  });
}
}



ngAfterViewInit(){
this.__rcvForms.controls['options'].valueChanges.subscribe(res =>{
  if(res == '1'){
   this.__columns = this.__columnsForDtls;
   this.toppings.setValue(this.__columnsForDtls);
   this.__exportedClmns = [
    'sl_no',
    'temp_tin_no',
    'bu_type',
    'arn_no',
    'euin_no',
    'ins_type_name',
    'insure_bu_type',
    'proposer_name',
    'rcv_datetime',
    'recv_from'

   ]
  }
  else{
    this.__columns = this.__columnsForSummary;
     this.toppings.setValue(this.__columnsForSummary);
    this.__exportedClmns = ['sl_no', 'temp_tin_no',  'bu_type','rcv_datetime'];
  }

})
this.toppings.valueChanges.subscribe((res) => {
  const clm = ['edit','delete']
  this.__columns = res;
  this.__exportedClmns = res.filter(item => !clm.includes(item))
});
}

tableExport(column_name: string | null = '', sort_by: string| null | '' = 'asc',__frmData){
  __frmData.delete('paginate');
// __rcvFormExport.append('kyc_status',JSON.stringify(this.__rcvForms.value.kyc_status));
this.__dbIntr.api_call(1,'/ins/formreceivedExport',__frmData).pipe(map((x: any) => x.data)).subscribe((res: any) =>{
  this.__export = new MatTableDataSource(res);
  this.__export._updateChangeSubscription();
})
}

getval(__itemsPerPage){
this.__pageNumber.setValue(__itemsPerPage);
this.submit();
}
getPaginate(__paginate){
if (__paginate.url) {
  this.__dbIntr
    .getpaginationData(
      __paginate.url
      + ('&paginate=' + this.__pageNumber.value)
      + ('&sort_by=' + this.__sortAscOrDsc.direction)
      + ('&column_name=' + this.__sortAscOrDsc.active)
      + ('&proposer_code=' + this.__rcvForms.value.proposer_code ? this.__rcvForms.value.proposer_code : '')
      + ('&recv_from=' + this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : '')
      + ('&sub_brk_cd=' + this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : '')
      + ('&euin_no=' + this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : '')
      + ('&temp_tin_no=' + this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : '')
      + ('&bu_type=' + JSON.stringify(this.__rcvForms.value.bu_type))
    )
    .pipe(map((x: any) => x.data))
    .subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    });
}
}
private setPaginator(__res) {
this.__RcvForms = new MatTableDataSource(__res);
}
deleteRcvForm(__element,index){
// const dialogConfig = new MatDialogConfig();
// dialogConfig.autoFocus = false;
// dialogConfig.closeOnNavigation = false;
// dialogConfig.width =  "40%";
// dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
// dialogConfig.data ={
//    temp_tin_no:__element.temp_tin_no
// }
// try{
//   const dialogref = this.__dialog.open(DeletercvComponent, dialogConfig);
//   dialogref.afterClosed().subscribe(dt => {
//     if(dt){
//       this.__RcvForms.data.splice(index,1);
//       this.__RcvForms._updateChangeSubscription();
//     }
//   })
// }
// catch(ex){
// }
}
populateDT(__items){
console.log(__items);

const dialogConfig = new MatDialogConfig();
dialogConfig.autoFocus = false;
dialogConfig.width = '80%';
dialogConfig.id = 'INS_' + __items.temp_tin_no.toString()
dialogConfig.hasBackdrop = false;
dialogConfig.disableClose = false;
dialogConfig.autoFocus = false;
dialogConfig.closeOnNavigation = false;
dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
try{
dialogConfig.data = {
flag:'INSRF',
id: __items.temp_tin_no,
title: 'Form Recievable - Insurance',
product_id:__items.product_id,
trans_type_id:__items.trans_type_id,
temp_tin_no:__items.temp_tin_no,
right:global.randomIntFromInterval(1,60)
};
 const dialogref = this.__dialog.open(RcvFormCrudComponent, dialogConfig);

dialogref.afterClosed().subscribe(dt => {
  if (dt) {
    if(dt.temp_tin_no){
      //update ROW
      this.updateRow(dt.data);
    }
    else{
      this.__RcvForms.data.unshift(dt.data);
      this.__RcvForms._updateChangeSubscription();
      this.__export.data.unshift(dt.data);
      this.__export._updateChangeSubscription();
    }
  }
});
}
catch(ex){
const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
dialogRef.updateSize("80%");
this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"client_name"})
}

}
fullScreen(){
this.dialogRef.removePanelClass('mat_dialog');
this.dialogRef.addPanelClass('full_screen');
this.dialogRef.updatePosition({top:'0px'});
this.__isVisible = !this.__isVisible;
}
minimize(){
this.dialogRef.removePanelClass('mat_dialog');
this.dialogRef.removePanelClass('full_screen');
this.dialogRef.updateSize("40%",'55px');
this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
maximize(){
this.dialogRef.removePanelClass('full_screen');
this.dialogRef.addPanelClass('mat_dialog');
this.dialogRef.updatePosition({top:'0px'});
this.__isVisible = !this.__isVisible;
}

updateRow(row_obj){
  this.__RcvForms.data = this.__RcvForms.data.filter((value: any, key) => {
    if (value.temp_tin_no == row_obj.temp_tin_no) {
      value.arn_no = row_obj.arn_no;
      value.branch_code = row_obj.branch_code;
      value.bu_type=row_obj.bu_type;
      value.dob = row_obj.dob;
      value.euin_no = row_obj.euin_no;
      value.ins_type_id = row_obj.ins_type_id;
      value.ins_type_name = row_obj.ins_type_name;
      value.insure_bu_type =row_obj.insure_bu_type;
      value.pan= row_obj.pan;
      value.proposal_no= row_obj.proposal_no;
      value.proposer_code= row_obj.proposer_code;
      value.proposer_id= row_obj.proposer_id;
      value.proposer_name= row_obj.proposer_name;
      value.rec_datetime= row_obj.rec_datetime;
      value.recv_from= row_obj.recv_from;
      value.sub_arn_no= row_obj.sub_arn_no;
      value.sub_brk_cd= row_obj.sub_brk_cd;
      value.temp_tin_no= row_obj.temp_tin_no;
    }
  })
  this.__export.data = this.__export.data.filter((value: any, key) => {
    if (value.temp_tin_no == row_obj.temp_tin_no) {
      value.arn_no = row_obj.arn_no;
      value.branch_code = row_obj.branch_code;
      value.bu_type=row_obj.bu_type;
      value.dob = row_obj.dob;
      value.euin_no = row_obj.euin_no;
      value.ins_type_id = row_obj.ins_type_id;
      value.ins_type_name = row_obj.ins_type_name;
      value.insure_bu_type =row_obj.insure_bu_type;
      value.pan= row_obj.pan;
      value.proposal_no= row_obj.proposal_no;
      value.proposer_code= row_obj.proposer_code;
      value.proposer_id= row_obj.proposer_id;
      value.proposer_name= row_obj.proposer_name;
      value.rec_datetime= row_obj.rec_datetime;
      value.recv_from= row_obj.recv_from;
      value.sub_arn_no= row_obj.sub_arn_no;
      value.sub_brk_cd= row_obj.sub_brk_cd;
      value.temp_tin_no= row_obj.temp_tin_no;
    }
  })
}

exportPdf(){
  this.__Rpt.downloadReport('#rcvForm',
  {
    title: 'Receive Form '
  }, 'Receive Form')
}

submit(){
  this.getRcvForm(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
sortData(sort){
  this.__sortAscOrDsc = sort;
  this.getRcvForm(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
reset(){
  this.__rcvForms.reset();
  this.__isAdd=false;
  this.__rcvForms.get('options').setValue('2');
  this.__sortAscOrDsc = {active: '',direction : 'asc'}
  this.submit();
}

}
