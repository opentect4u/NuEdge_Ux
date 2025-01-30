import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { amc } from 'src/app/__Model/amc';
import { rnt } from 'src/app/__Model/Rnt';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { nonFinAckClms } from 'src/app/__Utility/MFColumns/ack';
import { MfAckEntryComponent } from 'src/app/shared/core/Acknowledgement/MutualFundAcknowledgement/mf-ack-entry/mf-ack-entry.component';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { environment } from 'src/environments/environment';
import loggedStatus from '../../../../../../../../../../assets/json/loginstatus.json'
import  ItemsPerPage from '../../../../../../../../../../assets/json/itemsPerPage.json';
import { Table } from 'primeng/table';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'nonfinancial-acknowledgement',
  templateUrl: './nonfinancial-acknowledgement.component.html',
  styleUrls: ['./nonfinancial-acknowledgement.component.css']
})
export class NonfinancialAcknowledgementComponent implements OnInit {
  itemsPerPage = ItemsPerPage;
  @ViewChild('dt') primeTbl :Table;

  // sort = new sort();
  private _trans_type_id:number;
  @Input() 
  public get trans_type_id():number {
    return this._trans_type_id;
  }

  public set trans_type_id(transTypeId:number){
    if(transTypeId){
      this._trans_type_id = transTypeId;
      // console.log('lawra' + transTypeId);
      this.__transType = [];
      this.getTransactionType();
    }
  }
  selectBtn:selectBtn[] = [{ label: 'Advance Filter', value: 'A',icon:'pi pi-filter' }, { label: 'Reset', value: 'R',icon:'pi pi-refresh' }]

  transaction_id:number;
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforDropdown_forbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',1);
 settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
 settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',1);
  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isAmcPending: boolean = false;

  tinMst: any = [];
  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  @Input() amcMst: amc[] = [];

