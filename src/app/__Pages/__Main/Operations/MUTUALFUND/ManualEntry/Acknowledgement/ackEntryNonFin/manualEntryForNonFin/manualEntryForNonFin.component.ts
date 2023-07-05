import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../../assets/json/buisnessType.json';
import { rnt } from 'src/app/__Model/Rnt';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { dates } from 'src/app/__Utility/disabledt';
import { MfAckEntryComponent } from 'src/app/shared/core/Acknowledgement/MutualFundAcknowledgement/mf-ack-entry/mf-ack-entry.component';
import { scheme } from 'src/app/__Model/__schemeMst';
import loggedStatus from '../../../../../../../../../assets/json/loginstatus.json'
import { sort } from 'src/app/__Model/sort';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { column } from 'src/app/__Model/tblClmns';
import { nonFinAckClms } from 'src/app/__Utility/MFColumns/ack';
import  ItemsPerPage from '../../../../../../../../../assets/json/itemsPerPage.json';

@Component({
  selector: 'app-manualEntryForNonFin',
  templateUrl: './manualEntryForNonFin.component.html',
  styleUrls: ['./manualEntryForNonFin.component.css'],
})
export class ManualEntryForNonFinComponent implements OnInit {
  itemsPerPage = ItemsPerPage;

  sort = new sort();
  transaction_id:number;
  @ViewChild('searchTin') __searchTin: ElementRef;
  @ViewChild('clientCd') __clientCode: ElementRef;
  settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
  settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  settingsforDropdown_forbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',1);
  settingsforBuTypeDropdown = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Business Type',1);
 settingsforRMDropdown = this.__utility.settingsfroMultiselectDropdown('id','rm_name','Search Relationship Manager',1);
 settingsforSubBrkDropdown = this.__utility.settingsfroMultiselectDropdown('id','sub_brk_cd','Search Sub Broker',1);
 settingsforEuinDropdown = this.__utility.settingsfroMultiselectDropdown('id','emp_name','Search Employee',1);
  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  __isSubArnPending: boolean = false;
  __isEuinPending: boolean = false;
  __isAmcPending: boolean = false;

