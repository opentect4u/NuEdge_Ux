import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild, ElementRef} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { BnkModificationComponent } from '../bnkModification/bnkModification.component';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';

@Component({
selector: 'bnkRpt-component',
templateUrl: './bnkRpt.component.html',
styleUrls: ['./bnkRpt.component.css']
})
export class BnkrptComponent implements OnInit {
  @ViewChild('searchMicr') __searchMicr: ElementRef;
  @ViewChild('searchIfs') __searchIfs: ElementRef;
  __ismicrspinner: boolean = false;
  __isifsspinner: boolean = false;
  __bnkMstforIfs: bank[] =[];
  __bnkMstformicr: bank[] =[];
  __columnsForsummary: string[] = [
    'edit',
    'sl_no',
    'bank_name',
    'ifsc_code',
    'delete'];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'bank_name',
    'ifsc_code',
    'micr_code',
    'branch_name',
    'branch_addr',
    'delete'];
  __catForm = new FormGroup({
    bnk_name: new FormControl(''),
    micr_code: new FormControl(''),
    ifsc: new FormControl(''),
    options:new FormControl('2')
  })
  __export =  new MatTableDataSource<bank>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __exportedClmns: string[] = ['sl_no', 'bank_name','ifsc_code'];
  __paginate: any= [];
  __selectPLN = new MatTableDataSource<bank>([]);
  __isVisible: boolean = true;
  __sortAscOrDsc = {active:'',direction:'asc'}
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<BnkrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
   this.getBankMst();
  this.__columns =this.__columnsForsummary;
}

 getBankMst(column_name: string | null = '',sort_by: string | null | '' ='asc'){
  const __bnkSearch = new FormData();
  __bnkSearch.append('bnk_name',this.__catForm.value.bnk_name ? this.__catForm.value.bnk_name : '');
  __bnkSearch.append('micr_code',this.__catForm.value.micr_code ? this.__catForm.value.micr_code : '');
  __bnkSearch.append('ifsc',this.__catForm.value.ifsc ? this.__catForm.value.ifsc : '');
  __bnkSearch.append('paginate',this.__pageNumber.value);
  __bnkSearch.append('column_name',column_name);
  __bnkSearch.append('sort_by',sort_by);
   this.__dbIntr.api_call(1,'/depositbankDetailSearch',__bnkSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.tableExport(column_name,sort_by);
   })

 }

