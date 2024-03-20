import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit , Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntryComponent } from '../manual-entry/manual-entry.component';
import ItemsPerPage from '../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { column } from 'src/app/__Model/tblClmns';
import { swpTypeClmns } from 'src/app/__Utility/Master/trans';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RptComponent implements OnInit {

  formValue;
  itemsPerPage=ItemsPerPage;
  sort=new sort();
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __SwpType = new FormGroup({
    swp_type_name: new FormControl(''),
  });
  __export = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = swpTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'swp_type_name'];
  __paginate: any = [];
  __selecSwpType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  @ViewChild('dt') primeTbl :Table;

  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }
  ngOnInit(): void {
    this.formValue = this.__SwpType.value;
    this.getSWPTypeMst();
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
    this.dialogRef.updateSize('40%', '47px');
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
  submit(){
    this.formValue = this.__SwpType.value;
     this.getSWPTypeMst(
      this.__sortColumnsAscOrDsc.active,
      this.__sortColumnsAscOrDsc.direction ? this.__sortColumnsAscOrDsc.direction : 'asc'
     )
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }
  getSWPTypeMst(column_name: string | null = '',sort_by: string | null | '' = 'asc') {
    const __SWPTypeSearch = new FormData();
    __SWPTypeSearch.append('swp_type_name',this.formValue?.swp_type_name);
    __SWPTypeSearch.append('paginate', this.__pageNumber.value);
    __SWPTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __SWPTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/swpTypeSearch', __SWPTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.setPaginator(res);
        this.tableExport(__SWPTypeSearch);
      });
  }

  tableExport(__SWPTypeExport: FormData){
    __SWPTypeExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/swpTypeExport', __SWPTypeExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  setPaginator(res){
     this.__selecSwpType = new MatTableDataSource(res);
    //  this.__paginate = res.links;
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&swp_type_name=' + this.formValue?.swp_type_name) +
            ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    }
  }
  updateRow(row_obj){

    this.__selecSwpType.data = this.__selecSwpType.data.filter((value , key) => {
      if (value.id == row_obj.id) {
        value.swp_type_name = row_obj.swp_type_name;
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value , key) => {
      if (value.id == row_obj.id) {
        value.swp_type_name = row_obj.swp_type_name;
      }
      return true;
    });
}
populateDT(el){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag:'SWP',
       id: el.id,
       title: 'Update SWP Type',
       items: el,
      product_id: this.data.product_id
    };
    dialogConfig.id = el.id;
    try {
      const dialogref = this.__dialog.open(
        ManualEntryComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          this.updateRow(dt.data);
        }

      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SWP',
      });
    }
}
customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField!='delete'){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  this.getSWPTypeMst();
}
}
onselectItem(ev){
  this.getSWPTypeMst();
}
exportPdf(){
  this.__Rpt.downloadReport(
    '#swpType',
    {
      title: 'SWP Type - ' + new Date().toLocaleDateString(),
    },
    'SWP Type',
    'p'
  );
}
}
