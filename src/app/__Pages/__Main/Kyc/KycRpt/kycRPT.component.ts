import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { dates } from 'src/app/__Utility/disabledt';
import buType from '../../../../../assets/json/buisnessType.json';
import { KyModificationComponent } from '../kyModification/kyModification.component';
import kycLoginType from '../../../../../assets/json/kycloginType.json';
import { responseDT } from 'src/app/__Model/__responseDT';
import kycLoginAt from '../../../../../assets/json/kycLoginAt.json';

@Component({
selector: 'kycRPT-component',
templateUrl: './kycRPT.component.html',
styleUrls: ['./kycRPT.component.css']
})
export class KycrptComponent implements OnInit {

  __sortAscOrDsc = {active: '',direction:'asc'};
  __kycLoginType =kycLoginType;
  __kycLoginAt: any= [];
  __isAdditional: boolean = false;
  divToPrint: any;
  WindowObject: any;
  toppings = new FormControl();
  toppingList: any = [{id: "edit",text:"Edit"},
  {id: "sl_no",text:"Sl No"},
  {id: "tin_no",text:"TIN Number"},
  {id: "bu_type",text:"Buisness Type"},
  {id: "sub_brk_cd",text:"Sub Broker ARN"},
  {id: "euin_no",text:"EUIN"},
  {id: "client_name",text:"Client Name"},
  {id: "client_code",text:"Client Code"},
  {id: "pan",text:"Pan"},
  {id: "kyc_type",text:'Kyc Type'},
   {id: 'login_at',text:'Login At'},
   {id: 'amc_office',text:'Amc Office'},
   {id: 'entry_dt', text:"Entry Date"},
  {id: "delete",text:"Delete"}];

  __exportedClmns: string[] =['sl_no',
                              'tin_no',
                              'bu_type',
                              'sub_brk_cd',
                              'euin_no',
                              'client_name',
                              'client_code',
                              'pan'

                            ];
  __columnsForsummary: string[] = ['edit','sl_no', 'tin_no','bu_type','sub_brk_cd','euin_no','client_name',
  'client_code',
  'pan',  'delete'];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'tin_no',
    'bu_type',
    'sub_brk_cd',
    'euin_no',
    'client_name',
    'client_code',
    'pan',
    'kyc_type',
    'login_type',
    'login_at',
    'amc_office',
    'entry_dt',
    'pan',
    'delete'];
  __isVisible:boolean= true;
  __kycRpt = new MatTableDataSource<any>([]);
  __export = new MatTableDataSource<any>([]);
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __kycForm = new FormGroup({
    options: new FormControl('2'),
    sub_brk_cd: new FormControl(''),
    trans_type: new FormArray([]),
    client_code: new FormControl(''),
    amc_name: new FormControl(''),
    brn_cd: new FormControl(''),
    bu_type: new FormArray([]),
    cat_id: new FormControl(''),
    subcat_id: new FormControl(''),
    date_status: new FormControl('T'),
    start_date: new FormControl(this.getTodayDate()),
    end_date: new FormControl(this.getTodayDate()),
    login_status: new FormControl('N'),
    login_at: new FormControl(''),
    login_type: new FormControl(''),
    amc_id: new FormControl('')
  });
  __isAdd: boolean = false;
  __rnt: rnt[] =[];
  __bu_type = buType;

constructor(
  private overlay: Overlay,
  private __utility: UtiliService,
  private __dbIntr: DbIntrService,
  private __dialog: MatDialog,
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<KycrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
}
getRnt() {
  this.__dbIntr
    .api_call(0, '/rnt', null)
    .pipe(pluck('data'))
    .subscribe((res: rnt[]) => {
      this.__rnt = res;
    });
}
ngOnInit(){
  this.__columns = this.__columnsForsummary;
  this.toppings.setValue(this.__columns);
  this.KycRpt();
  this.getRnt();
}

