import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject, ElementRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { RntModificationComponent } from '../rntModification/rntModification.component';

@Component({
selector: 'Rnt-rntRpt',
templateUrl: './rntRpt.component.html',
styleUrls: ['./rntRpt.component.css']
})
export class RntrptComponent implements OnInit {
  __isrntspinner: boolean =false;
  __rntMst: rnt[] = [];
  @ViewChild('searchRnt') __searchRnt: ElementRef;

  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __export =  new MatTableDataSource<rnt>([]);
  __exportedClmns: string[] =[ 'sl_no','rnt_name', 'cus_care_no','cus_care_email'];
  __columnsForsummary: string[] = ['edit','sl_no','rnt_name', 'cus_care_no','cus_care_email', 'delete'];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'rnt_name',
    'cus_care_no',
    'cus_care_email',
    'head_contact_per',
    'head_contact_per_mobile',
    'head_contact_per_email',
    'head_contact_per_addr',
    'local_contact_per',
    'local_contact_per_mobile',
    'local_contact_per_email',
    'local_contact_per_addr',
    'delete'];
  __isVisible:boolean= false;
  __rntSearchForm = new FormGroup({
    options: new FormControl('2'),
    rnt_name: new FormControl(''),
    rnt_id: new FormControl(''),
    contact_person: new FormControl('')
  })
  __selectRNT = new MatTableDataSource<rnt>([]);
constructor(
  private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RntrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
) {
}

ngOnInit(){
  this.getRNTmaster();
  this.__columns =  this.__columnsForsummary;
  this.tableExport();
}

ngAfterViewInit(){
  this.__rntSearchForm.controls['rnt_name'].valueChanges
  .pipe(
    tap(() => this.__isrntspinner = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1
        ? this.__dbIntr.searchItems(
          '/rnt',
          dt)
        : []
    ),
    map((x: responseDT) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__rntMst = value;
      this.searchResultVisibility('block','R')
      this.__isrntspinner = false;
    },
    complete: () => console.log(''),
    error: (err) => console.log(),
  });
  this.__rntSearchForm.controls['options'].valueChanges.subscribe(res =>{
    if(res == '1'){
      this.__columns = this.__columnsForDetails;
      this.__exportedClmns = [
        'sl_no',
        'rnt_name',
        'cus_care_no',
        'cus_care_email',
        'head_contact_per',
        'head_contact_per_mobile',
        'head_contact_per_email',
        'head_contact_per_addr',
        'local_contact_per',
        'local_contact_per_mobile',
        'local_contact_per_email',
        'local_contact_per_addr',
    ]
    }
    else{
      // this.showColumns();
      this.__columns = this.__columnsForsummary;
      this.__exportedClmns =['sl_no','rnt_name', 'cus_care_no','cus_care_email'];
    }
  })
}
outsideClick(__ev,__mode){
  if(__ev){
     this.searchResultVisibility('none',__mode)
  }
}
searchResultVisibility(display_mode,__mode) {
    this.__searchRnt.nativeElement.style.display = display_mode;
  }
showColumns(){
  // if( this.__rntSearchForm.value.options == '1'){
  //   if(this.__rntSearchForm.value.l1
  //    || this.__rntSearchForm.value.l2
  //    || this.__rntSearchForm.value.l3
  //    || this.__rntSearchForm.value.l4
  //    || this.__rntSearchForm.value.l5
  //    || this.__rntSearchForm.value.l6){
  //      var columnDt =  [ 'edit','sl_no','rnt_name', 'cus_care_no','cus_care_email'];
  //      this.__exportedClmns = ['sl_no','rnt_name', 'cus_care_no','cus_care_email'];
  //      if(this.__rntSearchForm.value.l1){
  //        columnDt = [...columnDt,'l1_name','l1_email','l1_contact_no'];
  //       this.__exportedClmns = [ ...this.__exportedClmns ,'l1_name','l1_email','l1_contact_no'];
  //      }
  //      if(this.__rntSearchForm.value.l2){
  //        columnDt = [...columnDt,'l2_name','l2_email','l2_contact_no'];
  //       this.__exportedClmns = [ ...this.__exportedClmns ,'l2_name','l2_email','l2_contact_no'];
  //      }
  //      if(this.__rntSearchForm.value.l3){
  //        columnDt = [...columnDt,'l3_name','l3_email','l3_contact_no'];
  //       this.__exportedClmns = [ ...this.__exportedClmns ,'l3_name','l3_email','l3_contact_no'];
  //      }
  //      if(this.__rntSearchForm.value.l4){
  //        columnDt = [...columnDt,'l4_name','l4_email','l4_contact_no'];
  //       this.__exportedClmns = [ ...this.__exportedClmns ,'l4_name','l4_email','l4_contact_no'];
  //      }
  //      if(this.__rntSearchForm.value.l5){
  //        columnDt = [...columnDt,'l5_name','l5_email','l5_contact_no'];
  //       this.__exportedClmns = [ ...this.__exportedClmns ,'l5_name','l5_email','l5_contact_no'];
  //      }
  //      if(this.__rntSearchForm.value.l6){
  //        columnDt = [...columnDt,'l6_name','l6_email','l6_contact_no'];
  //       this.__exportedClmns = [ ...this.__exportedClmns ,'l6_name','l6_email','l6_contact_no'];
  //      }
  //      columnDt = [...columnDt,'delete'];
  //      console.log(columnDt);
  //      this.__columns = columnDt;
  //      console.log(this.__exportedClmns);

  //    }
  //    else{
  //      this.__columns = this.__columnsForDetails;
  //      this.__exportedClmns = ['sl_no','amc_name','R&T',
  //                               'l1_name',
  //                               'l1_email',
  //                               'l1_contact_no',

  //                               'l2_name',
  //                               'l2_email',
  //                               'l2_contact_no',

  //                               'l3_name',
  //                               'l3_email',
  //                               'l3_contact_no',

  //                               'l4_name',
  //                               'l4_email',
  //                               'l4_contact_no',

  //                               'l4_name',
  //                               'l4_email',
  //                               'l4_contact_no',

  //                               'l5_name',
  //                               'l5_email',
  //                               'l5_contact_no',

  //                               'l6_name',
  //                               'l6_email',
  //                               'l6_contact_no',
  //                             ]
  //    }
  //  }
}

