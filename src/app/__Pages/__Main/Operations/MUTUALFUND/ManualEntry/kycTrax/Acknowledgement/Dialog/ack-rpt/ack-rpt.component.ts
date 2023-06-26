import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { kycClm } from 'src/app/__Model/ClmSelector/kycClm';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { AckEntryComponent } from '../ack-entry/ack-entry.component';
import { PreviewDocumentComponent } from 'src/app/shared/core/preview-document/preview-document.component';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { column } from 'src/app/__Model/tblClmns';
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../../../../assets/json/itemsPerPage.json';

type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-ack-rpt',
  templateUrl: './ack-rpt.component.html',
  styleUrls: ['./ack-rpt.component.css']
})
export class AckRptComponent implements OnInit {
  itemsPerPage:selectBtn[] = itemsPerPage;
  isOpenMegaMenu:boolean = false;
  sort =new sort();
  __isVisible: boolean = true;
  __ackRpt = new MatTableDataSource<any>([]);
  __export = new MatTableDataSource<any>([]);
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: column[] = [];
  __exportedClmns: string[] =[];
  selectedColmn:string[] =[];
  ClmList:column[] = kycClm.Details.filter((x: any) => !['mu_frm_view'].includes(x));
  __getAckFormData: any;
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<AckRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.setColumns(2);
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


  reset(__ev){
    this.sort = new sort();
    this.getAckRpt(__ev);
  }
  setColumns(res){
    const clmToRemoved = ['edit','app_form_view','ack_form_view','mu_frm_view','delete'];
    this.__columns = res.options == 1 ? (kycClm.Details.filter(x => !['mu_frm_view'].includes(x.field))) : (kycClm.Summary_copy.filter((x: any) => !['mu_frm_view'].includes(x.field)));
    this.selectedColmn =  this.__columns.map(item => {return item['field']});
    this.__exportedClmns = this.__columns.filter(x => !clmToRemoved.includes(x.field)).map(item => {return item['field']});
  }

  getAckRpt(kycFormDt){
    this.__getAckFormData = kycFormDt;
    const __kycAck = new FormData();
      __kycAck.append('paginate',this.__pageNumber.value);
      __kycAck.append('option', kycFormDt.options);
      __kycAck.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
      __kycAck.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
      if( kycFormDt.options != '3'){
        __kycAck.append('login_status_id',JSON.stringify(kycFormDt.ack_logged_status.filter(item => item.isChecked).map(res => {return res['id']})));
        __kycAck.append('from_date',global.getActualVal(kycFormDt.frm_dt));
        __kycAck.append('to_date',global.getActualVal(kycFormDt.to_dt));
        __kycAck.append('login_at',global.getActualVal(kycFormDt.kyc_login_at) ? JSON.stringify(kycFormDt.kyc_login_at) : '');
        __kycAck.append('login_type',global.getActualVal(kycFormDt.kyc_login));
      __kycAck.append(
        'client_code',
        kycFormDt.client_code ? kycFormDt.client_code : ''
      );
      __kycAck.append(
        'tin_no',
        kycFormDt.tin_no ? kycFormDt.tin_no : ''
      );
      __kycAck.append(
        'euin_no',
        kycFormDt.euin_no ? kycFormDt.tin_no : ''
      );
      __kycAck.append(
        'sub_brk_cd',
        kycFormDt.sub_brk_cd ? kycFormDt.sub_brk_cd : ''
      );
      // __kycAck.append(
      //   'bu_type',
      //   kycFormDt.bu_type.length > 0
      //     ? JSON.stringify(kycFormDt.bu_type)
      //     : ''
      // );
      __kycAck.append(
        'branch',global.getActualVal(kycFormDt.brn_cd));
    }
    else{
      __kycAck.append('login_status',kycFormDt.login_status);
      __kycAck.append('date_status',kycFormDt.date_status);
      __kycAck.append('start_date',kycFormDt.start_date);
      __kycAck.append('end_date',kycFormDt.end_date);
    }

      this.__dbIntr.api_call(1,'/kycAckDetailSearch',__kycAck).pipe(pluck("data")).subscribe((res: any) =>{
          this.__ackRpt = new MatTableDataSource(res.data);
          this.__paginate = res.links;
          this.tableExport(__kycAck);
      })
    }
    tableExport(__kycAck: FormData){
      __kycAck.delete('paginate');
      this.__dbIntr.api_call(1,'/kycAckExport',__kycAck).pipe(map((x: any) => x.data)).subscribe((res: any) =>{
        this.__export = new MatTableDataSource(res);
      })
    }

