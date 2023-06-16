import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
// import { DeletercvComponent } from '../deletercv/deletercv.component';
import { RcvmodificationComponent } from '../rcvModification/rcvModification.component';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import { RcvformmodifyfornfoComponent } from '../rcvFormModifyForNFO/rcvFormModifyForNFO.component';
import { RcvfrmmodificationfornonfinComponent } from '../rcvFormmodificationForNonFIn/rcvFrmModificationForNonFin.component';
import { client } from 'src/app/__Model/__clientMst';
import { dates } from 'src/app/__Utility/disabledt';
import { mfRcvClmns } from 'src/app/__Utility/MFColumns/rcvClmns';
import { DeletercvComponent } from '../deletercv/deletercv.component';
@Component({
  selector: 'rcvFormRpt-component',
  templateUrl: './rcvFormRpt.component.html',
  styleUrls: ['./rcvFormRpt.component.css'],
})
export class RcvformrptComponent implements OnInit {
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown(
    'euin_no',
    'emp_name',
    'Search EUIN',
    3
  );
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'brn_name',
    'Search Branch',
    3
  );
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'bu_type',
    'Search Business Type',
    3
  );
  settingsForRM = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'manager_name',
    'Search Relationship Manager',
    3
  );
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown(
    'code',
    'bro_name',
    'Search Sub Broker',
    3
  );

  displayMode_forClient: string;
  displayMode_forTemp_Tin: string;
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  toppings = new FormControl();
  toppingList: any = mfRcvClmns.CLOUMN_SELECTOR;
  __bu_type = buType;
  __export = new MatTableDataSource<any>([]);
  __isAdd: boolean = false;
  __isVisible: boolean = true;
  __isClientPending: boolean = false;
  __istemporaryspinner: boolean = false;
  __isAdv: boolean = false;
  __temp_tinMst: any = [];
  __subbrkArnMst: any = [];
  __brnchMst: any =[];
  __rmMst: any =[];
  __clientMst: client[] = [];
  __euinMst: any = [];
  __RcvForms = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __columns: string[] = [];
  __exportedClmns: string[] = [];
  __rcvForms = new FormGroup({
    options: new FormControl('2'),
    client_code: new FormControl(''),
    recv_from: new FormControl(''),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    euin_no: new FormControl([]),
    temp_tin_no: new FormControl(''),
    inv_type: new FormControl(''),
    trans_type: new FormControl(''),
    bu_type: new FormControl([],{updateOn:'blur'}),
    dt_type: new FormControl(''),
    start_dt: new FormControl(''),
    end_dt: new FormControl(''),
    advFilt_reset: new FormControl(''),
    rm_name: new FormControl([],{updateOn:'blur'}),
    branch: new FormControl([],{updateOn:'blur'}),
  });
  __transType: any = [];
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<RcvformrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {}
  __trans_types: any;
  ngOnInit() {
    this.getTransactionTypeDtls();
    this.setColumns('2');
    this.getTransactionType();
    this.getRcvForm();
  }

  setColumns(options) {
    const clmnsToRemove = ['edit', 'delete'];
    this.__columns =
      options == '2' ? mfRcvClmns.INITIAL_CLMNS : mfRcvClmns.DETAIL_CLMNS;
    this.__exportedClmns = this.__columns.filter(
      (x) => !clmnsToRemove.includes(x)
    );
    this.toppings.setValue(this.__columns);
  }
  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res;
      });
  }

  getRcvForm(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __rcvFormSearch = new FormData();
    __rcvFormSearch.append('paginate', this.__pageNumber.value);
    __rcvFormSearch.append(
      'trans_type_id',
      this.data.trans_type_id ? this.data.trans_type_id : ''
    );
    __rcvFormSearch.append(
      'product_id',
      this.data.product_id ? this.data.product_id : ''
    );
    __rcvFormSearch.append(
      'client_code',
      this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : ''
    );
    __rcvFormSearch.append(
      'recv_from',
      this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : ''
    );
    __rcvFormSearch.append(
      'sub_brk_cd',
      this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : ''
    );
    __rcvFormSearch.append(
      'euin_no',
      this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : ''
    );
    __rcvFormSearch.append(
      'temp_tin_no',
      this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : ''
    );
    __rcvFormSearch.append(
      'inv_type',
      this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : ''
    );
    __rcvFormSearch.append(
      'trans_type',
      this.__rcvForms.value.trans_type ? this.__rcvForms.value.trans_type : ''
    );
    __rcvFormSearch.append(
      'bu_type',
      JSON.stringify(this.__rcvForms.value.bu_type)
    );
    __rcvFormSearch.append('column_name', column_name);
    __rcvFormSearch.append('sort_by', sort_by);
    __rcvFormSearch.append('from_date', this.__rcvForms.getRawValue().start_dt);
    __rcvFormSearch.append('to_date', this.__rcvForms.getRawValue().end_dt);
    this.__dbIntr
      .api_call(1, '/formreceivedDetailSearch', __rcvFormSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__paginate = res.links;
        this.__RcvForms = new MatTableDataSource(res.data);
        this.__RcvForms._updateChangeSubscription();
        this.tableExport(column_name, sort_by);
      });
  }

  getTransactionTypeDtls() {
    this.__dbIntr
      .api_call(
        0,
        '/formreceivedshow',
        'product_id=' +
          this.data.product_id +
          '&trans_type_id=' +
          this.data.trans_type_id
      )
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__trans_types = res;
      });
  }

  getBranch(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
        console.log(res);
        this.__brnchMst = res;
    })
  }
  getRMmst(branch,buType){
    console.log(branch.length);

    if(branch.length > 0 && buType.length > 0){
      this.__dbIntr.api_call(0,'/relationalManager','branch='+JSON.stringify(branch)+'&bu_type='+JSON.stringify(buType))
      .pipe(pluck('data')).subscribe(res =>{
         this.__rmMst = res;
      })
    }
    else{
      this.__rmMst.length = 0;
    }

  }
  getEUINMst(branch,buType,sub_brk_cd,rmDtls){
    if(branch.length > 0
      && buType.length > 0
      && sub_brk_cd.length > 0
      && rmDtls.length > 0 ){
    this.__dbIntr.api_call(0,'/euin',
    'branch='+JSON.stringify(branch)
    +'&bu_type='+JSON.stringify(buType)
    +'&sub_brk_cd='+JSON.stringify(sub_brk_cd)
    +'&manager_name'+JSON.stringify(rmDtls)
    )
    .pipe(pluck('data')).subscribe(res =>{
       this.__euinMst = res;
    })
   }
   else{
    this.__euinMst.length = 0;
   }
  }

  getSubBrokerMst(branch,buType,rmDtls){
    if(branch.length > 0 && buType.length > 0 && rmDtls.length > 0){
    this.__dbIntr.api_call(0,'/subBroker',
    'branch='+JSON.stringify(branch)
    +'&bu_type='+JSON.stringify(buType)
    +'&manager_name'+JSON.stringify(rmDtls)
    )
    .pipe(pluck('data')).subscribe(res =>{
       this.__subbrkArnMst = res;
    })
   }
   else{
    this.__subbrkArnMst.length = 0;
   }
  }

  ngAfterViewInit() {
    this.__rcvForms.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__rcvForms.controls['start_dt'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__rcvForms.controls['end_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__rcvForms.controls['start_dt'].disable();
        this.__rcvForms.controls['end_dt'].disable();
      } else {
        this.__rcvForms.controls['start_dt'].enable();
        this.__rcvForms.controls['end_dt'].enable();
      }
    });

    this.__rcvForms.controls['advFilt_reset'].valueChanges.subscribe((res) => {
      console.log(res);
      if (res == 'R') {
        this.reset();
      } else {
        this.__isAdd = !this.__isAdd;
        if(this.__isAdd){
            this.getBranch();
        }
      }
    });

    // Temporary Tin Number
    this.__rcvForms.controls['temp_tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchTin('/formreceived', dt) : []
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
    this.__rcvForms.controls['sub_brk_cd'].valueChanges.subscribe((res) => {
      this.getEUINMst(this.__rcvForms.controls['branch'].value,this.__rcvForms.controls['bu_type'].value,
      res,this.__rcvForms.controls['rm_name'].value,
      );
    });
    /*** END */


     /*** Change Event on Relation Ship Manager */
    this.__rcvForms.controls['rm_name'].valueChanges.subscribe((res) => {
      this.getSubBrokerMst(this.__rcvForms.controls['branch'].value,
      this.__rcvForms.controls['bu_type'].value,
      res
      );
    });
    /** End */
    /*** Change Event on Branch */
    this.__rcvForms.controls['branch'].valueChanges.subscribe((res) => {
      this.getRMmst(res,this.__rcvForms.controls['bu_type'].value);

    });
    /** End */

     /*** Change Event on Business Type */
     this.__rcvForms.controls['bu_type'].valueChanges.subscribe((res) => {
      this.getRMmst(this.__rcvForms.controls['branch'].value,res);
     });
     /** End */

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

    this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(res);
    });
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit', 'delete'];
      this.__columns = res;
      this.__exportedClmns = res.filter((item) => !clm.includes(item));
    });
  }

  tableExport(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __rcvFormExport = new FormData();
    __rcvFormExport.append(
      'trans_type_id',
      this.data.trans_type_id ? this.data.trans_type_id : ''
    );
    __rcvFormExport.append(
      'product_id',
      this.data.product_id ? this.data.product_id : ''
    );
    __rcvFormExport.append(
      'client_code',
      this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : ''
    );
    __rcvFormExport.append(
      'recv_from',
      this.__rcvForms.value.recv_from ? this.__rcvForms.value.recv_from : ''
    );
    __rcvFormExport.append(
      'sub_brk_cd',
      this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : ''
    );
    __rcvFormExport.append(
      'euin_no',
      this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : ''
    );
    __rcvFormExport.append(
      'temp_tin_no',
      this.__rcvForms.value.temp_tin_no ? this.__rcvForms.value.temp_tin_no : ''
    );
    __rcvFormExport.append(
      'inv_type',
      this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : ''
    );
    __rcvFormExport.append(
      'trans_type',
      this.__rcvForms.value.trans_type ? this.__rcvForms.value.trans_type : ''
    );
    __rcvFormExport.append(
      'bu_type',
      JSON.stringify(this.__rcvForms.value.bu_type)
    );
    __rcvFormExport.append('column_name', column_name);
    __rcvFormExport.append('sort_by', sort_by);
    __rcvFormExport.append('from_date', this.__rcvForms.getRawValue().start_dt);
    __rcvFormExport.append('to_date', this.__rcvForms.getRawValue().end_dt);
    this.__dbIntr
      .api_call(1, '/formreceivedExport', __rcvFormExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: amc[]) => {
        this.__export = new MatTableDataSource(res);
        this.__export._updateChangeSubscription();
      });
  }
  getRvcFormMaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(
        0,
        '/formreceived',
        'paginate=' +
          __paginate +
          ('&trans_type_id=' +
            this.data.trans_type_id +
            (this.data.type_id ? '&trans_id=' + this.data.type_id : ''))
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  getval(__itemsPerPage) {
    this.__pageNumber.setValue(__itemsPerPage);
    this.submit();
  }
  getPaginate(__paginate) {
    console.log('ssss');
    console.log(this.__sortAscOrDsc.active);

    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&sort_by=' + this.__sortAscOrDsc.direction) +
            ('&column_name=' + this.__sortAscOrDsc.active) +
            ('&trans_type_id=' +
              (this.data.trans_type_id ? this.data.trans_type_id : '')) +
            ('&product_id=' +
              (this.data.product_id ? this.data.product_id : '')) +
            ('&client_code=' +
              (this.__rcvForms.value.client_code
                ? this.__rcvForms.value.client_code
                : '')) +
            ('&recv_from=' +
              (this.__rcvForms.value.recv_from
                ? this.__rcvForms.value.recv_from
                : '')) +
            ('&sub_brk_cd=' +
              (this.__rcvForms.value.sub_brk_cd
                ? this.__rcvForms.value.sub_brk_cd
                : '')) +
            ('&euin_no=' +
              (this.__rcvForms.value.euin_no
                ? this.__rcvForms.value.euin_no
                : '')) +
            ('&temp_tin_no=' +
              (this.__rcvForms.value.temp_tin_no
                ? this.__rcvForms.value.temp_tin_no
                : '')) +
            ('&inv_type=' +
              (this.__rcvForms.value.inv_type
                ? this.__rcvForms.value.inv_type
                : '')) +
            ('&trans_type=' +
              (this.__rcvForms.value.trans_type
                ? this.__rcvForms.value.trans_type
                : '')) +
            ('&bu_type=' + JSON.stringify(this.__rcvForms.value.bu_type)) +
            ('&from_date=' +
              global.getActualVal(this.__rcvForms.getRawValue().start_dt)) +
            ('&to_date=' +
              global.getActualVal(this.__rcvForms.getRawValue().end_dt))
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
  deleteRcvForm(__element, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    // dialogConfig.disableClose = true;
    // dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      temp_tin_no: __element.temp_tin_no,
    };
    try {
      const dialogref = this.__dialog.open(DeletercvComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          this.__RcvForms.data.splice(index, 1);
          this.__RcvForms._updateChangeSubscription();
        }
      });
    } catch (ex) {}
  }
  populateDT(__items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id =
      (__items.trans_type_id == '4'
        ? ' NFO_'
        : __items.trans_type_id == '1'
        ? ' - Financial_'
        : '- Non Financial_') + __items.temp_tin_no.toString();
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try {
      dialogConfig.data = {
        flag: 'RF',
        id: __items.temp_tin_no,
        title:
          'Form Recievable ' +
          (__items.trans_type_id == '4'
            ? ' - NFO'
            : __items.trans_type_id == '1'
            ? ' - Financial'
            : '- Non Financial') +
          ' ( ' +
          __items.temp_tin_no +
          ' )',
        product_id: __items.product_id,
        trans_type_id: __items.trans_type_id,
        temp_tin_no: __items.temp_tin_no,
        data: __items,
        right: global.randomIntFromInterval(1, 60),
      };
      var dialogref;
      if (__items.trans_type_id == '4') {
        dialogref = this.__dialog.open(
          RcvformmodifyfornfoComponent,
          dialogConfig
        );
      } else if (__items.trans_type_id == '1') {
        dialogref = this.__dialog.open(RcvmodificationComponent, dialogConfig);
      } else {
        dialogref = this.__dialog.open(
          RcvfrmmodificationfornonfinComponent,
          dialogConfig
        );
      }
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('80%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'RF',
      });
    }
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
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

  exportPdf() {
    this.__Rpt.downloadReport(
      '#rcvForm',
      {
        title: 'Receive Form ',
      },
      'Receive Form'
    );
  }

  submit() {
    this.getRcvForm(this.__sortAscOrDsc.active, this.__sortAscOrDsc.direction);
  }
  sortData(sort) {
    this.__sortAscOrDsc = sort;
    this.getRcvForm(this.__sortAscOrDsc.active, this.__sortAscOrDsc.direction);
  }
  reset() {
    this.__isAdd = false;
    this.__rcvForms.patchValue({
      start_dt: '',
      end_dt: '',
      dt_type: '',
      options: '2',
      recv_from: '',
      trans_type: '',
      advFilt_reset: '',
      euin_no:[],
      sub_brk_cd:[],
      branch:[],
      rm_name:[],
      bu_type:[]
    });
    this.__isAdd = false;
    this.__rcvForms.get('client_code').setValue('', { emitEvent: false });
    this.__rcvForms.get('temp_tin_no').setValue('', { emitEvent: false });
    this.__sortAscOrDsc = { active: '', direction: 'asc' };
    this.submit();
  }

  searchResultVisibilityForTempTin(display_mode) {
    this.displayMode_forTemp_Tin = display_mode;
  }
  searchResultVisibilityForClient(display_mode) {
    this.displayMode_forClient = display_mode;
  }
  getItems(__items, __mode) {
    switch (__mode) {
      case 'C':
        this.__rcvForms.controls['client_code'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.searchResultVisibilityForClient('none');
        break;
      case 'T':
        this.__rcvForms.controls['temp_tin_no'].reset(__items.temp_tin_no, {
          emitEvent: false,
        });
        this.searchResultVisibilityForTempTin('none');
        break;
    }
  }
  getSelectedItemsFromParent(event) {
    this.getItems(event.item, event.flag);
  }
}