tableExport(column_name: string | null = '',sort_by: string | null | '' ='asc'){
  const __bnkExport = new FormData();
  __bnkExport.append('column_name',column_name);
  __bnkExport.append('sort_by',sort_by);
  __bnkExport.append('bnk_name',this.__catForm.value.bnk_name ? this.__catForm.value.bnk_name : '');
  __bnkExport.append('micr_code',this.__catForm.value.micr_code ? this.__catForm.value.micr_code : '');
  __bnkExport.append('ifsc',this.__catForm.value.ifsc ? this.__catForm.value.ifsc : '');
  this.__dbIntr.api_call(1,'/depositbankExport',__bnkExport).pipe(map((x: any) => x.data)).subscribe((res: bank[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}


ngAfterViewInit(){
  this.__catForm.controls['micr_code'].valueChanges
  .pipe(
    tap(() => this.__ismicrspinner = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1
        ? this.__dbIntr.searchItems(
          '/depositbank',
          dt)
        : []
    ),
    map((x: responseDT) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__bnkMstformicr = value;
      this.searchResultVisibility('block','M')
      this.__ismicrspinner = false;
    },
    complete: () => console.log(''),
    error: (err) => console.log(),
  });

  this.__catForm.controls['ifsc'].valueChanges
  .pipe(
    tap(() => this.__isifsspinner = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1
        ? this.__dbIntr.searchItems(
          '/depositbank',
          dt)
        : []
    ),
    map((x: responseDT) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__bnkMstforIfs = value;
      this.searchResultVisibility('block','I')
      this.__isifsspinner = false;
    },
    complete: () => console.log(''),
    error: (err) => console.log(),
  });

  this.__catForm.controls['options'].valueChanges.subscribe(res =>{
    // this.__columns = res == '1' ?  this.__columnsForDetails : this.__columnsForsummary;
    if(res == '1'){
      this.__columns = this.__columnsForDetails;
      this.__exportedClmns = ['sl_no',
        'bank_name',
        'ifsc_code',
        'micr_code',
        'branch_name',
        'branch_addr'];
    }
    else{
      this.__columns = this.__columnsForsummary;
      this.__exportedClmns = ['sl_no',
      'bank_name',
      'ifsc_code'];
    }

  })

}

private setPaginator(__res) {
  this.__selectPLN = new MatTableDataSource(__res);
  // this.__selectPLN.paginator = this.paginator;
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&bnk_name=' + this.__catForm.value.bnk_name ? this.__catForm.value.bnk_name : '')
        + ('&micr_code=' + this.__catForm.value.micr_code ? this.__catForm.value.micr_code : '')
        + ('&ifsc=' + this.__catForm.value.ifsc ? this.__catForm.value.ifsc : '')
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}
getval(__paginate) {
   this.__pageNumber.setValue(__paginate.toString());
  // this.getBankmaster(this.__pageNumber.value);
  this.submit();
}

populateDT(__items: bank) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}
showCorrospondingAMC(__items) {
  this.__utility.navigatewithqueryparams(
    'main/master/productwisemenu/subcategory',
    {
      queryParams: { id: btoa(__items.id.toString()) },
    }
  );
}
openDialog(__category: bank | null = null, __catId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'B',
    id: __catId,
    items: __category,
    title: __catId == 0 ? 'Add Bank' : 'Update Bank',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      BnkModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectPLN.data.unshift(dt.data);
          this.__selectPLN._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'B',
    });
  }
}
private updateRow(row_obj: bank) {
  this.__selectPLN.data = this.__selectPLN.data.filter(
    (value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name
         value.branch_addr = row_obj.branch_addr,
          value.branch_name = row_obj.branch_name,
          value.ifs_code = row_obj.ifs_code,
          value.micr_code = row_obj.micr_code
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name
        value.branch_addr = row_obj.branch_addr,
         value.branch_name = row_obj.branch_name,
         value.ifs_code = row_obj.ifs_code,
         value.micr_code = row_obj.micr_code
      }
      return true;
    }
  );
}
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
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

exportPdf(){
  this.__Rpt.downloadReport('#bnk',
  {
    title: 'Bank '
  }, 'Bank')
}
submit(){
   this.getBankMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}

outsideClick(__ev,__mode){
  if(__ev){
     this.searchResultVisibility('none',__mode)
  }
}
searchResultVisibility(display_mode,__mode) {
  switch(__mode){
    case 'M':
  this.__searchMicr.nativeElement.style.display = display_mode;
   break;
   case 'I':
    this.__searchIfs.nativeElement.style.display = display_mode;
     break;
  }
}
getItems(__amc,__type){
  console.log(__amc);
 switch(__type){
  case 'M': this.__catForm.controls['micr_code'].reset(__amc.bank_name,{ onlySelf: true,emitEvent: false})
              this.searchResultVisibility('none','M');
              break;
  case 'I':
              this.__catForm.controls['ifsc'].reset(__amc.ifs_code,{ onlySelf: true,emitEvent: false})
              this.searchResultVisibility('none','I');
              break;
  default: break;
 }
}
sortData(sort){
  this.__sortAscOrDsc =sort;
  this.submit();
}
delete(element,index){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.role = "alertdialog";
  dialogConfig.data = {
    flag: 'B',
    id: element.id,
    title: 'Delete '  + element.bank_name,
    api_name:'/depositbankDelete'
  };
  const dialogref = this.__dialog.open(
    DeletemstComponent,
    dialogConfig
  );
  dialogref.afterClosed().subscribe((dt) => {
    if(dt){
      if(dt.suc == 1){
        this.__selectPLN.data.splice(index,1);
        this.__selectPLN._updateChangeSubscription();
        this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == element.id),1);
        this.__export._updateChangeSubscription();
      }
    }

  })
}
}
