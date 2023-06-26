import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
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
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import buType from '../../../../../../../../../../assets/json/buisnessType.json';
import { global } from 'src/app/__Utility/globalFunc';
import { ManualUpdateEntryForMFComponent } from 'src/app/shared/manual-update-entry-for-mf/manual-update-entry-for-mf.component';
import { client } from 'src/app/__Model/__clientMst';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import updateStatus from '../../../../../../../../../../assets/json/updateStatus.json';
import { sort } from 'src/app/__Model/sort';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import { column } from 'src/app/__Model/tblClmns';
import ItemsPerPage from '../../../../../../../../../../assets/json/itemsPerPage.json';
import { MfackClmns } from 'src/app/__Utility/MFColumns/ack';
@Component({
  selector: 'app-search-rpt',
  templateUrl: './search-rpt.component.html',
  styleUrls: ['./search-rpt.component.css'],
})
export class SearchRPTComponent implements OnInit {
  itemsPerPage = ItemsPerPage;
  __columns:column[] = []
  sort = new sort();
  transaction_id: number;
  __ackForm = new FormGroup({
    is_all: new FormControl(false),
    is_all_status: new FormControl(false),
    update_status_id: new FormArray([]),
    tin_no: new FormControl(''),
    client_code: new FormControl(''),
    client_name: new FormControl(''),
    date_range: new FormControl(''),
    dt_type: new FormControl(''),
    frm_dt: new FormControl(''),
    to_dt: new FormControl(''),
    rnt_id: new FormArray([]),
    amc_id: new FormControl([],{updateOn:'blur'}),
    brn_cd: new FormControl([]),
    rm_id: new FormControl([]),
    bu_type: new FormControl([]),
    sub_brk_cd: new FormControl([]),
    euin_no: new FormControl([]),
    options: new FormControl('2'),
    btnType: new FormControl('R'),
    scheme_id:new FormControl([])
})
settingsforDropdown_foramc = this.__utility.settingsfroMultiselectDropdown('id','amc_name','Search AMC',1);
settingsforDropdown_forscheme = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',1);
  // @ViewChildren('buTypeChecked') private __buTypeChecked: QueryList<ElementRef>;
  // @ViewChildren('trnsTypeChecked')
  // private __trnsTypeChecked: QueryList<ElementRef>;
  // @ViewChildren('rntChecked') private __rntChecked: QueryList<ElementRef>;

  // @ViewChild('searchTin') __searchTin: ElementRef;
  // @ViewChild('clientCd') __clientCode: ElementRef;
  // @ViewChild('searchEUIN') __searchRlt: ElementRef;
  // @ViewChild('subBrkArn') __subBrkArn: ElementRef;
  // @ViewChild('searchAMC') __AmcSearch: ElementRef;
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __isTinspinner: boolean = false;
  __isClientPending: boolean = false;
  // __isSubArnPending: boolean = false;
  // __isEuinPending: boolean = false;
  // __isAmcPending: boolean = false;

