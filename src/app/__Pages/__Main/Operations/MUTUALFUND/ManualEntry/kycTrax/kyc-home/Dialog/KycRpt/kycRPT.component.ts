import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { dates } from 'src/app/__Utility/disabledt';
import buType from '../../../../../../../../../../assets/json/buisnessType.json';
import { KyModificationComponent } from '../kyModification/kyModification.component';
import { kycClm } from 'src/app/__Model/ClmSelector/kycClm';
import { global } from 'src/app/__Utility/globalFunc';
import { column } from 'src/app/__Model/tblClmns';
import itemsPerPage from '../../../../../../../../../../assets/json/itemsPerPage.json';
import popupMenu from '../../../../../../../../../../assets/json/Master/daySheetOpt.json'
import { RPTService } from 'src/app/__Services/RPT.service';
import { sort } from 'src/app/__Model/sort';
import { environment } from 'src/environments/environment';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { DomSanitizer } from '@angular/platform-browser';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
selector: 'kycRPT-component',
templateUrl: './kycRPT.component.html',
styleUrls: ['./kycRPT.component.css']
})
export class KycrptComponent implements OnInit {
  itemsPerPage:selectBtn[] = itemsPerPage;
  isOpenMegaMenu:boolean = false;
  __getKycFormData: any;
  __sortAscOrDsc = {active: '',direction:'asc'};
  sort = new sort();
  divToPrint: any;
  WindowObject: any;
  daysheetpopupMenu = popupMenu;
  selectKYC: any =[];
  __exportedClmns: string[] =[];
  __isVisible:boolean= true;
  __kycRpt = new MatTableDataSource<any>([]);
  __export = new MatTableDataSource<any>([]);
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: column[] = [];
  selectedColmn:string[] =[];
   ClmList:column[] =(kycClm.Details.filter(x => !['ack_form_view','mu_frm_view'].includes(x.field)));
  __isAdd: boolean = false;
  __bu_type = buType;

constructor(
  private overlay: Overlay,
  private __dbIntr: DbIntrService,
  private __dialog: MatDialog,
  public dialogRef: MatDialogRef<KycrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private sanitizer: DomSanitizer,
  private __Rpt: RPTService
) {
}
ngOnInit(){
  this.setColumns(2);
}
setColumns(res){

  this.__getKycFormData = typeof(res) == 'object' ? res : '';
  console.log(this.__getKycFormData);

    const clmToRemoved = ['edit','app_form_view','ack_form_view','mu_frm_view','delete'];
    this.__columns = res.options == 1 ? (kycClm.Details.filter(x => !['ack_form_view','mu_frm_view'].includes(x.field))) : (kycClm.Summary_copy.filter((x: any) => !['ack_form_view','mu_frm_view'].includes(x.field)));
    this.selectedColmn =  this.__columns.map(item => {return item['field']});
    this.__exportedClmns = this.__columns.filter(x => !clmToRemoved.includes(x.field)).map(item => {return item['field']});
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

getval(__paginate) {
   this.__pageNumber.setValue(__paginate.toString());
  this.showItemPerpage(this.__getKycFormData)
}

getPaginate(__paginate){
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&option='+  this.__getKycFormData.options)
        +  ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
        +  ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
        +  (this.__getKycFormData.options != '3'
        ?  (('&client_code=' + (this.__getKycFormData.client_code ? this.__getKycFormData.client_code : ''))
        + ( '&sub_brk_cd=' + (this.__getKycFormData.sub_brk_cd ? this.__getKycFormData.sub_brk_cd : ''))
        // + ('&bu_type=' + (this.__getKycFormData.bu_type.length > 0 ? JSON.stringify(this.__getKycFormData.bu_type): ''))
        + ('&login_at=' + this.__getKycFormData.kyc_login_at.map(item => {return item['id']}))
        + ('&login_type=' + this.__getKycFormData.kyc_login)
        +('&from_date='+global.getActualVal(this.__getKycFormData.frm_dt))
        +('&to_date='+global.getActualVal(this.__getKycFormData.to_dt))
        +('&tin_no='+global.getActualVal(this.__getKycFormData.tin_no))
        +('&euin_no='+global.getActualVal(this.__getKycFormData.euin_no))
        +('&branch='+global.getActualVal(this.__getKycFormData.brn_cd)))
        : (
        + ('&login_status=' + this.__getKycFormData.login_status)
        + ('&date_status=' + this.__getKycFormData.date_status)
        + ('&start_date=' + this.__getKycFormData.start_date)
        + ('&end_date=' + this.__getKycFormData.end_date)
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
tableExport(__kyc: FormData){
  __kyc.delete('paginate');
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

exportPdf(){
  // if(this.__kycForm.get('options').value == '3'){
    // this.divToPrint = document.getElementById('KycRPT');
    // console.log(this.divToPrint.innerHTML);
    // this.WindowObject = window.open('', 'Print-Window');
    // this.WindowObject.document.open();
    // this.WindowObject.document.writeln('<!DOCTYPE html>');
    // this.WindowObject.document.writeln('<html><head><title></title><style type="text/css">');
    // this.WindowObject.document.writeln('@media print { .center { text-align: center;}' +
    //         '                                         .inline { display: inline; }' +
    //         '                                         .underline { text-decoration: underline; }' +
    //         '                                         .left { margin-left: 315px;} ' +
    //         '                                         .right { margin-right: 375px; display: inline; }' +
    //         '                                          table { border-collapse: collapse; font-size: 10px;}' +
    //         '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
    //         '                                           th, td { }' +
    //         '                                         .border { border: 1px solid black; } ' +
    //         '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } '+
    //         '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
    //         '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>');
    //   this.WindowObject.document.writeln('</head><body onload="window.print()">');
    //   this.WindowObject.document.writeln('<center><img src="/assets/images/logo.jpg" alt="">'+
    //   '<h3>NuEdge Corporate Pvt. Ltd</h3>'+
    //   '<h5> Day Sheet Report</h5></center>');
    //   this.WindowObject.document.writeln(this.divToPrint.innerHTML);
    //   console.log( this.WindowObject);

    //   this.WindowObject.document.writeln('<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>');
    //   this.WindowObject.document.writeln('</body></html>');
    //   this.WindowObject.document.close();
    // setTimeout(() => {
    //   console.log("CLose");
    //   this.WindowObject.close();
    // }, 100);
  // }
  // else{
    this.__Rpt.downloadReport(
      '#KycRPT',
      {
        title: 'KYC Report',
      },
      'KYC Report  '
    );
  // }
}
populateDT(__items,mode) {
  this.openDialog(__items.tin_no, __items,mode);
}
openDialog(id: string | null = null, __items,mode) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '60%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  try{
    console.log(__items);

    if (id) {
      console.log(__items);

      this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __items.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
        console.log(res);
        dialogConfig.data = {
          id: id,
          title: mode == 'E' ? 'Update KYC Status' : 'View KYC Status',
          items: res[0],
          kyc_data: __items,
          mode:mode
        };
        const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
        });

      })
    }
    else {
      dialogConfig.data = {
        id: 0,
        title: 'Add KYC',
        items: __items,
        mode: mode
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
reset(__ev){
  // this.__sortAscOrDsc = {active:'',direction:'asc'};
  this.sort = new sort();
  this.__pageNumber.setValue(10);
  this.getKycRpt(__ev);
}

getKycRpt(kycFormDt){
this.__getKycFormData = kycFormDt;
const __kyc = new FormData();
  __kyc.append('paginate',this.__pageNumber.value);
  __kyc.append('option', kycFormDt.options);
  __kyc.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
  __kyc.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
  if( kycFormDt.options != '3'){

    __kyc.append('login_status_id',JSON.stringify(kycFormDt.ack_logged_status.filter(item => item.isChecked).map(res => {return res['id']})));
    __kyc.append('from_date',global.getActualVal(kycFormDt.frm_dt));
    __kyc.append('to_date',global.getActualVal(kycFormDt.to_dt));
    __kyc.append('login_at',JSON.stringify(kycFormDt.kyc_login_at.map(item => {return item['id']})));
    __kyc.append('login_type',global.getActualVal(kycFormDt.kyc_login));
  __kyc.append(
    'client_code',
    kycFormDt.client_code ? kycFormDt.client_code : ''
  );
  __kyc.append(
    'tin_no',
    kycFormDt.tin_no ? kycFormDt.tin_no : ''
  );
  __kyc.append(
    'euin_no',
    kycFormDt.euin_no ? kycFormDt.tin_no : ''
  );
  __kyc.append(
    'sub_brk_cd',
    kycFormDt.sub_brk_cd ? kycFormDt.sub_brk_cd : ''
  );
  // __kyc.append(
  //   'bu_type',
  //   kycFormDt.bu_type.length > 0
  //     ? JSON.stringify(kycFormDt.bu_type)
  //     : ''
  // );
  __kyc.append(
    'branch',global.getActualVal(kycFormDt.brn_cd));
}
else{
  __kyc.append('login_status',kycFormDt.login_status);
  __kyc.append('date_status',kycFormDt.date_status);
  __kyc.append('start_date',kycFormDt.start_date);
  __kyc.append('end_date',kycFormDt.end_date);
}

  this.__dbIntr.api_call(1,'/kycDetailSearch',__kyc).pipe(pluck("data")).subscribe((res: any) =>{
      this.__kycRpt = new MatTableDataSource(res.data);
      this.__paginate = res.links;
      this.tableExport(__kyc);
  })
}
showItemPerpage(kycFormDt){
  const __kyc = new FormData();
  __kyc.append('paginate',this.__pageNumber.value);
  __kyc.append('option', kycFormDt.options);
  __kyc.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
  __kyc.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
  if( kycFormDt.options != '3'){
    __kyc.append('from_date',global.getActualVal(kycFormDt.frm_dt));
    __kyc.append('to_date',global.getActualVal(kycFormDt.to_dt));
    __kyc.append('login_at',JSON.stringify(kycFormDt.kyc_login_at.map(item => {return item['id']})));
    __kyc.append('login_type',global.getActualVal(kycFormDt.kyc_login));
  __kyc.append(
    'client_code',
    kycFormDt.client_code ? kycFormDt.client_code : ''
  );
  __kyc.append(
    'tin_no',
    kycFormDt.tin_no ? kycFormDt.tin_no : ''
  );
  __kyc.append(
    'euin_no',
    kycFormDt.euin_no ? kycFormDt.tin_no : ''
  );
  __kyc.append(
    'sub_brk_cd',
    kycFormDt.sub_brk_cd ? kycFormDt.sub_brk_cd : ''
  );
  __kyc.append(
    'bu_type',
    kycFormDt.bu_type.length > 0
      ? JSON.stringify(kycFormDt.bu_type)
      : ''
  );
  __kyc.append(
    'branch',global.getActualVal(kycFormDt.brn_cd));
}
else{
  __kyc.append('login_status',kycFormDt.login_status);
  __kyc.append('date_status',kycFormDt.date_status);
  __kyc.append('start_date',kycFormDt.start_date);
  __kyc.append('end_date',kycFormDt.end_date);
}

  this.__dbIntr.api_call(1,'/kycDetailSearch',__kyc).pipe(pluck("data")).subscribe((res: any) =>{
      this.__kycRpt = new MatTableDataSource(res.data);
      this.__paginate = res.links;
  })
}
customSort(ev){
    this.sort.order =ev.sortOrder;
    this.sort.field =ev.sortField;
    if(ev.sort_field){
      this.getKycRpt(this.__getKycFormData);
    }

}
onselectItem(ev){
   this.__pageNumber.setValue(ev.option.value);
   this.showItemPerpage(this.__getKycFormData)
}
getSelectedColumns(columns){
      const clm = ['edit', 'app_form_view'];
       this.__columns = columns.map(({ field, header }) => ({field, header}));
       this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
}
openMenu(event){
  console.log(this.selectKYC);
  if(event.flag == 'P'){
   let WindowObject ;
   const divToPrint = document.getElementById('KycRPT');
   console.log(divToPrint.innerHTML);
  WindowObject = window.open('', 'Print-Window');
  WindowObject.document.open();
  WindowObject.document.writeln('<!DOCTYPE html>');
  WindowObject.document.writeln('<html><head><title></title><style type="text/css">');
  WindowObject.document.writeln('@media print { .center { text-align: center;}' +
  '                                          table {margin: auto}' +
  '                                         .inline { display: inline; }' +
  '                                         .underline { text-decoration: underline; }' +
  '                                         .left { margin-left: 315px;} ' +
  '                                         .right { margin-right: 375px; display: inline; }' +
  '                                          table { border-collapse: collapse; font-size: 10px;}' +
  '                                          th, td { border: 1px solid black; border-collapse: collapse; padding: 6px;}' +
  '                                           th, td { width:12.2% }' +
  '                                         .border { border: 1px solid black; } ' +
  '                                         .bottom { bottom: 5px; width: 100%; position: fixed; } ' +
  '                                           footer { position: fixed; bottom: 0;text-align: center; }' +
  '                                         td.dashed-line { border-top: 1px dashed gray; } } </style>');
    WindowObject.document.writeln('</head><body onload="window.print()">');
    WindowObject.document.writeln('<center><img src="/assets/images/logo.jpg" alt="">'+
     '<h3>NuEdge Corporate Pvt. Ltd</h3>'+
     '<h5> Day Sheet Report</h5></center>');
    WindowObject.document.writeln(divToPrint.innerHTML);
     console.log(WindowObject);

    WindowObject.document.writeln('<footer><small>This is an electronically generated report, hence does not require any signature</small></footer>');
    WindowObject.document.writeln('</body></html>');
    WindowObject.document.close();
   setTimeout(() => {
     console.log("CLose");
    WindowObject.close();
   }, 100);
  }
  else{

  }
}
DocView(element,mode){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = true;
  dialogConfig.width = '80%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'ACKDOC',
    title: mode == 'K' ? 'Uploaded KYC' : 'Uploaded Acknowledgement',
    data: element,
    copy_url:`${environment.kyc_formUrl + element.scaned_form}`,
    src: mode == 'K' ? this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.kyc_formUrl + element.scaned_form}`) : this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.kyc_ack_form_url + element.ack_copy_scan}`)
  };
  const dialogref = this.__dialog.open(PreviewDocumentComponent, dialogConfig);
}
}