ngAfterViewInit() {
  this.__kycForm.controls['date_status'].valueChanges.subscribe(res => {
          if(res == 'T'){
            this.__kycForm.controls['start_date'].setValue('');
            this.__kycForm.controls['end_date'].setValue('');
          }
  })
  this.toppings.valueChanges.subscribe((res) => {
    const clm = ['edit','delete']
    this.__columns = res;
    this.__exportedClmns = res.filter(item => !clm.includes(item))
  });
  this.__kycForm.controls['options'].valueChanges.subscribe((res) => {
    console.log(res);
    if (res == '2') {
      this.__columns = this.__columnsForsummary;
      this.toppings.setValue(this.__columnsForsummary);
      this.__exportedClmns = [
                               'sl_no',
                              'tin_no',
                              'bu_type',
                              'sub_brk_cd',
                              'euin_no'
      ];
    } else{
      this.__columns = this.__columnsForDetails;
      this.toppings.setValue(this.__columnsForDetails);
      this.__exportedClmns = [
        'sl_no',
    'tin_no',
    'bu_type',
    'sub_brk_cd',
    'euin_no',
    'client_name',
    'client_code',
    'pan',
    'kyc_type',
    'login_type',
    'login_at',
    'amc_office',
    'entry_dt',
    'pan'
      ];
    }
    // else{

    // }
  });
  this.__kycForm.get('login_type').valueChanges.subscribe(res => {
    switch (res) {
      case 'R':
      this.getKycLoginAtMaster(res); break;
      case 'A':
      this.getKycLoginAtMaster(res); break;
      case 'N':
      this.__kycLoginAt = kycLoginAt;
       break;
      default: break;
    }
  })
}
getKycLoginAtMaster(kyc_login_type) {
  this.__dbIntr.api_call(0, kyc_login_type == 'R' ? '/rnt' : '/amc', null).pipe(map((x: responseDT) => x.data)).subscribe(res => {
    this.__kycLoginAt = res;
  })
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
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

 getkycRptMst(column_name: string | null = '',sort_by: string | null | '' = 'asc'){
  const __kyc = new FormData();
  __kyc.append('paginate',this.__pageNumber.value);
  __kyc.append('option', this.__kycForm.value.options);
  __kyc.append('login_at',this.__kycForm.value.login_at);
  __kyc.append('login_type',this.__kycForm.value.login_type);
  __kyc.append('start_date',this.__kycForm.value.start_date);
  __kyc.append('end_date',this.__kycForm.value.end_date);
  __kyc.append('column_name',column_name);
  __kyc.append('sort_by',sort_by);
  if(this.__kycForm.get('options').value != '3'){
  __kyc.append(
    'client_code',
    this.__kycForm.value.client_code ? this.__kycForm.value.client_code : ''
  );
  __kyc.append(
    'sub_brk_cd',
    this.__kycForm.value.sub_brk_cd ? this.__kycForm.value.sub_brk_cd : ''
  );
  __kyc.append(
    'bu_type',
    this.__kycForm.value.bu_type.length > 0
      ? JSON.stringify(this.__kycForm.value.bu_type)
      : ''
  );
}
else{
  __kyc.append('login_status',this.__kycForm.value.login_status);
  __kyc.append('date_status',this.__kycForm.value.date_status);
}

  this.__dbIntr.api_call(1,'/kycDetailSearch',__kyc).pipe(pluck("data")).subscribe((res: any) =>{
     console.log(res);

      this.__kycRpt = new MatTableDataSource(res.data);
      this.__paginate = res.links;
      this.tableExport(column_name,sort_by);
  })


 }

KycRpt(){
  this.getkycRptMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
getval(__paginate) {
  this.__pageNumber.setValue(__paginate.toString());
  this.KycRpt();
}

getPaginate(__paginate){
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&option='+  this.__kycForm.value.options)
        + ('&login_at=' + this.__kycForm.value.login_at)
        + ('&login_type=' + this.__kycForm.value.login_type)
        + ('&start_date=' + this.__kycForm.value.start_date)
        + ('&end_date=' + this.__kycForm.value.end_date)
        + ('&sort_by=' + this.__sortAscOrDsc.direction)
        + ('&column_name=' + this.__sortAscOrDsc.active)
        +  (this.__kycForm.get('options').value != '3'
        ?  (('&client_code=' + (this.__kycForm.value.client_code ? this.__kycForm.value.client_code : ''))
        + ( '&sub_brk_cd=' + (this.__kycForm.value.sub_brk_cd ? this.__kycForm.value.sub_brk_cd : ''))
        + ('&bu_type=' + (this.__kycForm.value.bu_type.length > 0 ? JSON.stringify(this.__kycForm.value.bu_type): '')))
        : (
        + ('&login_status=' + this.__kycForm.value.login_status)
        + ('&date_status=' + this.__kycForm.value.date_status)
        )
        )

      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.__kycRpt = new MatTableDataSource(res.data);
        this.__paginate = res.links;
      });
  }
}
tableExport(column_name: string | null = '',sort_by: string | null | '' = 'asc'){
  const __kyc = new FormData();
  // __kyc.append('paginate',this.__pageNumber.value);
  __kyc.append('option', this.__kycForm.value.options);
  __kyc.append('login_at',this.__kycForm.value.login_at);
  __kyc.append('login_type',this.__kycForm.value.login_type);
  __kyc.append('start_date',this.__kycForm.value.start_date);
  __kyc.append('end_date',this.__kycForm.value.end_date);
  __kyc.append('column_name',column_name);
  __kyc.append('sort_by',sort_by);
  if(this.__kycForm.get('options').value != '3'){
  __kyc.append(
    'client_code',
    this.__kycForm.value.client_code ? this.__kycForm.value.client_code : ''
  );
  __kyc.append(
    'sub_brk_cd',
    this.__kycForm.value.sub_brk_cd ? this.__kycForm.value.sub_brk_cd : ''
  );
  __kyc.append(
    'bu_type',
    this.__kycForm.value.bu_type.length > 0
      ? JSON.stringify(this.__kycForm.value.bu_type)
      : ''
  );
}
else{
  __kyc.append('login_status',this.__kycForm.value.login_status);
  __kyc.append('date_status',this.__kycForm.value.date_status);
}
  this.__dbIntr.api_call(1,'/kycExport',__kyc).pipe(map((x: any) => x.data)).subscribe((res: any) =>{
    this.__export = new MatTableDataSource(res);
  })
}
getminDate(){
  return dates.getminDate();
}
getTodayDate(){
  return dates.getTodayDate();
}