  tinMst: any = [];
  __clientMst: client[] = [];
  // __subbrkArnMst: any = [];
  // __euinMst: any = [];
  amcMst: amc[] = [];
  schemeMst:scheme[] = [];
  __transType: any = [];
  // __bu_type = buType;
  // __rnt: rnt[];

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
    public dialogRef: MatDialogRef<SearchRPTComponent>,
    private __utility: UtiliService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private __dbIntr: DbIntrService,
    public __dialog: MatDialog,
    private overlay: Overlay,
    private sanitizer: DomSanitizer
  ) {}
  __isVisible: boolean = true;
  ngOnInit() {
  //   this.submitAck();
    this.getRntMst();
    this.getTransactionType();
    this.getupdateStatus();
    this.getAmcMst();
  }
  // getRnt() {
  //   this.__dbIntr
  //     .api_call(0, '/rnt', null)
  //     .pipe(pluck('data'))
  //     .subscribe((res: rnt[]) => {
  //       this.__rnt = res;
  //     });
  // }
  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/transction', ('product_id=' +this.data.product_id +'&trans_type_id=' + this.data.trans_type_id))
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType =res.map(({id,trns_name}) => ({
          id,
          tab_name:trns_name,
          img_src:id == 1 ? '../../../../../assets/images/pip.png'
          : (id == 2 ? '../../../../../assets/images/sip.png'
          : '../../../../../assets/images/switch.png')}));
      });
  }
  TabDetails(ev){
    this.transaction_id = ev.tabDtls.id;
    this.submitAck();
    this.setColumns(this.transaction_id,this.__ackForm.value.options)
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
  get rnt_id():FormArray{
    return this.__ackForm.get('rnt_id') as FormArray;
   }
   get update_status_id(): FormArray{
    return this.__ackForm.get('update_status_id') as FormArray
   }
  getupdateStatus(){
    updateStatus.forEach(el =>{
    this.update_status_id.push(this.addUpdateStatusForm(el));
    })
  }
  addUpdateStatusForm(loggedStatus){
    return new FormGroup({
      id:new FormControl(loggedStatus ? loggedStatus?.id : 0),
      name:new FormControl(loggedStatus ? loggedStatus?.name : 0),
      value:new FormControl(loggedStatus ? loggedStatus.value : ''),
      isChecked:new FormControl(false),
    })
  }
  getAmcMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res: amc[]) =>{
      this.amcMst = res;
    })
  }
  ngAfterViewInit() {
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
         this.update_status_id.controls.map(item => {return item.get('isChecked').setValue(res,{emitEvent:false})});
       })
       /** End */

       /** Change event inside the formArray */
       this.update_status_id.valueChanges.subscribe(res =>{
       this.__ackForm.controls['is_all_status'].setValue(res.every(item => item.isChecked),{emitEvent:false});
       })
       /*** End */
       this.__ackForm.controls['amc_id'].valueChanges.subscribe((res) => {
        this.getAMCwiseScheme(res);
     })
  //   // AMC SEARCH
  //   this.__ackForm.controls['amc_name'].valueChanges
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
  //   this.__ackForm.controls['euin_no'].valueChanges
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
  //   this.__ackForm.controls['sub_brk_cd'].valueChanges
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

  }
  private getAMCwiseScheme(amc_ids){
    this.__dbIntr.api_call(0,'/scheme','arr_amc_id='+JSON.stringify(amc_ids.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res:scheme[]) =>{
      this.schemeMst = res;
    })
   }
  getRntMst(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res:rnt[]) =>{
      res.forEach(el =>{
           this.rnt_id.push(this.addRntForm(el));
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
  submitAck() {
    const __mfTrax = new FormData();
    __mfTrax.append('paginate', this.__pageNumber.value);
    __mfTrax.append('option', this.__ackForm.value.options);
    __mfTrax.append('trans_id',this.transaction_id.toString());
    __mfTrax.append('trans_type_id' ,this.data.trans_type_id);
    __mfTrax.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __mfTrax.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __mfTrax.append('update_status_id',JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})));
    __mfTrax.append('from_date',this.__ackForm.getRawValue().frm_dt? this.__ackForm.getRawValue().frm_dt: '');
    __mfTrax.append('to_date',this.__ackForm.getRawValue().to_dt? this.__ackForm.getRawValue().to_dt: '');
    __mfTrax.append('client_code',this.__ackForm.value.client_code? this.__ackForm.value.client_code: '');
    __mfTrax.append('tin_no',this.__ackForm.value.tin_no ? this.__ackForm.value.tin_no : '');
    __mfTrax.append('amc_name',this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]');
    __mfTrax.append('scheme_name',this.__ackForm.value.scheme_id ? JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})) : '[]');
   __mfTrax.append('rnt_name',JSON.stringify(this.rnt_id.value.filter(x=> x.isChecked).map(item => {return item['id']})));

    this.__dbIntr
      .api_call(1, '/manualUpdateDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
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
      flag: 'MUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      isViewMode: __items.form_status == 'A' ? false : true,
      tin: __items.tin_no,
      tin_no: __items.tin_no,
      title: 'Manual Update For NFO',
      right: global.randomIntFromInterval(1, 60),
      data: __items,
    };
    dialogConfig.id =
      'FDMUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0');
    try {
      const dialogref = this.__dialog.open(
        ManualUpdateEntryForMFComponent,
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
        flag: 'MUNFO_' + (__items.tin_no ? __items.tin_no.toString() : '0'),
      });
    }
  }
  // getval(__paginate) {
  //   this.__pageNumber.setValue(__paginate.toString());
  //   this.getPaginate();
  // }
  getPaginate(__paginate: any | null = null) {
    if (__paginate) {
      this.__dbIntr
          .getpaginationData(
            __paginate.url +
              ('&paginate=' + this.__pageNumber.value) +
              ('&option=' + this.__ackForm.value.options) +
              ('&trans_type_id=' + this.data.trans_type_id) +
              ('&trans_id=' + this.transaction_id.toString()) +
              ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
              ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1')) +
              ('&client_code=' + (this.__ackForm.value.client_code ? this.__ackForm.value.client_code : '')) +
              ('&tin_no=' + (this.__ackForm.value.tin_no? this.__ackForm.value.tin_no : '')) +
              ('&amc_name=' + (this.__ackForm.value.amc_id ? JSON.stringify(this.__ackForm.value.amc_id.map(item => {return item["id"]})) : '[]')) +
              ('&rnt_name=' + (this.__ackForm.value.rnt_id ? JSON.stringify(this.__ackForm.value.rnt_id.filter(x=> x.isChecked).map(item => {return item["id"]})) : '[]'))
              +('&update_status_id='+JSON.stringify(this.update_status_id.value.filter(item => item.isChecked).map(res => {return res['id']})))
              + ('&from_date=' +global.getActualVal(this.__ackForm.getRawValue().frm_dt)) +
              ('&to_date=' +global.getActualVal(this.__ackForm.getRawValue().to_dt)) +
              ('&scheme_name='+JSON.stringify(this.__ackForm.value.scheme_id.map(item => {return item["id"]})))

            )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__ackMst = new MatTableDataSource(res.data);
          this.__paginate = res.links;
        });
    } else {
    }
  }
  setPaginator(res) {
    this.__ackMst = new MatTableDataSource(res);
    this.__paginate = res.links;
  }
  updateRow(row_obj) {
    this.__ackMst.data = this.__ackMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
        value.manual_update_remarks = row_obj.manual_update_remarks;
        value.pending_reason = row_obj.pending_reason;
        value.reject_reason_id = row_obj.reject_reason_id;
        value.contact_per_email = row_obj.contact_per_email;
        value.contact_per_phone = row_obj.contact_per_phone;
        value.contact_per_name = row_obj.contact_per_name;
        value.contact_via = row_obj.contact_via;
        value.contact_to_comp = row_obj.contact_to_comp;
        value.folio_no = row_obj.folio_no;
        value.process_date = row_obj.process_date;
        value.manual_trans_status = row_obj.manual_trans_status;
        value.reject_memo = row_obj.reject_memo;
        value.upload_soa = row_obj.upload_soa;
        value.form_status = row_obj.form_status;
      }
      return true;
    });
  }
  // finalSubmitAck() {
  //   const __finalSubmit = new FormData();
  //   __finalSubmit.append('trans_type_id', this.data.trans_type_id);
  //   this.__dbIntr
  //     .api_call(1, '/ackFinalSubmit', __finalSubmit)
  //     .subscribe((res: any) => {
  //       this.__utility.showSnackbar(res.msg, res.suc);
  //     });
  // }
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

  // outsideClickforTin(__ev) {
  //   if (__ev) {
  //     this.searchResultVisibilityForTin('none');
  //   }
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
      // case 'A':
      //   this.__ackForm.controls['amc_name'].reset(__items.amc_name, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForAMC('none');
      //   break;
      case 'C':
        this.__ackForm.controls['client_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__ackForm.controls['client_code'].reset(__items.id);
        this.searchResultVisibilityForClient('none');
        break;
      // case 'E':
      //   this.__ackForm.controls['euin_no'].reset(__items.emp_name, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibility('none');
      //   break;
      case 'T':
        this.__ackForm.controls['tin_no'].reset(__items.tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTin('none');
        break;
      // case 'S':
      //   this.__ackForm.controls['sub_brk_cd'].reset(__items.code, {
      //     emitEvent: false,
      //   });
      //   this.searchResultVisibilityForSubBrk('none');
      //   break;
    }
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
     this.submitAck();
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
    this.submitAck();
  }
  setColumns(trans_id,option){
  //   var clmn;
  //   const clmnToRmv = ['edit','app_frm_view']
  //   switch(trans_id.toString()){
  //     case '1' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Pip); break;
  //     case '2' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Sip); break;
  //     case '3' : clmn =  global.getColumnsAfterMerge(MfackClmns.Deatils,MfackClmns.Columns_for_Switch); break;
  //   }
  //  this.clmList = clmn;
   this.__columns =  MfackClmns.Summary;
  //  this.SelectedClms = this.__columns.map(x => x.field);
  //  this.__exportedClmns = this.__columns.filter(x => !clmnToRmv.includes(x.field)).map(item => {return item['field']});
  }
}