   showItemPerpage(kycFormDt){
    const __kyc = new FormData();
    __kyc.append('paginate',this.__pageNumber.value);
    __kyc.append('option', kycFormDt.options);
    __kyc.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __kyc.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    if( kycFormDt.options != '3'){
       __kyc.append('login_status_id',JSON.stringify(kycFormDt.ack_logged_status.filter(item => item.isChecked).map(res => {return res['id']})));
      __kyc.append('from_date',global.getActualVal(kycFormDt.frm_dt));
      __kyc.append('to_date',global.getActualVal(kycFormDt.to_dt));
      __kyc.append('login_at',global.getActualVal(kycFormDt.kyc_login_at) ? JSON.stringify(kycFormDt.kyc_login_at) : '');
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
        this.__ackRpt = new MatTableDataSource(res.data);
        this.__paginate = res.links;
    })
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          + ('&option='+  this.__getAckFormData.options)
          +  ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
          +  ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
          +  (this.__getAckFormData.options != '3'
          ?  (('&client_code=' + (this.__getAckFormData.client_code ? this.__getAckFormData.client_code : ''))
          + ( '&sub_brk_cd=' + (this.__getAckFormData.sub_brk_cd ? this.__getAckFormData.sub_brk_cd : ''))
          // + ('&bu_type=' + (this.__getAckFormData.bu_type.length > 0 ? JSON.stringify(this.__getAckFormData.bu_type): ''))
          + ('&login_at=' + this.__getAckFormData.kyc_login_at)
          + ('&login_type=' + this.__getAckFormData.kyc_login)
          +('&from_date='+global.getActualVal(this.__getAckFormData.frm_dt))
          +('&to_date='+global.getActualVal(this.__getAckFormData.to_dt))
          +('&tin_no='+global.getActualVal(this.__getAckFormData.tin_no))
          +('&euin_no='+global.getActualVal(this.__getAckFormData.euin_no))
          +('&branch='+global.getActualVal(this.__getAckFormData.brn_cd)))
          +('&login_status_id='+JSON.stringify(this.__getAckFormData.ack_logged_status.filter(item => item.isChecked).map(res => {return res['id']})))
          : (
          + ('&login_status=' + this.__getAckFormData.login_status)
          + ('&date_status=' + this.__getAckFormData.date_status)
          + ('&start_date=' + this.__getAckFormData.start_date)
          + ('&end_date=' + this.__getAckFormData.end_date)
          )
          )

        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__ackRpt = new MatTableDataSource(res.data);
          this.__paginate = res.links;
        });
    }
  }
  exportPdf(){

  }
  populateDT(element,mode){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '50%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'ACKUPL',
      isViewMode: element.form_status == 'P' ? false : true,
      tin: element.tin_no,
      tin_no: element.tin_no,
      title: 'Upload Acknowledgement',
      right: global.randomIntFromInterval(1, 60),
      data: element,
    };
    dialogConfig.id =
      'ACKUPL_' + element.tin_no ? element.tin_no.toString() : '0';
    try {
      const dialogref = this.__dialog.open(AckEntryComponent, dialogConfig);
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
  updateRow(row_obj) {
    this.__ackRpt.data = this.__ackRpt.data.filter((value: any, key) => {
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
    this.__export.data = this.__export.data.filter((value: any, key) => {
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
  customSort(ev){
   this.sort.order = ev.sortOrder;
   this.sort.field = ev.sortField;
   if(ev.sortField){
    this.getAckRpt(this.__getAckFormData);
   }

  }
  onselectItem(ev){
    this.__pageNumber.setValue(ev.option.value);
    this.showItemPerpage(this.__getAckFormData)
 }
 getSelectedColumns(columns){
  const clm = ['edit', 'app_form_view','ack_form_view'];
  this.__columns = columns.map(({ field, header }) => ({field, header}));
  this.__exportedClmns = this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
 }
}