onbuTypeChange(e: any) {
  const bu_type: FormArray = this.__kycForm.get('bu_type') as FormArray;
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
  const rnt_name: FormArray = this.__kycForm.get('rnt_name') as FormArray;
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

exportPdf(){
  // if(this.__kycForm.get('options').value == '3'){
    this.divToPrint = document.getElementById('KycRPT');
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
  // }
  // else{
  //   this.__Rpt.downloadReport(
  //     '#KycRPT',
  //     {
  //       title: 'KYC Report',
  //     },
  //     'KYC Report  '
  //   );
  // }
}
populateDT(__items) {
  this.openDialog(__items.pan_no, __items);
}
openDialog(id: string | null = null, __items) {
  const dialogConfig = new MatDialogConfig();
  // dialogConfig.width = '98%';
  // dialogConfig.panelClass = 'fullscreen-dialog';
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '60%';
  // dialogConfig.height = "100%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  try{
    if (id) {
      this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __items.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
        console.log(res);
        dialogConfig.data = {
          id: id,
          title: 'Update Kyc Status',
          items: res[0],
          kyc_data: __items
        };
        const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
        });

      })
    }
    else {
      dialogConfig.data = {
        id: 0,
        title: 'Add Kyc',
        items: __items
      };
      const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        console.log(dt);

      });
    }
  }
  catch(ex){
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
  }

}
reset(){
  this.__kycForm.reset();
  this.__isAdditional=false;
  this.__kycForm.get('options').setValue('2');
  this.__sortAscOrDsc = {active:'',direction:'asc'};
  this.__kycForm.patchValue({
    start_date:this.getTodayDate(),
    end_date: this.getTodayDate()
  });
  this.KycRpt();
}
sortData(sort){
  this.__sortAscOrDsc =sort;
  this.KycRpt();
}
}
