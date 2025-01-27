import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { client } from 'src/app/__Model/__clientMst';
import { scheme } from 'src/app/__Model/__schemeMst';
import { amc } from 'src/app/__Model/amc';
import { column } from 'src/app/__Model/tblClmns';
import { UtiliService } from 'src/app/__Services/utils.service';
import { sort } from 'src/app/__Model/sort';
import ItemsPerPage from '../../../../../../../../../../assets/json/itemsPerPage.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import loggedStatus from '../../../../../../../../../../assets/json/loginstatus.json'
import { dates } from 'src/app/__Utility/disabledt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { global } from 'src/app/__Utility/globalFunc';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { MfAckEntryComponent } from 'src/app/shared/core/Acknowledgement/MutualFundAcknowledgement/mf-ack-entry/mf-ack-entry.component';
import { MfackClmns } from 'src/app/__Utility/MFColumns/ack';
import { Table } from 'primeng/table';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'financial-acknowledgement',
  templateUrl: './financial-acknowledgement.component.html',
  styleUrls: ['./financial-acknowledgement.component.css']
})
export class FinancialAcknowledgementComponent implements OnInit {
  itemsPerPage = ItemsPerPage;
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]
  brnchMst: any=[];
  __subbrkArnMst: any = [];
  @ViewChild('dt') primeTbl :Table;
  @Input() product_id:number = 1;
  __euinMst: any = [];
  clmList:column[] = [];

  private _trans_type_id:number;
  @Input() 
  public get trans_type_id():number {
    return this._trans_type_id;
  }

  public set trans_type_id(transTypeId:number){
    if(transTypeId){
      this._trans_type_id = transTypeId;
      this.__transType = [];
      this.getTransactionType();
    }
  }


  sort = new sort();
  settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  transaction_id:number;
  __ackForm = new FormGroup({
    is_all: new FormControl(false),
    is_all_status: new FormControl(false),
    logged_status: new FormArray([]),
    tin_no: new FormControl(''),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    date_range: new FormControl(''),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    rnt_id: new FormArray([]),
    amc_id: new FormControl([],{updateOn:'blur'}),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    rm_id: new FormControl([],{updateOn:'blur'}),
    bu_type: new FormControl([],{updateOn:'blur'}),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    euin_no: new FormControl([]),
    options: new FormControl('2'),
    btnType: new FormControl('R'),
    scheme_id:new FormControl([])
})
  // @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;
  // @ViewChildren('trnsTypeChecked')
  // private __trnsTypeChecked: QueryList<ElementRef>;
  // @ViewChildren('rntChecked') private __rntChecked: QueryList<ElementRef>;

  // @ViewChild('searchTin') __searchTin: ElementRef;
  // @ViewChild('clientCd') __clientCode: ElementRef;
  // @ViewChild('searchEUIN') __searchRlt: ElementRef;
  // @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  // @ViewChild('searchAMC') __AmcSearch: ElementRef;

  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  // __isSubArnPending: boolean = false;
  // __isEuinPending: boolean = false;
  // __isAmcPending: boolean = false;
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  tinMst: any = [];
  __clientMst: client[] = [];
  // __subbrkArnMst: any = [];
  // __euinMst: any = [];
  @Input() amcMst: amc[] = [];
  __RmMst: any =[];

  settingsforDropdown_forbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',1);
 settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
 settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);

  schemeMst:scheme[] =[];
  __transType: any = [];
  // __bu_type = buType;
  // __rnt: rnt[];
  __bu_type: any =[];

  __columns:column[] =[];
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  // __ackForm = new FormGroup({
  //   is_all_bu_type: new FormControl(false),
  //   is_all_trns_type: new FormControl(false),
  //   is_all_rnt: new FormControl(false),
  //   start_date: new FormControl(dates.getTodayDate()),
  //   end_date: new FormControl(dates.getTodayDate()),
  //   sub_brk_cd: new FormControl(''),
  //   tin_no: new FormControl(''),
  //   trans_type: new FormArray([]),
  //   client_code: new FormControl(''),
  //   amc_name: new FormControl(''),
  //   inv_type: new FormControl(''),
  //   euin_no: new FormControl(''),
  //   brn_cd: new FormControl(''),
  //   bu_type: new FormArray([]),
  //   rnt_name: new FormArray([]),
  // });
  // __columns: string[] = [
  //   'edit',
  //   'sl_no',
  //   'temp_tin_no',
  //   'rnt_name',
  //   'bu_type',
  //   'arn_no',
  //   'euin_no',
  //   'first_client_name',
  //   'first_client_code',
  //   'first_client_pan',
  // ];
  __ackMst = new MatTableDataSource<any>([]);
  constructor(
    // public dialogRef: MatDialogRef<ManualentrforackfinComponent>,
    private __utility: UtiliService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay,
    private sanitizer: DomSanitizer
  ) {}
  __isVisible: boolean = true;
  ngOnInit() {
    this.getRntMst();
    // this.getAMCMst();
     this.getLoggedinStatus();
  }
  setColumn(trans_id){
    this.__columns =  (trans_id == 2 || trans_id == 5)  ? global.getColumnsAfterMerge(MfackClmns.Summary_common,MfackClmns.Summary_Sip)
   : global.getColumnsAfterMerge(MfackClmns.Summary_common,MfackClmns.Summary_Pip_Switch)

  }
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }

  getLoggedinStatus(){
    loggedStatus.forEach(el =>{
    this.logged_status.push(this.addLoggedStatusForm(el));
    })
  }
  getAMCMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
      this.amcMst = res;
    })
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
      res.forEach(el =>{
           this.rnt_id.push(this.addRntForm(el));
      })
    })
  }
  get logged_status(): FormArray{
    return this.__ackForm.get('logged_status') as FormArray
   }
   addLoggedStatusForm(loggedStatus){
    return new FormGroup({
      id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
      name:new FormControl(loggedStatus ? loggedStatus?.name : 0),
      value:new FormControl(loggedStatus ? loggedStatus.value : ''),
      isChecked:new FormControl(false),
    })
  }
  get rnt_id():FormArray{
    return this.__ackForm.get('rnt_id') as FormArray;
   }
   addRntForm(rnt:rnt){
    return new FormGroup({
      id:new FormControl(rnt ? rnt?.id : 0),
      name:new FormControl(rnt ? rnt.rnt_name : ''),
      isChecked: new FormControl(false)
    })
  }
  filterGlobal($event){
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
}
  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/transction', ('product_id=' +this.product_id +'&trans_type_id=' + this.trans_type_id))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setColumns(res[0].id,1);
        this.transaction_id = res[0].id;
        // this.getAckRpt();
        this.reset();
        this.__transType = res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
  }
  private getAMCwiseScheme(amc_ids){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc_ids.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res:scheme[]) =>{
      this.schemeMst = res;
    })
   }


   changeWheelSpeed(container, speedY) {
    var scrollY = 0;
    var handleScrollReset = function() {
        scrollY = container.scrollTop;
    };
    var handleMouseWheel = function(e) {
        e.preventDefault();
        scrollY += speedY * e.deltaY
        if (scrollY < 0) {
            scrollY = 0;
        } else {
            var limitY = container.scrollHeight - container.clientHeight;
            if (scrollY > limitY) {
                scrollY = limitY;
            }
        }
        container.scrollTop = scrollY;
    };

    var removed = false;
    container.addEventListener('mouseup', handleScrollReset, false);
    container.addEventListener('mousedown', handleScrollReset, false);
    container.addEventListener('mousewheel', handleMouseWheel, false);

    return function() {
        if (removed) {
            return;
        }
        container.removeEventListener('mouseup', handleScrollReset, false);
        container.removeEventListener('mousedown', handleScrollReset, false);
        container.removeEventListener('mousewheel', handleMouseWheel, false);
        removed = true;
    };
}

  ngAfterViewInit() {
    const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
    this.changeWheelSpeed(el, 0.99);
    
    this.__ackForm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__ackForm.controls['date_range'].reset(
         res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
       );
       this.__ackForm.controls['frm_dt'].reset(
         res && res != 'R' ? ((dates.calculateDT(res))) : ''
       );
       this.__ackForm.controls['to_dt'].reset(
         res && res != 'R' ? dates.getTodayDate() : ''
       );
 
       if (res && res != 'R') {
         this.__ackForm.controls['date_range'].disable();
       } else {
         this.__ackForm.controls['date_range'].enable();
       }
     });
       /** Change event occur when all rnt checkbox has been changed  */
       this.__ackForm.controls['is_all'].valueChanges.subscribe(res =>{
         this.rnt_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
       })
       /** End */
 
       /** Change event inside the formArray */
       this.rnt_id.valueChanges.subscribe(res =>{
       this.__ackForm.controls['is_all'].setValue(res.every(item => item.isChecked),{emitEvent:false});
       })
       /*** End */
 
 
       /** Change event occur when all rnt checkbox has been changed  */
       this.__ackForm.controls['is_all_status'].valueChanges.subscribe(res =>{
         this.logged_status.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
       })
       /** End */
 
       /** Change event inside the formArray */
       this.logged_status.valueChanges.subscribe(res =>{
       this.__ackForm.controls['is_all_status'].setValue(res.every(item => item.isChecked),{emitEvent:false});
       })
       /*** End */
 
     this.__ackForm.controls['amc_id'].valueChanges.subscribe((res) => {
        this.getAMCwiseScheme(res);
     })
 
   //   // AMC SEARCH
   //   this.__rcvForms.controls['amc_name'].valueChanges
   //     .pipe(
   //       tap(() => (this.__isAmcPending = true)),
   //       debounceTime(200),
   //       distinctUntilChanged(),
   //       switchMap((dt) =>
   //         dt?.length > 1 ? this.__dbIntr.searchItems('/amc', dt) : []
   //       ),
   //       map((x: responseDT) => x.data)
   //     )
   //     .subscribe({
   //       next: (value) => {
   //         this.amcMst = value;
   //         this.searchResultVisibilityForAMC('block');
   //         this.__isAmcPending = false;
   //       },
   //       complete: () => console.log(''),
   //       error: (err) => {
   //         this.__isAmcPending = false;
   //       },
   //     });
   //   // End
 
   //   // EUIN NUMBER SEARCH
   //   this.__rcvForms.controls['euin_no'].valueChanges
   //     .pipe(
   //       tap(() => (this.__isEuinPending = true)),
   //       debounceTime(200),
   //       distinctUntilChanged(),
   //       switchMap((dt) =>
   //         dt?.length > 1 ? this.__dbIntr.searchItems('/employee', dt) : []
   //       ),
   //       map((x: responseDT) => x.data)
   //     )
   //     .subscribe({
   //       next: (value) => {
   //         this.__euinMst = value;
   //         this.searchResultVisibility('block');
   //         this.__isEuinPending = false;
   //       },
   //       complete: () => console.log(''),
   //       error: (err) => {
   //         this.__isEuinPending = false;
   //       },
   //     });
   //   // End
 
   //   /**change Event of sub Broker Arn Number */
   //   this.__rcvForms.controls['sub_brk_cd'].valueChanges
   //     .pipe(
   //       tap(() => (this.__isSubArnPending = true)),
   //       debounceTime(200),
   //       distinctUntilChanged(),
   //       switchMap((dt) =>
   //         dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
   //       ),
   //       map((x: responseDT) => x.data)
   //     )
   //     .subscribe({
   //       next: (value) => {
   //         this.__subbrkArnMst = value;
   //         this.searchResultVisibilityForSubBrk('block');
   //         this.__isSubArnPending = false;
   //       },
   //       complete: () => console.log(''),
   //       error: (err) => {
   //         this.__isSubArnPending = false;
   //       },
   //     });
 
   //   /** Client Code Change */
     this.__ackForm.controls['client_name'].valueChanges
       .pipe(
         tap(() => (
          this.__isClientPending = true,
          this.__ackForm.get('client_code').setValue('')
        )),
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
           this.__ackForm.get('client_code').setValue('');
         },
         complete: () => {},
         error: (err) => {
           this.__isClientPending = false;
         },
       });
 
   //   /** End */
 
   //   // Tin Number Search
     this.__ackForm.controls['tin_no'].valueChanges
       .pipe(
         tap(() => (this.__isTinspinner = true)),
         debounceTime(200),
         distinctUntilChanged(),
         switchMap((dt) =>
           dt?.length > 1 ? this.__dbIntr.ReportTINSearch('/mfTraxShow', dt) : []
         ),
         map((x: responseDT) => x.data)
       )
       .subscribe({
         next: (value) => {
           this.tinMst = value;
           this.searchResultVisibilityForTin('block');
           this.__isTinspinner = false;
         },
         complete: () => console.log(''),
         error: (err) => (this.__isTinspinner = false),
       });
 
   //   this.__rcvForms.controls['is_all_bu_type'].valueChanges.subscribe((res) => {
   //     const bu_type: FormArray = this.__rcvForms.get('bu_type') as FormArray;
   //     bu_type.clear();
   //     if (!res) {
   //       this.uncheckAll_buType();
   //     } else {
   //       this.__bu_type.forEach((__el) => {
   //         bu_type.push(new FormControl(__el.id));
   //       });
   //       this.checkAll_buType();
   //     }
   //   });
 
   //   this.__rcvForms.controls['is_all_trns_type'].valueChanges.subscribe(
   //     (res) => {
   //       const trns_type: FormArray = this.__rcvForms.get(
   //         'trans_type'
   //       ) as FormArray;
   //       trns_type.clear();
   //       if (!res) {
   //         this.uncheckAll_trnsType();
   //       } else {
   //         this.__transType.forEach((__el) => {
   //           trns_type.push(new FormControl(__el.id));
   //         });
   //         this.checkAll_trnsType();
   //       }
   //     }
   //   );
 
   //   this.__rcvForms.controls['is_all_rnt'].valueChanges.subscribe((res) => {
   //     const rntName: FormArray = this.__rcvForms.get('rnt_name') as FormArray;
   //     rntName.clear();
   //     if (!res) {
   //       this.uncheckAll_rnt();
   //     } else {
   //       this.__rnt.forEach((__el) => {
   //         rntName.push(new FormControl(__el.id));
   //       });
   //       this.checkAll_rnt();
   //     }
   //   });
 
   //   this.__rcvForms.controls['date_status'].valueChanges.subscribe((res) => {
   //     if (res == 'T') {
   //       this.__rcvForms.controls['start_date'].setValue('');
   //       this.__rcvForms.controls['end_date'].setValue('');
   //     }
   //   });
   //   this.toppings.valueChanges.subscribe((res) => {
   //     const clm = ['edit'];
   //     this.__columns = res;
   //     this.__exportedClmns = res.filter((item) => !clm.includes(item));
   //   });
 
   this.__ackForm.controls['brn_cd'].valueChanges.subscribe(res =>{
     this.getBusinessTypeMst(res)
   })
   this.__ackForm.controls['bu_type'].valueChanges.subscribe(res =>{
     this.disabledSubBroker(res);
      this.getRelationShipManagerMst(res,this.__ackForm.value.brn_cd);
   })
   this.__ackForm.controls['rm_id'].valueChanges.subscribe(res =>{
    console.log(this.__ackForm.value.bu_type);
     if(this.__ackForm.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
              this.getSubBrokerMst(res);
     }
     else{
      this.__euinMst.length = 0;
       this.__euinMst = res;
       this.__ackForm.controls['euin_no'].setValue([]);
       this.__ackForm.controls['sub_brk_cd'].setValue([]);
     }
  })
  this.__ackForm.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
   // if(res.length > 0){
     this.setEuinDropdown(res,this.__ackForm.value.rm_id);
   // }
  })
  }
  setEuinDropdown(sub_brk_cd,rm){
    // this.__euinMst.length = 0;
    console.log(sub_brk_cd);

   this.__euinMst = rm.filter(item => !this.__subbrkArnMst.map(item=> {return item['emp_euin_no']}).includes(item.euin_no));
   if(sub_brk_cd.length > 0){
    sub_brk_cd.forEach(element => {
           if(this.__subbrkArnMst.findIndex((el) => element.code == el.code) != -1){
              this.__euinMst.push(
                {
                  euin_no:this.__subbrkArnMst[this.__subbrkArnMst.findIndex((el) => element.code == el.code)].euin_no,
                  emp_name:''
                }
                );
           }
    });
   }
   else{
     this.__euinMst = this.__euinMst.filter(item => !this.__subbrkArnMst.map(item => {return item['euin_no']}).includes(item.euin_no))
   }
  }
  getSubBrokerMst(arr_euin_no){
    if(arr_euin_no.length > 0){
    this.__dbIntr.api_call(0,'/subbroker',
    'arr_euin_no='+ JSON.stringify(arr_euin_no.map(item => {return item['euin_no']})))
    .pipe(pluck("data")).subscribe((res: any) =>{
      this.__subbrkArnMst = res.map(({code,bro_name,emp_euin_no,euin_no}) => ({
      code,
      emp_euin_no,
      euin_no,
      bro_name:bro_name +'-'+code
      })
      );
    })
  }
  else{
    this.__subbrkArnMst.length =0;
    this.__ackForm.controls['sub_brk_cd'].setValue([]);
  }

  }
  getRelationShipManagerMst(bu_type_id,arr_branch_id){
    if(bu_type_id.length > 0 && arr_branch_id.length > 0){
    this.__dbIntr.api_call(0,'/employee',
    'arr_bu_type_id='+ JSON.stringify(bu_type_id.map(item => {return item['bu_code']}))
    +'&arr_branch_id=' + JSON.stringify(arr_branch_id.map(item  => {return item['id']}))
    ).pipe(pluck("data"))
    .subscribe(res =>{
         this.__RmMst = res;
    })
  }
  else{
    this.__RmMst.length =0;
    this.__ackForm.controls['rm_id'].reset([]);
  }
  }
  getBusinessTypeMst(brn_cd){
    console.log(brn_cd);
    if(brn_cd.length > 0){
    this.__dbIntr
    .api_call(0,'/businessType','arr_branch_id='+JSON.stringify(brn_cd.map(item => {return item['id']})))
    .pipe(pluck("data")).subscribe(res =>{
            this.__bu_type = res;
    })
  }
  else{
    this.__ackForm.controls['bu_type'].reset([],{emitEvent:true});
    this.__bu_type.length = 0;
  }
  }

  // uncheckAll_buType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_buType() {
  //   this.__buTypeChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }

  // uncheckAll_trnsType() {
  //   this.__trnsTypeChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_trnsType() {
  //   this.__trnsTypeChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }

  // uncheckAll_rnt() {
  //   this.__rntChecked.forEach((element: any) => {
  //     element.checked = false;
  //   });
  // }
  // checkAll_rnt() {
  //   this.__rntChecked.forEach((element: any) => {
  //     element.checked = true;
  //   });
  // }
  disabledSubBroker(bu_type_ids){
    if(bu_type_ids.findIndex(item => item.bu_code == 'B') != -1){
      this.__ackForm.controls['sub_brk_cd'].enable();
    }
    else{
      this.__ackForm.controls['sub_brk_cd'].disable();
    }

  }

  getAckRpt(){
    const __ack = new FormData();
    // __ack.append('paginate', this.__pageNumber.value);
    // __ack.append('option', this.__ackForm.value.options);
    __ack.append('trans_id',this.transaction_id.toString());
    __ack.append('trans_type_id' ,this.trans_type_id.toString());
    // __ack.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    // __ack.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __ack.append('ack_status',JSON.stringify(this.logged_status.value.filter(item => item.isChecked).map(res => {return res['id']})));
    __ack.append('from_date',this.__ackForm.getRawValue().frm_dt? this.__ackForm.getRawValue().frm_dt: '');
    __ack.append('to_date',this.__ackForm.getRawValue().to_dt? this.__ackForm.getRawValue().to_dt: '');
    __ack.append('client_code',this.__ackForm.value.client_code? this.__ackForm.value.client_code: '');
    __ack.append('tin_no',this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : '');
    __ack.append('amc_name',this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]');
    __ack.append('scheme_name',this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]');
   __ack.append('rnt_name',JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']})));
   if(this.__ackForm.value.btnType == 'A'){
    __ack.append('sub_brk_cd',this.__ackForm.value.sub_brk_cd ? JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item["code"]})) : '[]');
    __ack.append('euin_no',this.__ackForm.value.euin_no ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["euin_no"]})) : '[]');
    __ack.append('brn_cd',this.__ackForm.value.brn_cd ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]})) : '[]');
     __ack.append('rm_id',this.__ackForm.value.rm_id ? JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item["euin_no"]})) : '[]')
    __ack.append('bu_type',this.__ackForm.value.bu_type? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["bu_code"]})): '[]');
  }
  this.__dbIntr
      .api_call(1, '/ackDetailSearch', __ack)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setPaginator(res);
        // this.__paginate = res?.links;
      });
  }

  submitAck() {
     this.getAckRpt();
    // __ack.append(
    //   'bu_type',
    //   this.__ackForm.value.bu_type.length > 0
    //     ? JSON.stringify(this.__ackForm.value.bu_type)
    //     : ''
    // );

    // this.__dbIntr
    //   .api_call(1, '/ackDetailSearch', __ack)
    //   .pipe(pluck('data'))
    //   .subscribe((res: any) => {
    //     this.setPaginator(res.data);
    //     this.__paginate = res.links;
    //   });
  }
  populateDT(__items) {
    console.log(__items);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'ACKUPL',
      isViewMode: __items.form_status == 'P' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Upload Acknowledgement',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'ACKUPL_' + __items.tin_no ? __items.tin_no.toString() : '0';
    try {
      const dialogref = this.__dialog.open(MfAckEntryComponent,dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          this.updateRow(dt.data);
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'ACKUPL',
      });
    }
  }
  // getval(__paginate) {
  //   this.__pageNumber.setValue(__paginate.toString());
  //   this.getPaginate();
  // }
  getPaginate(__paginate: any | null = null) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            // (this.data.trans_id ? '&trans_id=' + this.data.trans_id : '') +
            ('&option=' + this.__ackForm.value.options) +
            ('&trans_type_id=' + this.trans_type_id) +
            ('&trans_id=' + this.transaction_id.toString()) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
            ('&client_code=' + (this.__ackForm.value.client_code ? this.__ackForm.value.client_code : '')) +
            // ('&sub_brk_cd=' + (this.__ackForm.value.sub_brk_cd ? this.__ackForm.value.sub_brk_cd : '')) +
            ('&tin_no=' + (this.__ackForm.value.tin_no? this.__ackForm.value.tin_no : '')) +
            ('&amc_name=' + (this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]')) +
            // ('&euin_no=' +(this.__ackForm.value.euin_no ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["id"]})) : '[]')) +
            // ('&brn_cd=' + (this.__ackForm.value.brn_cd ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]})) : '[]')) +
            ('&ack_status=' + JSON.stringify(this.logged_status.value.filter(item => item.isChecked).map(res => {return res['id']}))) +

            ('&rnt_name=' + (this.__ackForm.value.rnt_id ? JSON.stringify(this.__ackForm.value.rnt_id.filter(x=> x.isChecked).map(item => {return item["id"]})) : '[]'))
            // ('&bu_type' + (this.__ackForm.value.bu_type ? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["id"]})) : '[]')) +
            // ('&rm_id' + (this.__ackForm.value.rn_id ? JSON.stringify(this.__ackForm.value.rn_id.map(item => {return item["id"]})) : '[]'))
            + ('&from_date=' + global.getActualVal(this.__ackForm.getRawValue().frm_dt))
            + ('&to_date=' + global.getActualVal(this.__ackForm.getRawValue().to_dt))
            +('&scheme_name='+  JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})))

        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__ackMst = new MatTableDataSource(res);
          this.__paginate = res.links;
        });
    } else {

    }
  }
  setPaginator(res) {
    this.__ackMst = new MatTableDataSource(res);
    // this.__paginate = res.links;
  }
  updateRow(row_obj) {
    this.__ackMst.data = this.__ackMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        // if(row_obj?.ack_status == 'P'){
        //   return false;
        // }
        value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off;
          value.ack_status = row_obj.ack_status;
          value.rnt_login_dt = row_obj.rnt_login_dt;
          value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1];
          value.ack_copy_scan = `${row_obj.ack_copy_scan}`;
          value.form_status = row_obj.form_status;
          value.ack_remarks = row_obj.ack_remarks
      }
      return true;
    });
  }
  finalSubmitAck() {
    const __finalSubmit = new FormData();
    __finalSubmit.append('trans_type_id', this.trans_type_id.toString());
    __finalSubmit.append('trans_id', this.transaction_id.toString());

    this.__dbIntr
      .api_call(1, '/ackFinalSubmit', __finalSubmit)
      .subscribe((res: any) => {
        this.__utility.showSnackbar(res.msg, res.suc);
      });
  }
  // onbuTypeChange(e: any) {
  //   const bu_type: FormArray = this.__ackForm.get('bu_type') as FormArray;
  //   if (e.checked) {
  //     bu_type.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     bu_type.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         bu_type.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__ackForm
  //     .get('is_all_bu_type')
  //     .setValue(bu_type.controls.length == 3 ? true : false, {
  //       emitEvent: false,
  //     });
  // }
  // onrntTypeChange(e: any) {
  //   const rnt_name: FormArray = this.__ackForm.get('rnt_name') as FormArray;
  //   if (e.checked) {
  //     rnt_name.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     rnt_name.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         rnt_name.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__ackForm
  //     .get('is_all_rnt')
  //     .setValue(rnt_name.controls.length == 3 ? true : false, {
  //       emitEvent: false,
  //     });
  // }

  // ontrnsTypeChange(e: any) {
  //   const trans_type: FormArray = this.__ackForm.get('trans_type') as FormArray;
  //   if (e.checked) {
  //     trans_type.push(new FormControl(e.source.value));
  //   } else {
  //     let i: number = 0;
  //     trans_type.controls.forEach((item: any) => {
  //       if (item.value == e.source.value) {
  //         trans_type.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.__ackForm
  //     .get('is_all_trns_type')
  //     .setValue(trans_type.controls.length == 3 ? true : false, {
  //       emitEvent: false,
  //     });
  // }
  // getTodayDate() {
  //   return dates.getTodayDate();
  // }
  // getMinDate() {
  //   return dates.getminDate();
  // }

  // outsideClickforSubBrkArn(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForSubBrk('none');
  //   }
  // }
  // outsideClick(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibility('none');
  //   }
  // }
  // outsideClickForAMC(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForAMC('none');
  //   }
  // }
  // searchResultVisibility(display_mode) {
  //   this.__searchRlt.nativeElement.style.display = display_mode;
  // }
  // /** Search Result Off against Sub Broker */
  // searchResultVisibilityForSubBrk(display_mode) {
  //   this.__subBrkArn.nativeElement.style.display = display_mode;
  // }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  searchResultVisibilityForTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
  // searchResultVisibilityForAMC(display_mode) {
  //   this.__AmcSearch.nativeElement.style.display = display_mode;
  // }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__ackForm.controls['client_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__ackForm.controls['client_code'].reset(__items.id);
        this.searchResultVisibilityForClient('none');
        break;
      case 'T':
        this.__ackForm.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;

    }
  }
  TabDetails(ev){
    console.log(ev);
    if(ev.index >= 0){
      this.transaction_id = ev.tabDtls.id;
      this.setColumns(this.transaction_id,1)
      this.reset();

      // this.getAckRpt();
      console.log('trsns' + this.transaction_id);
      // this.setColumn(this.transaction_id);
      // 
    }
   }

   setColumns(trans_id,option){
    var clmn;
    const clmnToRmv = ['edit','app_frm_view']
    switch(trans_id.toString()){
      case '4' :
      case '1' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Pip); break;
      case '5' :
      case '2' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Sip); break;
      case '6' :
      case '3' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Switch); break;
      case '35' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_nfoCombo); break;
    }
   this.clmList = clmn
   if(option == 2){
        this.__columns = (trans_id == 2 || trans_id == 5) ? global.getColumnsAfterMerge(MfackClmns.Summary_common.filter(item => item.field!='edit') ,MfackClmns.Summary_Sip)
        : global.getColumnsAfterMerge(MfackClmns.Summary_common.filter(item => item.field!='edit') ,MfackClmns.Summary_Pip_Switch)
   }
   else{
    this.__columns = this.clmList;
   }
  //  this.__columns = option == '2' ? MfackClmns.Summary.filter(item => item.field!='edit') : this.clmList;
  //  this.SelectedClms = this.__columns.map(x => x.field);
  //  this.__exportedClmns = this.__columns.filter(x => !clmnToRmv.includes(x.field)).map(item => {return item['field']});

  }
   close(ev){
    this.__ackForm.patchValue({
      frm_dt: this.__ackForm.getRawValue().date_range ? dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[0]) : '',
      to_dt: this.__ackForm.getRawValue().date_range ? (global.getActualVal(this.__ackForm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[1]) : '') : ''
     });
   }
   getSelectedItemsFromParent(res){
    this.getItems(res.item,res.flag)
  }
  customSort(ev){
    this.sort.order = ev.sortOrder;
    this.sort.field = ev.sortField;
    if(ev.sortField){
     this.getAckRpt();
    }
  }
  DocumentView(element){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '80%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      title: 'Uploaded Scan Copy',
      data: element,
      copy_url:`${environment.app_formUrl + element.app_form_scan}`,
      src:this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.app_formUrl + element.app_form_scan}`)
    };
    const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
  }
  onselectItem(__itemsPerPage) {
    // this.__pageNumber.setValue(__itemsPerPage.option.value);
    this.getAckRpt();
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
       this.getBranchMst();
    }
    else{
      //Reset
      this.reset();
    }

  }
  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
        this.brnchMst = res
    })
  }
  reset(){
    this.__RmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.__ackForm.get('client_name').setValue('',{emitEvent:false});
    this.__ackForm.get('tin_no').setValue('',{emitEvent:false});
    this.__ackForm.patchValue({
      options:2,
      date_range:'',
      dt_type:'',
      frm_dt:'',
      to_dt:'',
      scheme_id:[],
      client_code: '',
      btnType:'R'
    })

    this.__ackForm.get('brn_cd').reset([],{emitEvent:false});
    this.__ackForm.get('bu_type').reset([],{emitEvent:false});
    this.__ackForm.get('rm_id').reset([],{emitEvent:false});
    this.__ackForm.get('sub_brk_cd').reset([],{emitEvent:false});
    this.__ackForm.get('euin_no').reset([],{emitEvent:false});
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.__ackForm.get('amc_id').setValue([],{emitEvent:false});
    this.schemeMst.length = 0;
    this.__ackForm.get('is_all').setValue(false);
    this.__ackForm.get('is_all_status').setValue(false);
    this.submitAck();
  }
}
