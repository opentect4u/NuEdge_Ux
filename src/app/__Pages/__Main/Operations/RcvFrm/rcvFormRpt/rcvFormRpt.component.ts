import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, QueryList, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DeletercvComponent } from '../deletercv/deletercv.component';
import { RcvmodificationComponent } from '../rcvModification/rcvModification.component';
import buType from '../../../../../../assets/json/buisnessType.json';
import { RcvformmodifyfornfoComponent } from '../rcvFormModifyForNFO/rcvFormModifyForNFO.component';
import { RcvfrmmodificationfornonfinComponent } from '../rcvFormmodificationForNonFIn/rcvFrmModificationForNonFin.component';
import { client } from 'src/app/__Model/__clientMst';
@Component({
selector: 'rcvFormRpt-component',
templateUrl: './rcvFormRpt.component.html',
styleUrls: ['./rcvFormRpt.component.css']
})
export class RcvformrptComponent implements OnInit {
  @ViewChild('clientCd') __clientCode: ElementRef;
  @ViewChild('searchEUIN') __searchRlt: ElementRef;
  @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  @ViewChild('searchTempTin') __searchTempTin: ElementRef;

  @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;

  __sortAscOrDsc: any= {active:'',direction:'asc'};
    toppings = new FormControl();
    toppingList: any = [{id:'edit',text:'Edit'},
                            {id:'delete',text:'Delete'},
                            {id:'sl_no',text:'Sl No'},
                            {id:'temp_tin_no',text:'Temporary Tin Number'},
                            {id:'bu_type',text:'Buisness type'},
                            {id:'arn_no',text:'ARN Number'},
                            {id:'euin_no',text:'EUIN'},
                            {id:'client_name',text:'Client Name'},
                            {id:'rcv_datetime',text:'Receive DateTime'},
                            {id:'recv_from',text:'Reaceive From'},
                            {id:'inv_type',text:'Investment Type'},
                            {id:'apl_no',text:'Application Number'},
                            {id:'fol_no',text:'Folio Number'},
                            {id:'kyc_status',text:'KYC Status'}];
  __bu_type = buType;
  __kycStatus : any = [{"id":"Y","status":"With KYC"},{"id":"N","status":"Without KYC"}]
  __export= new MatTableDataSource<any>([]);
  __isAdd: boolean = false;
  __isVisible:boolean= true;
  __isClientPending: boolean = false;
  __isEuinPending: boolean = false;
  __isSubArnPending: boolean = false;
  __istemporaryspinner: boolean = false;

  __temp_tinMst: any=[];
  __subbrkArnMst: any=[];
  __clientMst:client[] =[];
  __euinMst: any=[];
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
                                'client_name',
                                'rcv_datetime',
                                'recv_from',
                                'inv_type',
                                'apl_no',
                                'fol_no',
                                'kyc_status'
                                ]
  __rcvForms  = new FormGroup({
     options:new FormControl('2'),
     client_code: new FormControl(''),
     recv_from: new FormControl(''),
     sub_brk_cd: new FormControl(''),
     euin_no: new FormControl(''),
     temp_tin_no: new FormControl(''),
     inv_type: new FormControl(''),
     trans_type: new FormControl(''),
     kyc_status: new FormArray([]),
     bu_type: new FormArray([]),
     is_all_bu_type: new FormControl(false)
  })
  __transType: any=[];
