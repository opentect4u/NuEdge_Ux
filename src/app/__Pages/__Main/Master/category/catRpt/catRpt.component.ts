import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  map,
} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { category } from 'src/app/__Model/__category';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CategoryModificationComponent } from '../categoryModification/categoryModification.component';
import { column } from 'src/app/__Model/tblClmns';
import { categoryClmn} from 'src/app/__Utility/Master/categoryClmns';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
@Component({
  selector: 'Category-catRpt',
  templateUrl: './catRpt.component.html',
  styleUrls: ['./catRpt.component.css'],
})
export class CatrptComponent implements OnInit {
  itemsPerPage = ItemsPerPage;
  sort = new sort();
  __iscatspinner: boolean = false;
  __catMst: category[] = [];
  __catForm = new FormGroup({
    cat_name: new FormControl(''),
    cat_id: new FormControl(''),
    options: new FormControl('2'),
  });
  __export = new MatTableDataSource<category>([]);
  __pageNumber = new FormControl(10);
  __columns: column[] = categoryClmn.COLUMN;
  __exportedClmns: string[] = ['sl_no','cat_name'];
  __paginate: any = [];
  __selectCategory = new MatTableDataSource<category>([]);
  __isVisible: boolean = true;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<CatrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
  }

  getcatMst() {
    const __catExport = new FormData();
    __catExport.append('cat_name', this.__catForm.value.cat_name);
    __catExport.append('paginate', this.__pageNumber.value);
    __catExport.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __catExport.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
    this.__dbIntr
      .api_call(1, '/categoryDetailSearch', __catExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__catExport);
      });
  }

  tableExport(__catExport) {
    __catExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/categoryExport', __catExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: category[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  setPaginator(__res) {
    this.__selectCategory = new MatTableDataSource(__res);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            +('&cat_name=' + this.__catForm.value.cat_name)
            +('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }

  populateDT(__items: category) {
    this.openDialog(__items, __items.id);
  }
  showCorrospondingSubCategory(__items) {
    this.dialogRef.close();
    this.__utility.navigatewithqueryparams(
      'main/master/productwisemenu/subcategory',
      {
        queryParams: {
          id: btoa(__items.id.toString()),
          product_id: this.data.product_id
        },
      }
    );

  }
  openDialog(__category: category | null = null, __catId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'C',
      id: __catId,
      items: __category,
      title: __catId == 0 ? 'Add Category' : 'Update Category',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CategoryModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectCategory.data.unshift(dt.data);
            this.__selectCategory._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: __catId,
        isVisible: false,
        flag: 'C',
      });
    }
  }
  private updateRow(row_obj: category) {
    this.__selectCategory.data = this.__selectCategory.data.filter(
      (value: category, key) => {
        if (value.id == row_obj.id) {
          value.cat_name = row_obj.cat_name;
          value.product_id = row_obj.product_id;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: category, key) => {
      if (value.id == row_obj.id) {
        value.cat_name = row_obj.cat_name;
        value.product_id = row_obj.product_id;
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
      '#category',
      {
        title: 'Category ',
      },
      'Category'
    );
  }
  submit() {
   this.getcatMst();
  }

  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'C',
      id: __el.id,
      title: 'Delete '  + __el.cat_name,
      api_name:'/catDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectCategory.data.splice(index,1);
          this.__selectCategory._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
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