getItems(__rnt,__type){
 switch(__type){
  case 'A':
  // this.__detalsSummaryForm.controls['amc_id'].setValue(__rnt.id)
  //             this.__detalsSummaryForm.controls['amc_name'].reset(__rnt.amc_name,{ onlySelf: true,emitEvent: false})
  //             this.searchResultVisibility('none','A');
              break;
  case 'R':   this.__rntSearchForm.controls['rnt_id'].setValue(__rnt.id)
              this.__rntSearchForm.controls['rnt_name'].reset(__rnt.rnt_name,{ onlySelf: true,emitEvent: false})
              this.searchResultVisibility('none','R');
              break;
  default: break;
 }
}
private getRNTmaster(__paginate: string | null = '10') {
  this.__dbIntr
    .api_call(0, '/rnt', 'paginate=' + __paginate)
    .pipe(map((x: any) => x.data))
    .subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    });
}
private setPaginator(__res) {
  this.__selectRNT = new MatTableDataSource(__res);
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
  this.getRNTmaster(this.__pageNumber.value);
}
getPaginate(__paginate){
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url + ('&paginate=' + this.__pageNumber.value)
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}
private updateRow(row_obj: rnt) {
  this.__selectRNT.data = this.__selectRNT.data.filter((value: rnt, key) => {
    if (value.id == row_obj.id) {
      value.rnt_name = row_obj.rnt_name;
      value.website = row_obj.website;
      value.ofc_addr = row_obj.ofc_addr;
      value.cus_care_no = row_obj.cus_care_no;
      value.cus_care_email = row_obj.cus_care_email;
      value.id = row_obj.id;
      value.head_ofc_contact_per = row_obj.head_ofc_contact_per
      value.head_contact_per_mob = row_obj.head_contact_per_mob
      value.head_contact_per_email = row_obj.head_contact_per_email
      value.head_ofc_addr = row_obj.head_ofc_addr

      value.local_ofc_contact_per = row_obj.local_ofc_contact_per
      value.local_contact_per_mob = row_obj.local_contact_per_mob
      value.local_contact_per_email = row_obj.local_contact_per_email
      value.local_ofc_addr = row_obj.local_ofc_addr
    }
    return true;
  });
  this.__export.data = this.__export.data.filter((value: rnt, key) => {
    if (value.id == row_obj.id) {
      value.rnt_name = row_obj.rnt_name;
      value.website = row_obj.website;
      value.ofc_addr = row_obj.ofc_addr;
      value.cus_care_no = row_obj.cus_care_no;
      value.cus_care_email = row_obj.cus_care_email;
      value.id = row_obj.id;
      value.head_ofc_contact_per = row_obj.head_ofc_contact_per
      value.head_contact_per_mob = row_obj.head_contact_per_mob
      value.head_contact_per_email = row_obj.head_contact_per_email
      value.head_ofc_addr = row_obj.head_ofc_addr

      value.local_ofc_contact_per = row_obj.local_ofc_contact_per
      value.local_contact_per_mob = row_obj.local_contact_per_mob
      value.local_contact_per_email = row_obj.local_contact_per_email
      value.local_ofc_addr = row_obj.local_ofc_addr
    }
    return true;
  });
}
submit(){
  const __amcSearch = new FormData();
    __amcSearch.append('rnt_id',this.__rntSearchForm.value.rnt_id);
    __amcSearch.append('contact_person',this.__rntSearchForm.value.contact_person);

     this.__dbIntr.api_call(1,'/rntDetailSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__paginate =res.links;
      this.setPaginator(res.data);
      //  this.showColumns();
       this.tableExport();
     })
}

tableExport(){
  const __amcExport = new FormData();
  __amcExport.append('rnt_id',this.__rntSearchForm.value.rnt_id ? this.__rntSearchForm.value.rnt_id : '');
  this.__dbIntr.api_call(1,'/rntExport',__amcExport).pipe(map((x: any) => x.data)).subscribe((res: rnt[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}
exportPdf(){
  this.__Rpt.downloadReport('#daySheetRpt',
  {
    title: 'R&T '
  }, 'R&T')
}
populateDT(__items: rnt) {
  console.log(__items);
  // this.__utility.navigatewithqueryparams('/main/master/rntmodify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}

openDialog(__rnt: rnt | null = null, __rntId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '60%';
  // dialogConfig.height = "100%";
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'R',
    id: __rntId,
    __rnt: __rnt,
    title: __rntId == 0 ? 'Add R&T' : 'Update R&T',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1,60),
  };
  dialogConfig.id = __rntId > 0 ? __rntId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      RntModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.addRow(dt.data);
        }
      }
    });
  } catch (ex) {
    console.log(ex);

    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'R',
    });
  }
}
private addRow(row_obj: rnt) {
  this.__selectRNT.data.unshift(row_obj);
  this.__selectRNT._updateChangeSubscription();
  this.__export.data.unshift(row_obj);
  this.__export._updateChangeSubscription();
}
}
