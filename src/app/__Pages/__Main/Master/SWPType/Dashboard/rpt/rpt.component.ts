import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit , Inject} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntryComponent } from '../manual-entry/manual-entry.component';

@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RptComponent implements OnInit {
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __SwpType = new FormGroup({
    swp_type_name: new FormControl(''),
  });
  __export = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit', 'sl_no', 'swp_type_name'];
  __exportedClmns: string[] = ['sl_no', 'swp_type_name'];
  __paginate: any = [];
  __selecSwpType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }
  ngOnInit(): void {this.getSWPTypeMst();}
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
     this.getSWPTypeMst(
      this.__sortColumnsAscOrDsc.active,
      this.__sortColumnsAscOrDsc.direction ? this.__sortColumnsAscOrDsc.direction : 'asc'
     )
  }
  getSWPTypeMst(column_name: string | null = '',sort_by: string | null | '' = 'asc') {
    const __SWPTypeSearch = new FormData();
    __SWPTypeSearch.append('swp_type_name',this.__SwpType.value.swp_type_name);
    __SWPTypeSearch.append('paginate', this.__pageNumber.value);
    __SWPTypeSearch.append('column_name', column_name);
    __SWPTypeSearch.append('sort_by', sort_by);
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
     this.__selecSwpType = new MatTableDataSource(res.data);
     this.__paginate = res.links;
  }
  sortData(sort) {
    this.__sortColumnsAscOrDsc = sort;
    this.submit();
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&swp_type_name=' + this.__SwpType.value.swp_type_name) +
            ('&column_name=' + this.__sortColumnsAscOrDsc.active) +
            ('&sort_by=' + this.__sortColumnsAscOrDsc.direction)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
          // this.__paginate = res.links;
        });
    }
  }
  getval(__paginate) {
     this.__pageNumber.setValue(__paginate.toString());
    this.submit();
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
}
