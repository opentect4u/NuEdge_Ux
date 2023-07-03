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
import { column } from 'src/app/__Model/tblClmns';
import { bankClmns } from 'src/app/__Utility/Master/bankClmns';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
@Component({
selector: 'bnkRpt-component',
templateUrl: './bnkRpt.component.html',
styleUrls: ['./bnkRpt.component.css']
})
export class BnkrptComponent implements OnInit {
  itemsPerPage=ItemsPerPage;
  sort=new sort();
  @ViewChild('searchMicr') __searchMicr: ElementRef;
  // @ViewChild('searchIfs') __searchIfs: ElementRef;
  __ismicrspinner: boolean = false;
  // __isifsspinner: boolean = false;
  // __bnkMstforIfs: bank[] =[];
  __bnkMstformicr: bank[] =[];
  __catForm = new FormGroup({
    bnk_name: new FormControl(''),
    micr_code: new FormControl(''),
    // ifsc: new FormControl(''),
    options:new FormControl('2'),
    bnk_addr:new FormControl('')
  })
  __export =  new MatTableDataSource<bank>([]);
  __pageNumber = new FormControl(10);
  __columns: column[] =[];

  __exportedClmns: string[]
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
  this.setColumns(2);
}

setColumns(res){
  const clmToRemoveforExport = ['edit','delete'];
   if(res == 2){
    const clmToRemove = ['micr_code','branch_name','branch_addr',]
    this.__columns = bankClmns.COLUMN.filter(item => !clmToRemove.includes(item.field));
   }
   else{
    this.__columns = bankClmns.COLUMN;
   }
   this.__exportedClmns = this.__columns.filter(item => !clmToRemoveforExport.includes(item.field)).map(item=> {return item['field']});
}

 getBankMst(column_name: string | null = '',sort_by: string | null | '' ='asc'){
  const __bnkSearch = new FormData();

  __bnkSearch.append('bnk_addr',this.__catForm.value.bnk_addr ? this.__catForm.value.bnk_addr : '');
  __bnkSearch.append('bnk_name',this.__catForm.value.bnk_name ? this.__catForm.value.bnk_name : '');
  __bnkSearch.append('micr_code',this.__catForm.value.micr_code ? this.__catForm.value.micr_code : '');
  // __bnkSearch.append('ifsc',this.__catForm.value.ifsc ? this.__catForm.value.ifsc : '');
  __bnkSearch.append('paginate',this.__pageNumber.value);
  __bnkSearch.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
  __bnkSearch.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
   this.__dbIntr.api_call(1,'/depositbankDetailSearch',__bnkSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.tableExport(__bnkSearch);
   })

 }

tableExport(__bnkExport){
  __bnkExport.delete('paginate')
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
      this.__catForm.controls['bnk_name'].setValue('');
    },
    complete: () => console.log(''),
    error: (err) => console.log(),
  });

  // this.__catForm.controls['ifsc'].valueChanges
  // .pipe(
  //   tap(() => this.__isifsspinner = true),
  //   debounceTime(200),
  //   distinctUntilChanged(),
  //   switchMap((dt) =>
  //     dt?.length > 1
  //       ? this.__dbIntr.searchItems(
  //         '/depositbank',
  //         dt)
  //       : []
  //   ),
  //   map((x: responseDT) => x.data),
  // )
  // .subscribe({
  //   next: (value) => {
  //     this.__bnkMstforIfs = value;
  //     this.searchResultVisibility('block','I')
  //     this.__isifsspinner = false;
  //   },
  //   complete: () => console.log(''),
  //   error: (err) => console.log(),
  // });

  this.__catForm.controls['options'].valueChanges.subscribe(res =>{
    this.setColumns(res);
  })
}

private setPaginator(__res) {
  this.__selectPLN = new MatTableDataSource(__res);
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&bnk_addr=' + this.__catForm.value.bnk_addr ? this.__catForm.value.bnk_addr : '')
        + ('&bnk_name=' + this.__catForm.value.bnk_name ? this.__catForm.value.bnk_name : '')
        + ('&micr_code=' + this.__catForm.value.micr_code ? this.__catForm.value.micr_code : '')
        // + ('&ifsc=' + this.__catForm.value.ifsc ? this.__catForm.value.ifsc : '')
        +('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : ''))
        + ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}


populateDT(__items: bank) {
  this.openDialog(__items, __items.id);
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
   this.getBankMst();
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
  //  case 'I':
  //   this.__searchIfs.nativeElement.style.display = display_mode;
  //    break;
  }
}
getItems(__amc,__type){
  console.log(__amc);
 switch(__type){
  case 'M': this.__catForm.controls['micr_code'].reset(__amc.bank_name,{ onlySelf: true,emitEvent: false})
              this.searchResultVisibility('none','M');
              break;
  // case 'I':
  //             this.__catForm.controls['ifsc'].reset(__amc.ifs_code,{ onlySelf: true,emitEvent: false})
  //             this.searchResultVisibility('none','I');
  //             break;
  default: break;
 }
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
customSort(ev){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  this.submit();
}
onselectItem(ev){
  this.__pageNumber.setValue(ev.option.value);
  this.submit();
}
}
