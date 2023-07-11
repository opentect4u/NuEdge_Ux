import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {FormControl, FormGroup } from '@angular/forms';
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
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import { RcvFormCrudComponent } from '../rcv-form-crud/rcv-form-crud.component';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import insBuType from '../../../../../../../../assets/json/insuranceBuType.json';
import { insRcvFrmClmns } from 'src/app/__Utility/InsuranceColumns/rcvClmns';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-rcv-form-rpt',
  templateUrl: './rcv-form-rpt.component.html',
  styleUrls: ['./rcv-form-rpt.component.css'],
})
export class RcvFormRPTComponent implements OnInit {
  isOpenMegaMenu:boolean = false;
  settingsForEUIN = this.__utility.settingsfroMultiselectDropdown('euin_no','euin_no','Search Employee',3);
  settingsForbrnch = this.__utility.settingsfroMultiselectDropdown('id','brn_name','Search Branch',3 );
  settingsForbuType = this.__utility.settingsfroMultiselectDropdown('bu_code','bu_type','Search Business Type',3);
  settingsForInsType = this.__utility.settingsfroMultiselectDropdown('id','type','Search Type Of Insurance',2);
  settingsForinsbuType = this.__utility.settingsfroMultiselectDropdown('id','bu_type','Search Insurance Business Type',2);
  settingsForRM = this.__utility.settingsfroMultiselectDropdown('euin_no','emp_name','Search Relationship Manager',2);
  settingsForsubCode = this.__utility.settingsfroMultiselectDropdown('code','bro_name','Search Sub Broker',1);
  settingsFortrnsType = this.__utility.settingsfroMultiselectDropdown('id','trans_name','Search Transaction Type',1)
  insuranceBuType = insBuType
  displayMode_forTemp_Tin:string;
  displayMode_forClient:string;
  __brnchMst: any =[];
  __rmMst: any =[];
  sort = new sort();
  itemsPerPage:selectBtn[] = itemsPerPage;
  selectBtn:selectBtn[] = filterOpt
  __isClientPending: boolean = false;
  __istemporaryspinner: boolean = false;
  __clientMst: client[] = [];
  __euinMst: any = [];
  __temp_tinMst: any = [];
  __subbrkArnMst: any = [];
  __bu_type:any;
  __kycStatus: any = [
    { id: 'Y', status: 'With KYC' },
    { id: 'N', status: 'Without KYC' },
  ];
  __export = new MatTableDataSource<any>([]);
  __isAdd: boolean = false;
  __isVisible: boolean = true;
  __RcvForms = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __columns: any = [];
  ColumnList = insRcvFrmClmns.Detail_column;
  __exportedClmns: string[] = [];
  SelectedClmn:string[] =[];
  __rcvForms = new FormGroup({
    options: new FormControl('2'),
    proposer_code: new FormControl(''),
    proposer_name: new FormControl(''),
    recv_from: new FormControl(''),
    sub_brk_cd: new FormControl([],{updateOn:'blur'}),
    euin_no: new FormControl([]),
    temp_tin_no: new FormControl(''),
    bu_type: new FormControl([],{updateOn:'blur'}),
    ins_type_id: new FormControl([]),
    ins_bu_type: new FormControl([]),
    dt_type: new FormControl(''),
    start_dt: new FormControl(''),
    end_dt: new FormControl(''),
    date_range: new FormControl(''),
    brn_cd: new FormControl([],{updateOn:'blur'}),
    rm_id: new FormControl([],{updateOn:'blur'}),
    btn_type: new FormControl('R')
  });
  __insTypeMst: any = [];
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<RcvFormRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {}
  __trans_types: any;
  ngOnInit() {
    // this.__columns = this.__columnsForSummary;
    // this.toppings.setValue(this.__columns);
    // this.getRcvForm();
    this.getInstTypeMSt();
    this.setColumns(2)
  }
  setColumns(res){
    const clmnsToRemove=['edit','delete'];
    this.__columns = insRcvFrmClmns.Detail_column.filter(item => item.isVisible.includes(Number(res)));
    this.__exportedClmns = this.__columns.filter(item => !clmnsToRemove.includes(item.field)).map(item => item.field);
    this.SelectedClmn = this.__columns.map(item => item.field);
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
      //Advance Filter
      this.getBranch();
    }
    else{
      //Reset
    }
  }
  close(ev){
    this.__rcvForms.patchValue({
      start_dt: this.__rcvForms.getRawValue().date_range ? dates.getDateAfterChoose(this.__rcvForms.getRawValue().date_range[0]) : '',
      end_dt: this.__rcvForms.getRawValue().date_range ? (global.getActualVal(this.__rcvForms.getRawValue().date_range[1]) ?  dates.getDateAfterChoose(this.__rcvForms.getRawValue().date_range[1]) : '') : ''
    });
}
  getInstTypeMSt() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.__insTypeMst = res;
      });
  }
  getRcvForm(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __fdForm = new FormData();
  __fdForm.append('paginate',this.__pageNumber.value);
  __fdForm.append('proposer_code',global.getActualVal(this.__rcvForms.value.proposer_code));
  __fdForm.append('temp_tin_no',global.getActualVal(this.__rcvForms.value.temp_tin_no));
  __fdForm.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
  __fdForm.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
  __fdForm.append('from_date', global.getActualVal(this.__rcvForms.getRawValue().start_dt));
  __fdForm.append('to_date', global.getActualVal(this.__rcvForms.getRawValue().end_dt));
  __fdForm.append('ins_type_id', JSON.stringify(this.__rcvForms.value.ins_type_id.map(item => {return item['id']})));
  __fdForm.append('ins_bu_type_id', JSON.stringify(this.__rcvForms.value.ins_bu_type.map(item => {return item['id']})));
  __fdForm.append('recv_from',global.getActualVal(this.__rcvForms.value.recv_from));
  if(this.__rcvForms.value.btn_type == 'A'){
    __fdForm.append('euin_no',JSON.stringify(this.__rcvForms.value.euin_no.map(item => {return item["euin_no"]})));
    __fdForm.append('brn_cd',JSON.stringify(this.__rcvForms.value.brn_cd.map(item => {return item["id"]})));
    __fdForm.append('bu_type',JSON.stringify(this.__rcvForms.value.bu_type.map(item => {return item["bu_code"]})));
    __fdForm.append('rm_id',JSON.stringify(this.__rcvForms.value.rm_id.map(item => {return item["euin_no"]})));
    __fdForm.append('sub_brk_cd',JSON.stringify(this.__rcvForms.value.sub_brk_cd.map(item => {return item["code"]})));
  }
      this.__dbIntr
      .api_call(1, '/ins/formreceivedDetailSearch', __fdForm)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__paginate = res.links;
        this.__RcvForms = new MatTableDataSource(res.data);
        this.tableExport(__fdForm);
      });
  }

  customSort(ev){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.getRcvForm();
  }
  ngAfterViewInit() {

    this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
     this.setColumns(res);
    });
    this.__rcvForms.controls['dt_type'].valueChanges.subscribe((res) => {
      this.__rcvForms.controls['date_range'].reset(
        res && res != 'R' ? ([new Date(dates.calculateDT(res)),new Date(dates.getTodayDate())]) : ''
      );
      this.__rcvForms.controls['start_dt'].reset(
        res && res != 'R' ? dates.calculateDT(res) : ''
      );
      this.__rcvForms.controls['end_dt'].reset(
        res && res != 'R' ? dates.getTodayDate() : ''
      );
      if (res && res != 'R') {
        this.__rcvForms.controls['date_range'].disable();
      } else {
        this.__rcvForms.controls['date_range'].enable();
      }
    });
    this.__rcvForms.controls['proposer_name'].valueChanges
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
        complete: () => console.log(''),
        error: (err) => {
          this.__isClientPending = false;
        },
      });
    // Temporary Tin Number
    this.__rcvForms.controls['temp_tin_no'].valueChanges
      .pipe(
        tap(() => (this.__istemporaryspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1
            ? this.__dbIntr.searchTin('/ins/formreceived', dt )
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
      this.__rcvForms.controls['brn_cd'].valueChanges.subscribe(res =>{
        this.getBusinessTypeMst(res)
      })
      this.__rcvForms.controls['bu_type'].valueChanges.subscribe(res =>{
        this.disabledSubBroker(res);
         this.getRelationShipManagerMst(res,this.__rcvForms.value.brn_cd);
      })
      this.__rcvForms.controls['rm_id'].valueChanges.subscribe(res =>{
        if(this.__rcvForms.value.bu_type.findIndex(item => item.bu_code == 'B') != -1){
                 this.getSubBrokerMst(res);
        }
        else{
        this.__euinMst.length = 0;
          this.__euinMst = res;
        }
     })
     this.__rcvForms.controls['sub_brk_cd'].valueChanges.subscribe(res =>{
        this.setEuinDropdown(res,this.__rcvForms.value.rm_id);
     })
    }
    setEuinDropdown(sub_brk_cd,rm){
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
     disabledSubBroker(bu_type_ids){
       if(bu_type_ids.findIndex(item => item.bu_code == 'B') != -1){
         this.__rcvForms.controls['sub_brk_cd'].enable();
       }
       else{
         this.__rcvForms.controls['sub_brk_cd'].disable();
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
       this.__rcvForms.controls['sub_brk_cd'].setValue([]);
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
       this.__rcvForms.controls['bu_type'].reset([],{emitEvent:true});
       this.__bu_type.length = 0;
     }
     }
     getRelationShipManagerMst(bu_type_id,arr_branch_id){
       if(bu_type_id.length > 0 && arr_branch_id.length > 0){
       this.__dbIntr.api_call(0,'/employee',
       'arr_bu_type_id='+ JSON.stringify(bu_type_id.map(item => {return item['bu_code']}))
       +'&arr_branch_id=' + JSON.stringify(arr_branch_id.map(item  => {return item['id']}))
       ).pipe(pluck("data"))
       .subscribe(res =>{
            this.__rmMst = res;
       })
     }
     else{
       this.__rmMst.length =0;
       this.__rcvForms.controls['rm_id'].reset([]);
     }
     }
  getBranch(){
    this.__dbIntr.api_call(0,'/branch',null).pipe(pluck("data")).subscribe(res =>{
        this.__brnchMst = res;
    })
  }

  tableExport(
    __frmData
  ) {
    __frmData.delete('paginate');
    this.__dbIntr
      .api_call(1, '/ins/formreceivedExport', __frmData)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  getPaginate(__paginate) {
    if(__paginate.url){
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '')) +
            ('&proposer_code=' +(this.__rcvForms.value.proposer_code? this.__rcvForms.value.proposer_code: '')) +
            ('&recv_from=' +(this.__rcvForms.value.recv_from? this.__rcvForms.value.recv_from: '')) +
            ('&from_date=' + global.getActualVal(this.__rcvForms.getRawValue().start_dt)) +
            ('&to_date=' + global.getActualVal(this.__rcvForms.getRawValue().end_dt)) +
            ('&temp_tin_no=' +(this.__rcvForms.value.temp_tin_no? this.__rcvForms.value.temp_tin_no: '')) +
             ('&ins_type_id=' + JSON.stringify(this.__rcvForms.value.ins_type_id.map(item => {return item['id']})))+
            ('&ins_bu_type_id='+ JSON.stringify(this.__rcvForms.value.ins_bu_type.map(item => {return item['id']})))+
            (this.__rcvForms.value.btn_type == 'A' ?
            ('&rm_id='+JSON.stringify(this.__rcvForms.value.rm_id.map(item => {return item["euin_no"]}))) +
            ('&sub_brk_cd=' +(this.__rcvForms.value.sub_brk_cd? JSON.stringify(this.__rcvForms.value.sub_brk_cd.map(item => {return item["code"]})): '[]')) +
            ('&euin_no=' +(this.__rcvForms.value.euin_no? JSON.stringify(this.__rcvForms.value.euin_no.map(item => {return item["euin_no"]})): '[]')) +
            ('&brn_cd='+JSON.stringify(this.__rcvForms.value.brn_cd.map(item => {return item["id"]})))+
            ('&bu_type=' + JSON.stringify(this.__rcvForms.value.bu_type.map(item => {return item["bu_code"]}))) : ''
            )
        ) .pipe(map((x: any) => x.data))
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
    dialogConfig.width = '30%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'D',
      id: __element.temp_tin_no,
      title: 'Delete ' + __element.temp_tin_no,
      api_name: '/ins/formreceivedDelete',
    };
    try {
      const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          this.__RcvForms.data.splice(index, 1);
          this.__RcvForms._updateChangeSubscription();
          this.__export.data.splice(
            this.__export.data.findIndex(
              (x: any) => x.temp_tin_no == __element.temp_tin_no
            ),
            1
          );
          this.__export._updateChangeSubscription();
        }
      });
    } catch (ex) {}
  }
  populateDT(__items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.id = 'INS_' + __items.temp_tin_no.toString();
    dialogConfig.hasBackdrop = false;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try {
      dialogConfig.data = {
        flag: 'INSRF',
        id: __items.temp_tin_no,
        title: 'Form Recievable - Insurance',
        product_id: __items.product_id,
        trans_type_id: __items.trans_type_id,
        temp_tin_no: __items.temp_tin_no,
        right: global.randomIntFromInterval(1, 60),
      };
      const dialogref = this.__dialog.open(RcvFormCrudComponent, dialogConfig);

      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt.temp_tin_no) {
            //update ROW
            this.updateRow(dt.data);
          } else {
            this.__RcvForms.data.unshift(dt.data);
            this.__RcvForms._updateChangeSubscription();
            this.__export.data.unshift(dt.data);
            this.__export._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('80%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'client_name',
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

  updateRow(row_obj) {
    this.__RcvForms.data = this.__RcvForms.data.filter((value: any, key) => {
      if (value.temp_tin_no == row_obj.temp_tin_no) {
        value.arn_no = row_obj.arn_no;
        value.branch_code = row_obj.branch_code;
        value.bu_type = row_obj.bu_type;
        value.dob = row_obj.dob;
        value.euin_no = row_obj.euin_no;
        value.ins_type_id = row_obj.ins_type_id;
        value.ins_type_name = row_obj.ins_type_name;
        value.insure_bu_type = row_obj.insure_bu_type;
        value.pan = row_obj.pan;
        value.proposal_no = row_obj.proposal_no;
        value.proposer_code = row_obj.proposer_code;
        value.proposer_id = row_obj.proposer_id;
        value.proposer_name = row_obj.proposer_name;
        value.rec_datetime = row_obj.rec_datetime;
        value.recv_from = row_obj.recv_from;
        value.sub_arn_no = row_obj.sub_arn_no;
        value.sub_brk_cd = row_obj.sub_brk_cd;
        value.temp_tin_no = row_obj.temp_tin_no;
      }
    });
    this.__export.data = this.__export.data.filter((value: any, key) => {
      if (value.temp_tin_no == row_obj.temp_tin_no) {
        value.arn_no = row_obj.arn_no;
        value.branch_code = row_obj.branch_code;
        value.bu_type = row_obj.bu_type;
        value.dob = row_obj.dob;
        value.euin_no = row_obj.euin_no;
        value.ins_type_id = row_obj.ins_type_id;
        value.ins_type_name = row_obj.ins_type_name;
        value.insure_bu_type = row_obj.insure_bu_type;
        value.pan = row_obj.pan;
        value.proposal_no = row_obj.proposal_no;
        value.proposer_code = row_obj.proposer_code;
        value.proposer_id = row_obj.proposer_id;
        value.proposer_name = row_obj.proposer_name;
        value.rec_datetime = row_obj.rec_datetime;
        value.recv_from = row_obj.recv_from;
        value.sub_arn_no = row_obj.sub_arn_no;
        value.sub_brk_cd = row_obj.sub_brk_cd;
        value.temp_tin_no = row_obj.temp_tin_no;
      }
    });
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
    this.getRcvForm();
  }
  reset() {
    this.__rmMst.length = 0;
    this.__subbrkArnMst.length = 0;
    this.__euinMst.length = 0;
    this.__bu_type.length = 0;
    this.__rcvForms.patchValue({
      start_dt: '',
      end_dt: '',
      dt_type: '',
      options: '2',
      recv_from: '',
      trans_type: '',
      ins_type_id:[],
      ins_bu_type:[],
      date_range:''
    });
    this.__rcvForms.get('brn_cd').setValue([],{emitEvent:false});
    this.__rcvForms.get('rm_id').setValue([],{emitEvent:false});
    this.__rcvForms.get('sub_brk_cd').setValue([],{emitEvent:false});
    this.__rcvForms.get('bu_type').setValue([],{emitEvent:false});
    this.__rcvForms.get('euin_no').setValue([],{emitEvent:false});
    this.__rcvForms.get('proposer_code').setValue('');
    this.__rcvForms.get('proposer_name').setValue('', { emitEvent: false });
    this.__rcvForms.get('temp_tin_no').setValue('', { emitEvent: false });
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.getRcvForm();
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
        this.__rcvForms.controls['proposer_name'].reset(__items.client_name, {
          emitEvent: false,
        });
        this.__rcvForms.controls['proposer_code'].reset(__items.id, {
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
  getSelectedItemsFromParent(ev){
    this.getItems(ev.item, ev.flag);
  }
  onselectItem(ev){
    this.submit();
  }
  getSelectedColumns(columns){
    const clm = ['edit','delete'];
    this.__columns = columns.map(({ field, header }) => ({field, header})).filter(x => !clm.includes(x));
    this.__exportedClmns = this.__columns.filter(item => !clm.includes(item.field)).map(x => {return x['field']});
  }
}