  schemeMst:scheme[]= []
  __transType: any = [];
  __bu_type:any=[];
  __rnt: rnt[];
  brnchMst: any=[];
  __RmMst: any=[];
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __ackForm = new FormGroup({
    btnType: new FormControl('R'),
    date_range:new FormControl(''),
    is_all_rnt: new FormControl(false),
    is_all_status: new FormControl(false),
    options: new FormControl('2'),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    tin_no: new FormControl(''),
    trans_type: new FormArray([]),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    logged_status: new FormArray([]),
    amc_name: new FormControl([]),
    scheme_id: new FormControl([]),
    inv_type: new FormControl(''),
    euin_no: new FormControl([]),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    bu_type: new FormControl([],{updateOn:'blur'}),
    rnt_name: new FormArray([]),
    cat_id: new FormControl(''),
    subcat_id: new FormControl(''),
    date_status: new FormControl('T'),
    // start_date: new FormControl(this.getTodayDate()),
    // end_date: new FormControl(this.getTodayDate()),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    login_status: new FormControl('N'),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    rm_id:new FormControl([],{updateOn:'blur'})
  });
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __columns:column[] = [];
  __ackMst = new MatTableDataSource<any>([]);
  constructor(
    // public dialogRef: MatDialogRef<ManualEntryForNonFinComponent>,
    private __utility: UtiliService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay,
    private sanitizer:DomSanitizer
  ) {}
  __isVisible: boolean = true;
  ngOnInit() {
    // this.setColumns();
    this.getRntMst();
    // this.getTransactionType();
    // this.getAmcMst();
    this.getLoggedinStatus();
  }
  getAmcMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res:amc[]) =>{
       this.amcMst = res;
    })
  }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
      res.forEach(el =>{
           this.rnt_name.push(this.addRntForm(el));
      })
    })
  }
  getTodayDate() {
    return dates.getTodayDate();
  }

  addRntForm(rnt:rnt){
    return new FormGroup({
      id:new FormControl(rnt ? rnt?.id : 0),
      name:new FormControl(rnt ? rnt.rnt_name : ''),
      isChecked: new FormControl(false)
    })
  }
  get rnt_name():FormArray{
    return this.__ackForm.get('rnt_name') as FormArray;
   }
   get logged_status(): FormArray{
    return this.__ackForm.get('logged_status') as FormArray
   }
  getLoggedinStatus(){
    loggedStatus.forEach(el =>{
    this.logged_status.push(this.addLoggedStatusForm(el));
    })
  }
  addLoggedStatusForm(loggedStatus){
    return new FormGroup({
      id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
      name:new FormControl(loggedStatus ? loggedStatus?.name : 0),
      value:new FormControl(loggedStatus ? loggedStatus.value : ''),
      isChecked:new FormControl(false),
    })
  }
  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setColumn(res[0]?.id);
        this.transaction_id = res[0].id;
        this.submitAck();
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
    
          /** Change event occur when all rnt checkbox has been changed  */
          this.__ackForm.controls['is_all_rnt'].valueChanges.subscribe(res =>{
            this.rnt_name.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
          })
          /** End */
    
          /** Change event inside the formArray */
          this.rnt_name.valueChanges.subscribe(res =>{
          this.__ackForm.controls['is_all_rnt'].setValue(res.every(item => item.isChecked),{emitEvent:false});
          })
          /*** End */
    
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
    
        // AMC SEARCH
        this.__ackForm.controls['amc_name'].valueChanges.subscribe(res =>{
          if(res.length > 0){
            this.getAMCwiseScheme(res);
          }
        })
        // End
    
        // EUIN NUMBER SEARCH
        this.__ackForm.controls['euin_no'].valueChanges.subscribe(res =>{})
        // End
    
        /**change Event of sub Broker Arn Number */
        this.__ackForm.controls['sub_brk_cd'].valueChanges.subscribe(res =>{console.log(res)})
    
        /** Client Code Change */
        this.__ackForm.controls['client_name'].valueChanges
          .pipe(
            tap(() => (this.__isClientPending = true,
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
            },
            complete: () => {},
            error: (err) => {
              this.__isClientPending = false;
            },
          });
    
        /** End */
    
        // Tin Number Search
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
    
        this.__ackForm.controls['date_status'].valueChanges.subscribe((res) => {
          if (res == 'T') {
            this.__ackForm.controls['start_date'].setValue('');
            this.__ackForm.controls['end_date'].setValue('');
          }
        });

       this.__ackForm.controls['brn_cd'].valueChanges.subscribe(res =>{
        this.getBusinessTypeMst(res)
      })
      this.__ackForm.controls['bu_type'].valueChanges.subscribe(res =>{
        this.disabledSubBroker(res);
         this.getRelationShipManagerMst(res,this.__ackForm.value.brn_cd);
      })
      this.__ackForm.controls['rm_id'].valueChanges.subscribe(res =>{
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
  disabledSubBroker(bu_type_ids){
    if(bu_type_ids.findIndex(item => item.bu_code == 'B') != -1){
      this.__ackForm.controls['sub_brk_cd'].enable();
    }
    else{
      this.__ackForm.controls['sub_brk_cd'].disable();
    }

  }
  getBusinessTypeMst(brn_cd){
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

  submitAck() {
    // const __ack = new FormData();
    // __ack.append('start_date', this.__ackForm.value.start_date);
    // __ack.append('end_date', this.__ackForm.value.end_date);
    // __ack.append('trans_type_id', this.data.trans_type_id);
    // __ack.append('paginate', this.__pageNumber.value);
    // __ack.append(
    //   'sub_brk_cd',
    //   this.__ackForm.value.sub_brk_cd ? this.__ackForm.value.sub_brk_cd : ''
    // );
    // __ack.append(
    //   'trans_type',
    //   this.__ackForm.value.trans_type.length > 0
    //     ? JSON.stringify(this.__ackForm.value.trans_type)
    //     : ''
    // );
    // __ack.append(
    //   'tin_no',
    //   this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : ''
    // );
    // __ack.append(
    //   'amc_name',
    //   this.__ackForm.value.amc_name ? this.__ackForm.value.amc_name : ''
    // );
    // __ack.append(
    //   'inv_type',
    //   this.__ackForm.value.inv_type ? this.__ackForm.value.inv_type : ''
    // );
    // __ack.append(
    //   'euin_no',
    //   this.__ackForm.value.euin_no ? this.__ackForm.value.euin_no : ''
    // );
    // __ack.append(
    //   'brn_cd',
    //   this.__ackForm.value.brn_cd ? this.__ackForm.value.brn_cd : ''
    // );
    // __ack.append(
    //   'rnt_name',
    //   this.__ackForm.value.rnt_name.length > 0
    //     ? JSON.stringify(this.__ackForm.value.rnt_name)
    //     : ''
    // );
    // __ack.append(
    //   'bu_type',
    //   this.__ackForm.value.bu_type.length > 0
    //     ? JSON.stringify(this.__ackForm.value.bu_type)
    //     : ''
    // );

    const __ack = new FormData();
    // __ack.append('paginate', this.__pageNumber.value);
    // __ack.append('option', this.__ackForm.value.option);
    __ack.append('trans_id',this.transaction_id.toString());
    __ack.append('trans_type_id' ,this.trans_type_id.toString());
    // __ack.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    // __ack.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __ack.append('ack_status',JSON.stringify(this.logged_status.value.filter(item => item.isChecked).map(res => {return res['id']})));
    __ack.append('from_date',this.__ackForm.getRawValue().start_date? this.__ackForm.getRawValue().start_date: '');
    __ack.append('to_date',this.__ackForm.getRawValue().end_date? this.__ackForm.getRawValue().end_date: '');
    __ack.append('client_code',this.__ackForm.value.client_code? this.__ackForm.value.client_code: '');
    __ack.append('tin_no',this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : '');
    __ack.append('amc_name',this.__ackForm.value.amc_name ? JSON.stringify(this.__ackForm.value.amc_name.map(item => {return item["id"]})) : '[]');
    __ack.append('scheme_name',this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]');
   __ack.append('rnt_name',JSON.stringify(this.rnt_name.value.filter(x=> x.isChecked).map(item => {return item['id']})));
      if(this.__ackForm.value.btnType == 'A'){
      __ack.append('sub_brk_cd',this.__ackForm.value.sub_brk_cd ? JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item["id"]})) : '[]');
      __ack.append('euin_no',this.__ackForm.value.euin_no ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item["id"]})) : '[]');
      __ack.append('brn_cd',this.__ackForm.value.brn_cd ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item["id"]})) : '[]');
       __ack.append('rm_id',this.__ackForm.value.rm_id ? JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item["id"]})) : '[]')
      __ack.append('bu_type',this.__ackForm.value.bu_type? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item["id"]})): '[]');
    }

    this.__dbIntr
      .api_call(1, '/ackDetailSearch', __ack)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setPaginator(res);
        // this.__paginate = res.links;
      });
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
  populateDT(__items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'P' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Upload Acknowledgement',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'ACKUPLNONFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0');
    try {
      const dialogref = this.__dialog.open(
        MfAckEntryComponent,
        dialogConfig
      );

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
        flag:
          'ACKUPLNOFIN_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getPaginate();
  }
  getPaginate(__paginate: any | null = null) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
          ('&paginate=' + this.__pageNumber.value) +
          ('&trans_type_id=' + this.trans_type_id) +
          ('&trans_id=' + this.transaction_id) +
            ('&client_code=' +
              (this.__ackForm.value.client_code
                ? this.__ackForm.value.client_code
                : '') +
                ('&ack_status=' + (JSON.stringify(this.logged_status.value.filter(item => item.isChecked).map(res => {return res['id']}))))
                +
                ('&rnt_name=' +
                (this.__ackForm.value.rnt_name.length > 0
                  ? JSON.stringify(this.rnt_name.value.filter(x=> x.isChecked).map(item => {return item['id']}))
                  : '')) +
              ('&tin_no=' +
                (this.__ackForm.value.tin_no
                  ? this.__ackForm.value.tin_no
                  : '')) +
              ('&amc_name=' +
                (this.__ackForm.value.amc_name
                  ? JSON.stringify(this.__ackForm.value.amc_name.map(item => {return item['id']}))
                  : '[]')) +
              ('&scheme_name=' +
                (this.__ackForm.value.scheme_id
                  ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item['id']}))
                  : '')) +
              ('&from_date=' +
                global.getActualVal(this.__ackForm.getRawValue().start_date)) +
              ('&to_date=' + global.getActualVal(this.__ackForm.getRawValue().end_date))
              + (this.__ackForm.value.btnType == 'A' ? (('&euin_no=' +
                (this.__ackForm.value.euin_no
                  ? JSON.stringify(this.__ackForm.value.euin_no.map(item => {return item['id']}))
                  : '[]')) +
              ('&sub_brk_cd=' +
                (this.__ackForm.value.sub_brk_cd
                  ? JSON.stringify(this.__ackForm.value.sub_brk_cd.map(item => {return item['id']}))
                  : '[]')) +
              ('&brn_cd=' +
                (this.__ackForm.value.brn_cd
                  ? JSON.stringify(this.__ackForm.value.brn_cd.map(item => {return item['id']}))
                  : '[]')) +
                  ('&rm_id='+
                  JSON.stringify(this.__ackForm.value.rm_id.map(item => {return item['id']}))
                )+
              ('&bu_type=' +
                (this.__ackForm.value.bu_type
                  ? JSON.stringify(this.__ackForm.value.bu_type.map(item => {return item['id']}))
                  : '[]')))  : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    } else {
      this.__dbIntr
        .api_call(0, '/mfTraxShow', 'paginate=' + this.__pageNumber)
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    }
  }
  setPaginator(res) {
    this.__ackMst = new MatTableDataSource(res);
    // this.__paginate = res.links;
  }
  updateRow(row_obj) {
    this.__ackMst.data = this.__ackMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off;
          value.ack_status = row_obj.ack_status;
          value.rnt_login_dt = row_obj.rnt_login_dt;
          value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1];
          value.ack_copy_scan = `${row_obj.ack_copy_scan}`;
          value.form_status = row_obj.form_status;
          value.ack_remarks = row_obj.ack_remarks;
      }
      return true;
    });
  }
  finalSubmitAck() {
    if(this.__ackMst.data.length == 0){}
    else{
    const __finalSubmit = new FormData();
    __finalSubmit.append('trans_type_id', this.trans_type_id.toString());
    this.__dbIntr
      .api_call(1, '/ackFinalSubmit', __finalSubmit)
      .subscribe((res: any) => {
        this.__utility.showSnackbar(res?.data.length > 0 ? 'Mail sent successfully' : 'Mail already sent successfully',res?.data.length > 0 ? res.suc : 2)

      });
    }
  }

  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  searchResultVisibilityForTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
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
  close(ev){
    this.__ackForm.patchValue({
      start_date: this.__ackForm.getRawValue().date_range ? dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[0]) : '',
      end_date: this.__ackForm.getRawValue().date_range ? (global.getActualVal(this.__ackForm.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__ackForm.getRawValue().date_range[1]) : '') : ''
     });
  }
  getSelectedItemsFromParent(res){
    this.getItems(res.item,res.flag)
  }
  getBranchMst(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
      this.brnchMst = res
  })
  }
  onselectItem(ev){
    this.submitAck();
  }
  TabDetails(ev){
    this.transaction_id = ev.tabDtls.id;
    this.setColumn( ev.tabDtls.id);
    // this.submitAck();
    this.reset();
   }
   setColumns(){
   this.__columns = nonFinAckClms.SUMMARY_COPY;
   }
   setColumn(trns_id){
    const clm = ['edit','app_frm_view'];
    var columnsMst;
    switch(trns_id){
      case 32:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CMOH);
              break;
      case 22:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.AC);
              break;
      case 18:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.COCD);
              break;
      case 23:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CON);
      break;
      case 16:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CBU);
      break;
      case 15:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.COBK);
      break;
      case 33:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.FCM);
      break;
      case 14:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.COB);
      break;
      case 11:
      case 21:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.NA_OR_NC);break;
      case 30: columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.SWPR);break;
      case 31:columnsMst  =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.STP_REGISTRATION);break;
      case 19:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.TRANSMISSION);break
      case 29:columnsMst =global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.REDEMPTION);break
      case 36:
      case 37:
      case 38:columnsMst = global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.PAUSE)
              break;
      case 7:
      case 8:
      case 9:columnsMst = global.getColumnsAfterMerge(nonFinAckClms.COLUMN_SELECTOR,nonFinAckClms.CANCELATION)
              break;
      default:columnsMst = nonFinAckClms.COLUMN_SELECTOR
              break;
    }
    // this.columns = columnsMst;
      this.__columns = columnsMst;
     
    //  this.Selected nClmns =  this.__columns.map(item => {return item['field']}).filter(x => !clm.includes(x));
  }
   customSort(ev){
    // this.sort.order = ev.sortOrder;
    // this.sort.field = ev.sortField;
    if(ev.sortField){
     this.submitAck();
    }
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.getBranchMst();
   }
   else{
      this.reset()
   }
  }
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }
  filterGlobal($event){
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
}
  reset() {
    this.__RmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.__ackForm.patchValue({
      date_range:'',
      option:'2',
      client_code:'',
      scheme_id:[],
      frm_dt:'',
      to_dt:'',
      rm_id:[],
       btnType:'R'
    });
    this.__ackForm.get('amc_name').setValue([],{emitEvent:false});
    this.schemeMst.length = 0;
    this.__ackForm.get('dt_type').setValue('',{emitEvent:false});
    this.__ackForm.get('client_name').setValue('',{emitEvent:false});
    this.__ackForm.get('tin_no').setValue('',{emitEvent:false});
    this.__ackForm.get('is_all_rnt').setValue(false);
    this.__ackForm.get('is_all_status').setValue(false);
    this.__ackForm.get('brn_cd').reset([],{emitEvent:false});
    this.__ackForm.get('bu_type').reset([],{emitEvent:false});
    this.__ackForm.get('rm_id').reset([],{emitEvent:false});
    this.__ackForm.get('sub_brk_cd').reset([],{emitEvent:false});
    this.__ackForm.get('euin_no').reset([],{emitEvent:false});
    // this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.submitAck();
  }
}
