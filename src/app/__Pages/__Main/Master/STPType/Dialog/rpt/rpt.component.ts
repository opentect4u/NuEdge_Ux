import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntrComponent } from '../manual-entr/manual-entr.component';
import ItemsPerPage from '../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { stpTypeClmns } from 'src/app/__Utility/Master/trans';
import { column } from 'src/app/__Model/tblClmns';
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RPTComponent implements OnInit {
  itemsPerPage=ItemsPerPage;
  sort=new sort();
  __StpType = new FormGroup({
    stp_type_name: new FormControl(''),
  });
  __export = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __columns: column[] = stpTypeClmns.COLUMN
  __exportedClmns: string[] = ['sl_no', 'stp_type_name'];
  __paginate: any = [];
  __selecStpType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private utility: UtiliService
  ) { }
  ngOnInit(): void {}
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
  submit(){
     this.getSTPTypeMst()
  }
  getSTPTypeMst() {
    const __STPTypeSearch = new FormData();
    __STPTypeSearch.append('stp_type_name',this.__StpType.value.stp_type_name);
    __STPTypeSearch.append('paginate', this.__pageNumber.value);
    __STPTypeSearch.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __STPTypeSearch.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
    this.__dbIntr
      .api_call(1, '/stpTypeSearch', __STPTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.setPaginator(res);
        this.tableExport(__STPTypeSearch);
      });
  }

  tableExport(__STPTypeExport: FormData){
    __STPTypeExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/stpTypeExport', __STPTypeExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  setPaginator(res){
     this.__selecStpType = new MatTableDataSource(res.data);
     this.__paginate = res.links;
  }

  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&stp_type_name=' + this.__StpType.value.stp_type_name) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    }
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
      flag:'STP',
       id: el.id,
       title: 'Update STP Type',
       items: el,
      product_id: this.data.product_id
    };
    dialogConfig.id = el.id;
    try {
      const dialogref = this.__dialog.open(
        ManualEntrComponent,
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
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'STP',
      });
    }

  }
  updateRow(row_obj){

      this.__selecStpType.data = this.__selecStpType.data.filter((value , key) => {
        if (value.id == row_obj.id) {
          value.stp_type_name = row_obj.stp_type_name;
        }
        return true;
      });
      this.__export.data = this.__export.data.filter((value , key) => {
        if (value.id == row_obj.id) {
          value.stp_type_name = row_obj.stp_type_name;
        }
        return true;
      });
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