constructor(
  private __Rpt: RPTService,
  private __dialog: MatDialog,
  private __utility: UtiliService,
  public dialogRef: MatDialogRef<RcvformrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
   private __dbIntr: DbIntrService
) {
}
__trans_types: any;
ngOnInit(){
  // this.tableExport();
  this.getTransactionTypeDtls();
  this.__columns = this.__columnsForSummary;
  this.toppings.setValue(this.__columns);
  this.getTransactionType();
  this.getRcvForm();
}
getTransactionType(){
  this.__dbIntr.api_call(0,'/showTrans','trans_type_id='+this.data.trans_type_id).pipe(pluck("data")).subscribe((res:any) => {
    this.__transType = res;
  })
}

  getRcvForm(column_name: string | null = '', sort_by: string| null | '' = 'asc'){
    const __rcvFormSearch = new FormData();
  __rcvFormSearch.append('paginate',this.__pageNumber.value);
  __rcvFormSearch.append('trans_type_id',this.data.trans_type_id ? this.data.trans_type_id : '');
  __rcvFormSearch.append('product_id',this.data.product_id ? this.data.product_id : '');
  __rcvFormSearch.append('client_code',this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : '');
  __rcvFormSearch.append('recv_from',this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : '');
  __rcvFormSearch.append('sub_brk_cd',this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : '');
  __rcvFormSearch.append('euin_no',this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : '');
  __rcvFormSearch.append('temp_tin_no',this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : '');
  __rcvFormSearch.append('inv_type',this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : '');
  __rcvFormSearch.append('trans_type',this.__rcvForms.value.trans_type ? this.__rcvForms.value.trans_type  : '');
  __rcvFormSearch.append('bu_type',JSON.stringify(this.__rcvForms.value.bu_type));
  __rcvFormSearch.append('column_name',column_name);
  __rcvFormSearch.append('sort_by',sort_by);
  // __rcvFormSearch.append('kyc_status',JSON.stringify(this.__rcvForms.value.kyc_status));
  this.__dbIntr.api_call(1,'/formreceivedDetailSearch',__rcvFormSearch).pipe(map((x: any) => x.data)).subscribe((res: any) =>{
    this.__paginate = res.links;
    this.__RcvForms = new MatTableDataSource(res.data);
    this.__RcvForms._updateChangeSubscription();
    this.tableExport(column_name,sort_by);
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
  if (e.checked) {
    bu_type.push(new FormControl(e.source.value));
  } else {
    let i: number = 0;
    bu_type.controls.forEach((item: any) => {
      if (item.value == e.source.value) {
        bu_type.removeAt(i);
        return;
      }
      i++;
    });
  }
  this.__rcvForms.get('is_all_bu_type').setValue(
    bu_type.controls.length == 3 ? true : false,
    { emitEvent: false }
  );
}

getTransactionTypeDtls(){
  this.__dbIntr.api_call(0,
    '/formreceivedshow',
    ('product_id='+this.data.product_id
    + '&trans_type_id='+this.data.trans_type_id)).pipe(pluck("data")).subscribe(res => {
    this.__trans_types = res;
})
}

ngAfterViewInit(){


    // Temporary Tin Number
    this.__rcvForms.controls['temp_tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchTin('/formreceived', dt)
            : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__temp_tinMst = value;
          this.searchResultVisibilityForTempTin('block');
          this.__istemporaryspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => (this.__istemporaryspinner = false),
      });

        /**change Event of sub Broker Arn Number */
        this.__rcvForms.controls['sub_brk_cd'].valueChanges
        .pipe(
          tap(() => (this.__isSubArnPending = true)),
          debounceTime(200),
          distinctUntilChanged(),
          switchMap((dt) =>
            dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
          ),
          map((x: responseDT) => x.data)
        )
        .subscribe({
          next: (value) => {
            this.__subbrkArnMst = value;
            this.searchResultVisibilityForSubBrk('block');
            this.__isSubArnPending = false;
          },
          complete: () => console.log(''),
          error: (err) => {
            this.__isSubArnPending = false;
          },
        });

      // EUIN NUMBER SEARCH
      this.__rcvForms.controls['euin_no'].valueChanges
      .pipe(
        tap(() => (this.__isEuinPending = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/employee', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__euinMst = value;
          this.searchResultVisibility('block');
          this.__isEuinPending = false;
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isEuinPending = false;
        },
      });
      // End

  /** Client Code Change */
  this.__rcvForms.controls['client_code'].valueChanges
  .pipe(
    tap(() => (this.__isClientPending = true)),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1 ? this.__dbIntr.searchItems('/client', dt) : []
    ),
    map((x: any) => x.data)
  )
  .subscribe({
    next: (value) => {
      this.__clientMst = value.data;
      this.searchResultVisibilityForClient('block');
      this.__isClientPending = false;
    },
    complete: () => {},
    error: (err) => {
      this.__isClientPending = false;
    },
  });

  /** End */


  this.__rcvForms.controls['is_all_bu_type'].valueChanges.subscribe((res) => {
    const bu_type: FormArray = this.__rcvForms.get('bu_type') as FormArray;
    bu_type.clear();
    if (!res) {
      this.uncheckAll_buType();
    } else {
      this.__bu_type.forEach((__el) => {
        bu_type.push(new FormControl(__el.id));
      });
      this.checkAll_buType();
    }
  });

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
      'client_name',
      'rcv_datetime',
      'recv_from',
      'inv_type',
      'apl_no',
      'fol_no',
      'kyc_status'
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
uncheckAll_buType() {
  this.__buTypeChecked.forEach((element: any) => {
    element.checked = false;
  });
}
checkAll_buType() {
  this.__buTypeChecked.forEach((element: any) => {
    element.checked = true;
  });
}
tableExport(column_name: string | null = '', sort_by: string| null | '' = 'asc'){
  const __rcvFormExport = new FormData();
  __rcvFormExport.append('trans_type_id',this.data.trans_type_id ? this.data.trans_type_id : '');
  __rcvFormExport.append('product_id',this.data.product_id ? this.data.product_id : '');
  __rcvFormExport.append('client_code',this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : '');
  __rcvFormExport.append('recv_from',this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : '');
  __rcvFormExport.append('sub_brk_cd',this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : '');
  __rcvFormExport.append('euin_no',this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : '');
  __rcvFormExport.append('temp_tin_no',this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : '');
  __rcvFormExport.append('inv_type',this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : '');
  __rcvFormExport.append('trans_type',this.__rcvForms.value.trans_type ? this.__rcvForms.value.trans_type  : '');
  __rcvFormExport.append('bu_type',JSON.stringify(this.__rcvForms.value.bu_type));
  __rcvFormExport.append('column_name',column_name);
  __rcvFormExport.append('sort_by',sort_by);

  // __rcvFormExport.append('kyc_status',JSON.stringify(this.__rcvForms.value.kyc_status));
  this.__dbIntr.api_call(1,'/formreceivedExport',__rcvFormExport).pipe(map((x: any) => x.data)).subscribe((res: amc[]) =>{
    this.__export = new MatTableDataSource(res);
    this.__export._updateChangeSubscription();
  })
}
getRvcFormMaster(__paginate: string | null = "10"){
  this.__dbIntr.api_call(0, '/formreceived', 'paginate='+__paginate +
    ('&trans_type_id='+ this.data.trans_type_id +
    (this.data.type_id ? '&trans_id=' + this.data.type_id : ''))
    ).pipe(map((x: any) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
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
        + ('&trans_type_id=' + this.data.trans_type_id ? this.data.trans_type_id : '')
        + ('&product_id=' + this.data.product_id ? this.data.product_id : '')
        + ('&client_code=' + this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : '')
        + ('&recv_from=' + this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : '')
        + ('&sub_brk_cd=' + this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : '')
        + ('&euin_no=' + this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : '')
        + ('&temp_tin_no=' + this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : '')
        + ('&inv_type=' + this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : '')
        + ('&trans_type=' + this.__rcvForms.value.trans_type ? this.__rcvForms.value.trans_type  : '')
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
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  // dialogConfig.disableClose = true;
  // dialogConfig.hasBackdrop = false;
  dialogConfig.width =  "40%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data ={
     temp_tin_no:__element.temp_tin_no
  }
  try{
    const dialogref = this.__dialog.open(DeletercvComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if(dt){
        this.__RcvForms.data.splice(index,1);
        this.__RcvForms._updateChangeSubscription();
      }
    })
  }
  catch(ex){
  }
}
populateDT(__items){
const dialogConfig = new MatDialogConfig();
dialogConfig.autoFocus = false;
dialogConfig.width = '80%';
dialogConfig.id = (__items.trans_type_id == '4' ? ' NFO_' : (__items.trans_type_id == '1' ? ' - Financial_' : '- Non Financial_')) + __items.temp_tin_no.toString()
dialogConfig.hasBackdrop = false;
dialogConfig.disableClose = false;
dialogConfig.autoFocus = false;
dialogConfig.closeOnNavigation = false;
dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
try{
  dialogConfig.data = {
  flag:'RF',
  id: __items.temp_tin_no,
  title: 'Form Recievable ' + (__items.trans_type_id == '4' ? ' - NFO' :  (__items.trans_type_id == '1' ? ' - Financial' : '- Non Financial')) + ' ( ' +__items.temp_tin_no +  ' )' ,
  product_id:__items.product_id,
  trans_type_id:__items.trans_type_id,
  temp_tin_no:__items.temp_tin_no,
  data: __items,
  right:global.randomIntFromInterval(1,60)
};
   var dialogref;
  if(__items.trans_type_id == '4'){
    dialogref = this.__dialog.open(RcvformmodifyfornfoComponent, dialogConfig);
  }
  else if(__items.trans_type_id == '1'){
     dialogref = this.__dialog.open(RcvmodificationComponent, dialogConfig);
  }
  else{
    dialogref = this.__dialog.open(RcvfrmmodificationfornonfinComponent, dialogConfig);
  }
  dialogref.afterClosed().subscribe(dt => {
    if (dt) {
    }
  });
}
catch(ex){
  const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
  dialogRef.updateSize("80%");
  this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"RF"})
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


  outsideClickforSubBrkArn(__ev) {
    if (__ev) {
      this.searchResultVisibilityForSubBrk('none');
    }
  }

  outsideClickforClient(__ev) {
    if (__ev) {
      this.searchResultVisibilityForClient('none');
    }
  }

  outsideClick(__ev) {
    if (__ev) {
      this.searchResultVisibility('none');
    }
  }
  outsideClickfortempTin(__ev) {
    if (__ev) {
      this.searchResultVisibilityForTempTin('none');
    }
  }


  searchResultVisibilityForTempTin(display_mode) {
    this.__searchTempTin.nativeElement.style.display = display_mode;
  }
  /** Search Result Off against Sub Broker */
  searchResultVisibilityForSubBrk(display_mode) {
    this.__subBrkArn.nativeElement.style.display = display_mode;
  }
  searchResultVisibility(display_mode) {
    this.__searchRlt.nativeElement.style.display = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    this.__clientCode.nativeElement.style.display = display_mode;
  }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__rcvForms.controls['client_code'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
        case 'E':
            this.__rcvForms.controls['euin_no'].reset(__items.emp_name, {
            emitEvent: false,
        });
        this.searchResultVisibility('none');
        break;
      case 'T':
        this.__rcvForms.controls['temp_tin_no'].reset(__items.temp_tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTempTin('none');
        break;
      case 'S':
        this.__rcvForms.controls['sub_brk_cd'].reset(__items.code, {
          emitEvent: false,
        });
        this.searchResultVisibilityForSubBrk('none');
        break;
    }
  }
}
