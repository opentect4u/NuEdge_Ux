import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { map } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { option } from 'src/app/__Model/option';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { OptionModificationComponent } from '../optionModification/optionModification.component';
import * as XLSX from 'xlsx';
@Component({
  selector: 'optRpt-component',
  templateUrl: './optRpt.component.html',
  styleUrls: ['./optRpt.component.css'],
})
export class OptrptComponent implements OnInit {
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    option: new FormControl(''),
    options: new FormControl('2'),
  });
  __export = new MatTableDataSource<option>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','delete', 'sl_no', 'opt_name'];
  __exportedClmns: string[] = ['sl_no', 'opt_name'];
  __paginate: any = [];
  __selectOption = new MatTableDataSource<option>([]);
  __isVisible: boolean = true;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<OptrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.getoptionMst();
  }
  getoptionMst(
    column_name: string | null = '',
    sort_by: string | null | '' = 'asc'
  ) {
    const __optionSrch = new FormData();
    __optionSrch.append('option', this.__catForm.value.option);
    __optionSrch.append('paginate', this.__pageNumber.value);
    __optionSrch.append('column_name', column_name);
    __optionSrch.append('sort_by', sort_by);
    this.__dbIntr
      .api_call(1, '/optionDetailSearch', __optionSrch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(column_name, sort_by);
      });
  }

  tableExport(column_name: string | null = '', sort_by: string | null = 'asc') {
    const __optExport = new FormData();
    __optExport.append(
      'opt_name',
      this.__catForm.value.option ? this.__catForm.value.option : ''
    );
    __optExport.append('column_name', column_name);
    __optExport.append('sort_by', sort_by);
    this.__dbIntr
      .api_call(1, '/optionExport', __optExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: option[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  private setPaginator(__res) {
    this.__selectOption = new MatTableDataSource(__res);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&option=' + this.__catForm.value.option) +
            ('&column_name=' + this.__sortColumnsAscOrDsc.active) +
            ('&sort_by=' + this.__sortColumnsAscOrDsc.direction)
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
    this.getoptionMst(
      this.__sortColumnsAscOrDsc.active,
      this.__sortColumnsAscOrDsc.direction
    );
  }

  populateDT(__items: option) {
    this.openDialog(__items, __items.id);
  }

  openDialog(__category: option | null = null, __catId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'O',
      id: __catId,
      items: __category,
      title: __catId == 0 ? 'Add Option' : 'Update Option',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        OptionModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectOption.data.unshift(dt.data);
            this.__selectOption._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'O',
      });
    }
  }
  private updateRow(row_obj: option) {
    this.__selectOption.data = this.__selectOption.data.filter(
      (value: option, key) => {
        if (value.id == row_obj.id) {
          value.opt_name = row_obj.opt_name;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: option, key) => {
      if (value.id == row_obj.id) {
        value.opt_name = row_obj.opt_name;
      }
      return true;
    });
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

  exportPdf() {
    this.__Rpt.downloadReport(
      '#Option',
      {
        title: 'Option ',
      },
      'Option'
    );
  }
  submit() {
    this.getoptionMst(
      this.__sortColumnsAscOrDsc.active,
      this.__sortColumnsAscOrDsc.direction
    );
  }

  sortData(sort) {
    this.__sortColumnsAscOrDsc = sort;
    this.submit();
  }
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'O',
        id: __el.id,
        title: 'Delete '  + __el.opt_name,
        api_name:'/optionDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selectOption.data.splice(index,1);
            this.__selectOption._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
  }
  exportTbl(){
    // let { sheetName, fileName } = getFileName(name);
    let targetTableElm = document.getElementById('Option');
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: 'AMC'
    });
    XLSX.writeFile(wb, `option.xlsx`,{cellStyles:true});
  }

}
