import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { JsonExporterService } from 'mat-table-exporter';
import { map, pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import { global } from 'src/app/__Utility/globalFunc';
import buType from '../../../../../../../../assets/json/buisnessType.json';
import { AckuploadComponent } from '../ackUpload/ackUpload.component';
@Component({
selector: 'ackRPT-component',
templateUrl: './ackRPT.component.html',
styleUrls: ['./ackRPT.component.css']
})
export class AckrptComponent implements OnInit {
  WindowObject:any;
  divToPrint: any;
  toppings = new FormControl();
  toppingList: any = [{id: "edit",text:"Edit"},
  {id: "sl_no",text:"Sl No"},
  {id: "temp_tin_no",text:"TIN Number"},
  {id: "rnt_name",text:"R&T"},
  {id: "rnt_login_cut_off",text:"Login Cut Off"},
  {id: "rnt_login_dt",text:"Login Date"},
  {id: "bu_type",text:"Buisness Type"},
  {id: "arn_no",text:"ARN Number"},
  {id: "euin_no",text:"EUIN"},
  {id: "first_client_name",text:"First Client Name"},
  {id: "first_client_code",text:"First Client Code"},
  {id: "first_client_pan",text:"First Client Pan"},
  {id: "mode_of_holding",text:"Mode Of Holding"},
  {id: "second_client_name",text:"Second Client Name"},
  {id: "second_client_code",text:"Second Client Code"},
  {id: "second_client_pan",text:"Second Client Pan"},
  {id: "third_client_name",text:"Third Client Name"},
  {id: "third_client_code",text:"Third Client Code"},
  {id: "third_client_pan",text:"Third Client Pan"},
  {id: "transaction",text:"Transaction"},
  {id: "scheme_name",text:"Scheme Name"},
  {id: "plan",text:"Plan"},
  {id: "option",text:"Option"},
  {id: "amount",text:"Amount"},
  {id: "chq",text:"Chqeue Number"},
  {id: "bank",text:"Bank"},
  {id: "inv_type",text:"Investment Type"},
  {id: "apl_no",text:"Application Number"},
  {id: "fol_no",text:"Folio Number"},
  {id: "kyc_status",text:"KYC Status"},
  // {id: "delete",text:"Delete"}
];
  
  __sortAscOrDsc: any = {active: '',direction:'asc'};
  __category: category[];
  __subCat: subcat[];
  __bu_type = buType;
  __rcvForms = new FormGroup({
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    tin_no: new FormControl(''),
    trans_type: new FormArray([]),
    client_code: new FormControl(''),
    amc_name: new FormControl(''),
    inv_type: new FormControl(''),
    euin_no: new FormControl(''),
    brn_cd: new FormControl(''),
    bu_type: new FormArray([]),
    rnt_name: new FormArray([]),
    cat_id: new FormControl(''),
    subcat_id: new FormControl(''),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N')
  });
  __rnt: rnt[];
  __isAdd: boolean = false;
  __isVisible: boolean = true;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __export = new MatTableDataSource<any>([]);
  __exportedClmns: string[] = [
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'rnt_login_cut_off',
     'rnt_login_dt'
  ];
  __financMst = new MatTableDataSource<any>([]);
  __columns = [];
  __trans_types: any;
  __columnsForSummary: string[] = [
    'edit',
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'rnt_login_cut_off',
     'rnt_login_dt'
  ];

  __columnsForDtls: string[] = [
    'edit',
    'sl_no',
    'temp_tin_no',
    'rnt_name',
    'rnt_login_cut_off',
    'rnt_login_dt',
    'bu_type',
    'arn_no',
    'euin_no',
    'first_client_name',
    'first_client_code',
    'first_client_pan',
    'mode_of_holding',
    'second_client_name',
    'second_client_code',
    'second_client_pan',
    'third_client_name',
    'third_client_code',
    'third_client_pan',
    'transaction',
    'scheme_name',
    'plan',
    'option',
    'amount',
    'chq',
    'bank',
    'inv_type',
    'apl_no',
    'fol_no',
    'kyc_status'
  ];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<AckrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    this.__rcvForms.controls['date_status'].valueChanges.subscribe(res => {
            if(res == 'T'){
              this.__rcvForms.controls['start_date'].setValue('');
              this.__rcvForms.controls['end_date'].setValue('');
            }
    })
    this.__rcvForms.controls['options'].valueChanges.subscribe((res) => {
      console.log(res);
      if (res == '2') {
        this.__columns = this.__columnsForSummary;
        this.toppings.setValue(this.__columnsForSummary);
        this.__exportedClmns = [
          'sl_no',
          'temp_tin_no',
          'rnt_name',
          'rnt_login_cut_off',
          'rnt_login_dt'
        ];
      } else{
        this.__columns = this.__columnsForDtls;
        this.toppings.setValue(this.__columnsForDtls);
        this.__exportedClmns = [
          'sl_no',
          'temp_tin_no',
           'rnt_name',
           'rnt_login_cut_off',
           'rnt_login_dt',
          'bu_type',
          'arn_no',
          'euin_no',
          'first_client_name',
          'first_client_code',
          'first_client_pan',
          'mode_of_holding',
          'second_client_name',
          'second_client_code',
          'second_client_pan',
          'third_client_name',
          'third_client_code',
          'third_client_pan',
          'transaction',
          'scheme_name',
          'plan',
          'option',
          'amount',
          'chq',
          'bank',
          'inv_type',
          'apl_no',
          'fol_no',
          'kyc_status',
        ];
      }
      // else{

      // }
    });
    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit']
      this.__columns = res;
      this.__exportedClmns = res.filter(item => !clm.includes(item))
    });
  }
  __transType: any = [];
  ngOnInit() {
    this.__columns = this.__columnsForSummary;
    this.toppings.setValue(this.__columns);
    // this.getFianancMaster();
    // this.tableExport();
    this.getAckRPT();
    this.getTransactionTypeDtls();
    this.getCategory();
    this.getSubCategory();
    this.getRnt();
    this.getTransactionType();
  }
  getRnt() {
    this.__dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.__rnt = res;
      });
  }
  getCategory() {
    this.__dbIntr
      .api_call(0, '/category', null)
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        this.__category = res;
      });
  }
  getSubCategory() {
    this.__dbIntr
      .api_call(0, '/subcategory', null)
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {
        this.__subCat = res;
      });
  }

  getTransactionType() {
    this.__dbIntr
      .api_call(0, '/showTrans', 'trans_type_id=' + this.data.trans_type_id)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__transType = res;
      });
  }
  getTransactionTypeDtls() {
    this.__dbIntr
      .api_call(
        0,
        '/mfTraxCreateShow',
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
  tableExport(column_name: string | null ='',sort_by: string | null | '' = 'asc') {
    const __mfTrax = new FormData();
    __mfTrax.append('option', this.__rcvForms.value.options);
    __mfTrax.append('trans_type_id', this.data.trans_type_id);
    __mfTrax.append('trans_id', this.data.trans_id);
    __mfTrax.append('column_name', column_name);
    __mfTrax.append('sort_by', sort_by);
    if(this.__rcvForms.get('options').value != '3'){
    __mfTrax.append(
      'client_code',
      this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : ''
    );
    __mfTrax.append(
      'sub_brk_cd',
      this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : ''
    );
    __mfTrax.append(
      'trans_type',
      this.__rcvForms.value.trans_type.length > 0
        ? JSON.stringify(this.__rcvForms.value.trans_type)
        : ''
    );
    __mfTrax.append(
      'tin_no',
      this.__rcvForms.value.tin_no ? this.__rcvForms.value.tin_no : ''
    );
    __mfTrax.append(
      'amc_name',
      this.__rcvForms.value.amc_name ? this.__rcvForms.value.amc_name : ''
    );
    __mfTrax.append(
      'inv_type',
      this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : ''
    );
    __mfTrax.append(
      'euin_no',
      this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : ''
    );
    __mfTrax.append(
      'brn_cd',
      this.__rcvForms.value.brn_cd ? this.__rcvForms.value.brn_cd : ''
    );
    __mfTrax.append(
      'rnt_name',
      this.__rcvForms.value.rnt_name.length > 0
        ? JSON.stringify(this.__rcvForms.value.rnt_name)
        : ''
    );
    __mfTrax.append(
      'bu_type',
      this.__rcvForms.value.bu_type.length > 0
        ? JSON.stringify(this.__rcvForms.value.bu_type)
        : ''
    );
    __mfTrax.append(
      'cat_id',
      this.__rcvForms.value.cat_id ? this.__rcvForms.value.cat_id : ''
    );
    __mfTrax.append(
      'subcat_id',
      this.__rcvForms.value.subcat_id ? this.__rcvForms.value.subcat_id : ''
    );
    }
    else{
      __mfTrax.append('login_status',this.__rcvForms.value.login_status);
      __mfTrax.append('date_status',this.__rcvForms.value.date_status);
      __mfTrax.append('start_date',this.__rcvForms.value.start_date);
      __mfTrax.append('end_date',this.__rcvForms.value.end_date);
    }

    this.__dbIntr
      .api_call(1, '/ackExport', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  getFianancMaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(
        0,
        '/mfTraxShow',
        'trans_type_id=' +
          this.data.trans_type_id +
          '&paginate=' +
          __paginate +
          (this.data.trans_id ? '&trans_id=' + this.data.trans_id : '')
      )
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res);
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

  getval(__paginate) {
    this.__pageNumber = __paginate.toString();
    this.submit();
  }
  getPaginate(__paginate: any | null = null) {
    if (__paginate) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber) 
            + (this.data.trans_id ? '&trans_id=' + this.data.trans_id : '')
            + ('&option=' + this.__rcvForms.value.options)
            + ('&trans_type_id=' + this.data.trans_type_id)
            + ('&trans_id=' +  this.data.trans_id)
            + ('&column_name=' +  this.__sortAscOrDsc.active)
            + ('&sort_by=' +  this.__sortAscOrDsc.direction)
            + (this.__rcvForms.get('options').value != '3' 
            ? ('&client_code='+ this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : '')
            + ('&sub_brk_cd=' + this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : '')
            + ('&trans_type=' + (this.__rcvForms.value.trans_type.length > 0 ? JSON.stringify(this.__rcvForms.value.trans_type): ''))
            + ('&tin_no='+ this.__rcvForms.value.tin_no ? this.__rcvForms.value.tin_no : '')
            + ('&amc_name='+ this.__rcvForms.value.amc_name ? this.__rcvForms.value.amc_name : '')
            + ('&inv_type=' + this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : '')
            + ('&euin_no=' +this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : '')
            + ('&brn_cd='+this.__rcvForms.value.brn_cd ? this.__rcvForms.value.brn_cd : '')
            + ('&rnt_name' + (this.__rcvForms.value.rnt_name.length > 0 ? JSON.stringify(this.__rcvForms.value.rnt_name): ''))
            + ('&bu_type' + (this.__rcvForms.value.bu_type.length > 0? JSON.stringify(this.__rcvForms.value.bu_type): ''))
            + ('&cat_id=' +this.__rcvForms.value.cat_id ? this.__rcvForms.value.cat_id : '')
            + ('&subcat_id=' +this.__rcvForms.value.subcat_id ? this.__rcvForms.value.subcat_id : '')
            : ('&login_status=' + this.__rcvForms.value.login_status)
            +('&date_status=' + this.__rcvForms.value.date_status)
            +('&start_date=' + this.__rcvForms.value.start_date)
            +('&end_date=' + this.__rcvForms.value.end_date)
            )
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
    this.__financMst = new MatTableDataSource(res);
    this.__paginate = res.links;
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
    flag: 'ACKUPL',
    isViewMode: __items.form_status == 'P' ? false : true,
    tin: __items.tin_no,
    tin_no: __items.tin_no,
    title: 'Upload Acknowledgement',
    right: global.randomIntFromInterval(1, 60),
    data:__items
  };
  dialogConfig.id = 'ACKUPL_' + __items.tin_no ? __items.tin_no.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      AckuploadComponent,
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
      flag: 'ACKUPL',
    });
  }
  }
  updateRow(row_obj){
    this.__financMst.data = this.__financMst.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
       value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off,
       value.rnt_login_dt = row_obj.rnt_login_dt,
       value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1],
       value.ack_copy_scan = `${row_obj.ack_copy_scan}`,
       value.form_status = row_obj.form_status,
       value.ack_remarks = row_obj.ack_remarks
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: any, key) => {
      if (value.tin_no == row_obj.tin_no) {
       value.rnt_login_cutt_off = row_obj.rnt_login_cutt_off,
       value.rnt_login_dt = row_obj.rnt_login_dt,
       value.rnt_login_time = row_obj.rnt_login_dt?.split(' ')[1],
       value.ack_copy_scan = `${row_obj.ack_copy_scan}`,
       value.form_status = row_obj.form_status,
       value.ack_remarks = row_obj.ack_remarks
      }
      return true;
    });

  }
  
  getAckRPT(column_name: string | null ='',sort_by: string | null | '' = 'asc'){
    const __mfTrax = new FormData();
    __mfTrax.append('paginate', this.__pageNumber.value);
    __mfTrax.append('option', this.__rcvForms.value.options);
    __mfTrax.append('trans_type_id', this.data.trans_type_id);
    __mfTrax.append('trans_id', this.data.trans_id);
    __mfTrax.append('column_name', column_name);
    __mfTrax.append('sort_by', sort_by);

    if(this.__rcvForms.get('options').value != '3'){

    __mfTrax.append(
      'client_code',
      this.__rcvForms.value.client_code ? this.__rcvForms.value.client_code : ''
    );
    __mfTrax.append(
      'sub_brk_cd',
      this.__rcvForms.value.sub_brk_cd ? this.__rcvForms.value.sub_brk_cd : ''
    );
    __mfTrax.append(
      'trans_type',
      this.__rcvForms.value.trans_type.length > 0
        ? JSON.stringify(this.__rcvForms.value.trans_type)
        : ''
    );
    __mfTrax.append(
      'tin_no',
      this.__rcvForms.value.tin_no ? this.__rcvForms.value.tin_no : ''
    );
    __mfTrax.append(
      'amc_name',
      this.__rcvForms.value.amc_name ? this.__rcvForms.value.amc_name : ''
    );
    __mfTrax.append(
      'inv_type',
      this.__rcvForms.value.inv_type ? this.__rcvForms.value.inv_type : ''
    );
    __mfTrax.append(
      'euin_no',
      this.__rcvForms.value.euin_no ? this.__rcvForms.value.euin_no : ''
    );
    __mfTrax.append(
      'brn_cd',
      this.__rcvForms.value.brn_cd ? this.__rcvForms.value.brn_cd : ''
    );
    __mfTrax.append(
      'rnt_name',
      this.__rcvForms.value.rnt_name.length > 0
        ? JSON.stringify(this.__rcvForms.value.rnt_name)
        : ''
    );
    __mfTrax.append(
      'bu_type',
      this.__rcvForms.value.bu_type.length > 0
        ? JSON.stringify(this.__rcvForms.value.bu_type)
        : ''
    );
    __mfTrax.append(
      'cat_id',
      this.__rcvForms.value.cat_id ? this.__rcvForms.value.cat_id : ''
    );
    __mfTrax.append(
      'subcat_id',
      this.__rcvForms.value.subcat_id ? this.__rcvForms.value.subcat_id : ''
    );
  }
  else{
    __mfTrax.append('login_status',this.__rcvForms.value.login_status);
    __mfTrax.append('date_status',this.__rcvForms.value.date_status);
    __mfTrax.append('start_date',this.__rcvForms.value.start_date);
    __mfTrax.append('end_date',this.__rcvForms.value.end_date);
  }
    this.__dbIntr
      .api_call(1, '/ackDetailSearch', __mfTrax)
      .pipe(pluck('data'))
      .subscribe((res: any) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(column_name,sort_by);
      });

  }

  submit() {
    this.getAckRPT(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
  }
  exportPdf() {
    if(this.__rcvForms.get('options').value == '3'){
      this.divToPrint = document.getElementById('FinRPT');
      console.log(this.divToPrint.innerHTML);
      this.WindowObject = window.open('', 'Print-Window');
      this.WindowObject.document.open();
      this.WindowObject.document.writeln('<!DOCTYPE html>');
      this.WindowObject.document.writeln('<html><head><title></title><style type="text/css">');
      this.WindowObject.document.writeln('@media print { .center { text-align: center;}' +
              '                                         .inline { display: inline; }' +
              '                                         .underline { text-decoration: underline; }' +
              '                                         .left { margin-left: 315px;} ' +
              '                                         .right { margin-right: 375px; display: inline; }' +
              '                                          table { border-collapse: collapse; font-size: 10px;}' +
              '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
              '                                           th, td { }' +
              '                                         .border { border: 1px solid black; } ' +
              '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } '+
              '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
              '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>');
        this.WindowObject.document.writeln('</head><body onload="window.print()">');
        this.WindowObject.document.writeln('<center><img src="/assets/images/logo.jpg" alt="">'+
        '<h3>NuEdge Corporate Pvt. Ltd</h3>'+
        '<h5> Day Sheet Report</h5></center>');
        this.WindowObject.document.writeln(this.divToPrint.innerHTML);
        console.log( this.WindowObject);

        this.WindowObject.document.writeln('<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>');
        this.WindowObject.document.writeln('</body></html>');
        this.WindowObject.document.close();
      setTimeout(() => {
        console.log("CLose");
        this.WindowObject.close();
      }, 100);
    }
    else{
      this.__Rpt.downloadReport(
        '#__finRPT',
        {
          title: 'Financial Report',
        },
        'Financial Report  '
      );
    }

  }
  onbuTypeChange(e: any) {
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
  onrntTypeChange(e: any) {
    const rnt_name: FormArray = this.__rcvForms.get('rnt_name') as FormArray;
    if (e.target.checked) {
      rnt_name.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      rnt_name.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          rnt_name.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ontrnsTypeChange(e: any) {
    const trans_type: FormArray = this.__rcvForms.get(
      'trans_type'
    ) as FormArray;
    if (e.target.checked) {
      trans_type.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      trans_type.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          trans_type.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  getminDate(){
    return dates.getminDate();
  }
  getTodayDate(){
    return dates.getTodayDate();
  }

  sortData(sort){
    this.__sortAscOrDsc = sort;
    this.submit();
  }
}