  tinMst: any = [];
  __clientMst: client[] = [];
  __subbrkArnMst: any = [];
  __euinMst: any = [];
  amcMst: amc[] = [];
  schemeMst:scheme[]= []
  __transType: any = [];
  __bu_type:any=[];
  __rnt: rnt[];
  brnchMst: any=[];
  __RmMst: any=[];
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __ackForm = new FormGroup({
    dt_type:new FormControl(''),
    btnType: new FormControl('R'),
    logged_status: new FormArray([]),
    date_range: new FormControl(''),
    is_all_rnt: new FormControl(false),
    is_all_status: new FormControl(false),
    start_date: new FormControl(dates.getTodayDate()),
    end_date: new FormControl(dates.getTodayDate()),
    sub_brk_cd: new FormControl([]),
    tin_no: new FormControl(''),
    trans_type: new FormArray([]),
    client_code: new FormControl(''),
    client_name:new FormControl(''),
    amc_name: new FormControl([],{updateOn:'blur'}),
    scheme_id: new FormControl([]),
    inv_type: new FormControl(''),
    euin_no: new FormControl(''),
    brn_cd: new FormControl([]),
    bu_type: new FormControl([]),
    rnt_name: new FormArray([]),
    rm_id:new FormControl([])
  });
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __columns:column[] = [];
  __ackMst = new MatTableDataSource<any>([]);
  constructor(
    public dialogRef: MatDialogRef<ManualEntryForNonFinComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay,
    private sanitizer:DomSanitizer
  ) {}
  __isVisible: boolean = true;
  ngOnInit() {
    this.setColumns();
    this.getRntMst();
    this.getTransactionType();
    this.getAmcMst();
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
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
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
  private getAMCwiseScheme(amc_ids){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc_ids.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res:scheme[]) =>{
      this.schemeMst = res;
    })
   }
  ngAfterViewInit() {
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
    // AMC SEARCH
    this.__ackForm.controls['amc_name'].valueChanges.subscribe(res =>{
      this.getAMCwiseScheme(res);
    })


    this.__ackForm.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__ackForm.controls['date_range'].reset(
         res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
       );
       this.__ackForm.controls['start_date'].reset(
         res && res != 'R' ? ((dates.calculateDT(res))) : ''
       );
       this.__ackForm.controls['end_date'].reset(
         res && res != 'R' ? dates.getTodayDate() : ''
       );

       if (res && res != 'R') {
         this.__ackForm.controls['date_range'].disable();
       } else {
         this.__ackForm.controls['date_range'].enable();
       }
     });

    // EUIN NUMBER SEARCH
    // this.__ackForm.controls['euin_no'].valueChanges
    //   .pipe(
    //     tap(() => (this.__isEuinPending = true)),
    //     debounceTime(200),
    //     distinctUntilChanged(),
    //     switchMap((dt) =>
    //       dt?.length > 1 ? this.__dbIntr.searchItems('/employee', dt) : []
    //     ),
    //     map((x: responseDT) => x.data)
    //   )
    //   .subscribe({
    //     next: (value) => {
    //       this.__euinMst = value;
    //       this.searchResultVisibility('block');
    //       this.__isEuinPending = false;
    //     },
    //     complete: () => console.log(''),
    //     error: (err) => {
    //       this.__isEuinPending = false;
    //     },
    //   });
    // End

    /**change Event of sub Broker Arn Number */
    // this.__ackForm.controls['sub_brk_cd'].valueChanges
    //   .pipe(
    //     tap(() => (this.__isSubArnPending = true)),
    //     debounceTime(200),
    //     distinctUntilChanged(),
    //     switchMap((dt) =>
    //       dt?.length > 1 ? this.__dbIntr.searchItems('/showsubbroker', dt) : []
    //     ),
    //     map((x: responseDT) => x.data)
    //   )
    //   .subscribe({
    //     next: (value) => {
    //       this.__subbrkArnMst = value;
    //       this.searchResultVisibilityForSubBrk('block');
    //       this.__isSubArnPending = false;
    //     },
    //     complete: () => console.log(''),
    //     error: (err) => {
    //       this.__isSubArnPending = false;
    //     },
    //   });

    /** Client Code Change */
    this.__ackForm.controls['client_name'].valueChanges
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
    __ack.append('paginate', this.__pageNumber.value);
    // __ack.append('option', this.__ackForm.value.option);
    __ack.append('trans_id',this.transaction_id.toString());
    __ack.append('trans_type_id' ,this.data.trans_type_id);
    __ack.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __ack.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
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
        this.setPaginator(res.data);
        this.__paginate = res.links;
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
          ('&trans_type_id=' + this.data.trans_type_id) +
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
    this.__paginate = res.links;
  }
  updateRow(row_obj) {
    this.__ackMst.data = this.__ackMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        (value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off),
          (value.rnt_login_dt = row_obj.rnt_login_dt),
          (value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1]),
          (value.ack_copy_scan = `${row_obj.ack_copy_scan}`),
          (value.form_status = row_obj.form_status),
          (value.ack_remarks = row_obj.ack_remarks);
      }
      return true;
    });
  }
  finalSubmitAck() {
    const __finalSubmit = new FormData();
    __finalSubmit.append('trans_type_id', this.data.trans_type_id);
    this.__dbIntr
      .api_call(1, '/ackFinalSubmit', __finalSubmit)
      .subscribe((res: any) => {
        this.__utility.showSnackbar(res.msg, res.suc);
      });
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
    this.submitAck();
   }
   setColumns(){
   this.__columns = nonFinAckClms.SUMMARY_COPY;
   }
   customSort(ev){
    this.sort.order = ev.sortOrder;
    this.sort.field = ev.sortField;
    if(ev.sortField){
     this.submitAck();
    }
  }
}
