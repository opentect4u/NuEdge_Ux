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
import { map } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { option } from 'src/app/__Model/option';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { OptionModificationComponent } from '../optionModification/optionModification.component';
import * as XLSX from 'xlsx';
import { sort } from 'src/app/__Model/sort';
import ItemPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { column } from 'src/app/__Model/tblClmns';
import { optClmns } from 'src/app/__Utility/Master/optionClmns';
@Component({
  selector: 'optRpt-component',
  templateUrl: './optRpt.component.html',
  styleUrls: ['./optRpt.component.css'],
})
export class OptrptComponent implements OnInit {

  /**
   * Holfing form data after submit form
   */
  formValue;

  itemsPerPage= ItemPerPage
  sort = new sort();
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    option: new FormControl(''),
    options: new FormControl('2'),
  });
  __export = new MatTableDataSource<option>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = optClmns.COLUMN;
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
    this.formValue = this.__catForm.value;
  }
  getoptionMst() {
    const __optionSrch = new FormData();
    __optionSrch.append('option', this.formValue?.option);
    __optionSrch.append('paginate', this.__pageNumber.value);
    __optionSrch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __optionSrch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/optionDetailSearch', __optionSrch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__optionSrch);
      });
  }

  tableExport(__optionSrch) {
    __optionSrch.delete('paginate');
    this.__dbIntr
      .api_call(1, '/optionExport', __optionSrch)
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
            ('&option=' + this.formValue?.option) +
            ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
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
        title: 'Option - '+ new Date().toLocaleDateString(),
      },
      'Option',
      'p'
    );
  }
  submit() {
    this.formValue = this.__catForm.value;
    this.getoptionMst();
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
  customSort(ev){
    if(ev.sortField != 'edit' && ev.sortField != 'delete'){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.getoptionMst();
    }
  }
  onselectItem(ev){
    this.getoptionMst();
  }
}
