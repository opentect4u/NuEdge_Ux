import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PrdTypeCrudComponent } from '../prdTypeCrud/prd-type-crud.component';
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { productTypeClmns } from 'src/app/__Utility/Master/isnClmns';
import ItemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';

@Component({
  selector: 'app-prd-type-rpt',
  templateUrl: './prd-type-rpt.component.html',
  styleUrls: ['./prd-type-rpt.component.css'],
})
export class PrdTypeRPTComponent implements OnInit {
  sort =new sort();
  itemsPerPage = ItemsPerPage;
  @ViewChildren("insTypeChecked") private __insTypeChecked: QueryList<ElementRef>;
  settings = this.__utility.settingsfroMultiselectDropdown('id','product_type','Search Product Type')
  settings_ins_type = this.__utility.settingsfroMultiselectDropdown('id','type','Search Insurance Type');
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __export = new MatTableDataSource<insPrdType>([]);
  __isVisible: boolean = true;
  __prdType = new FormGroup({
    product_type: new FormControl([]),
    ins_type: new FormControl([],{updateOn:'blur'}),
  });
  __prdTypeMst = new MatTableDataSource<insPrdType>([]);
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __exportedClmns: string[] = productTypeClmns.Columns.filter(item => (item.field!='edit' && item.field!='delete')).map(res => {return res['field']})
  __columns: column[] = productTypeClmns.Columns
  instTypeMst: any = [];
  __insPrdType: insPrdType[] = [];
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<PrdTypeRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {}
  exportPdf() {
    this.__Rpt.downloadReport(
      '#ins_prd_type',
      {
        title: 'Insurance Product Type - '+ new Date().toLocaleDateString(),
      },
      'ProductType'
    );
  }

  ngOnInit() {
    this.getProductTypeMst();
    this.getInsType();

  }
  getProductTypeMstForDropdown(arr_ins_type_id){
    this.__dbIntr.api_call(0,'/ins/productType','arr_ins_type_id='+JSON.stringify(arr_ins_type_id.map(item => {return item['id']}))).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
      this.__insPrdType = res;
    })
  }
  getInsType() {
    this.__dbIntr
      .api_call(0, '/ins/type', null)
      .pipe(pluck('data'))
      .subscribe((res) => {
        this.instTypeMst = res;
      });
  }
  ngAfterViewInit(){
    this.__prdType.controls['ins_type'].valueChanges.subscribe(res =>{
      this.getProductTypeMstForDropdown(res);
    })
  }

  getProductTypeMst() {
    const __prdTypeSearch = new FormData();
    __prdTypeSearch.append(
      'ins_type_id',
      this.__prdType.value.ins_type ? JSON.stringify(this.__prdType.value.ins_type.map(item => {return item['id']})) : "[]"
    );
    __prdTypeSearch.append(
      'product_type',
      JSON.stringify(this.__prdType.value.product_type.map(item => {return item['id']}))
    );
    __prdTypeSearch.append('paginate', this.__pageNumber.value);
    __prdTypeSearch.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __prdTypeSearch.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    this.__dbIntr
      .api_call(1, '/ins/productTypeDetailSearch', __prdTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__prdTypeSearch);
      });
  }
  private setPaginator(__res) {
    this.__prdTypeMst = new MatTableDataSource(__res);
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
  submit() {
    this.getProductTypeMst();
  }

  tableExport(
    __fb: FormData
  ) {
    __fb.delete('paginate');
    this.__dbIntr
      .api_call(1, '/ins/productTypeExport', __fb)
      .pipe(map((x: any) => x.data))
      .subscribe((res: insPrdType[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&ins_type_id=' +  (this.__prdType.value.ins_type ? JSON.stringify(this.__prdType.value.ins_type.map(item => {return item['id']})) : '[]')) +
            ('&product_type=' + (JSON.stringify(this.__prdType.value.product_type.map(item => {return item['id']})))) +
           ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : '')) +
           ('&order='+ (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  openDialog(prdType: insPrdType | null = null, __id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'PRDTYPE',
      id: __id,
      Product_type: prdType,
      title: __id == 0 ? 'Add Product Type' : 'Update Product Type',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(PrdTypeCrudComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__prdTypeMst.data.unshift(dt.data);
            this.__prdTypeMst._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
       console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'PRDTYPE',
      });
    }
  }
  populateDT(__items) {
    this.openDialog(__items, __items.id);
  }
  updateRow(row_obj: insPrdType) {
    this.__prdTypeMst.data = this.__prdTypeMst.data.filter(
      (value: insPrdType, key) => {
        if (value.id == row_obj.id) {
          value.ins_type_id = row_obj.ins_type_id;
          value.product_type = row_obj.product_type;
          value.ins_type = row_obj.ins_type;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: insPrdType, key) => {
      if (value.id == row_obj.id) {
        value.ins_type_id = row_obj.ins_type_id;
        value.product_type = row_obj.product_type;
        value.ins_type = row_obj.ins_type;
      }
      return true;
    });
  }
  refreshOrAdvanceFlt() {
    this.__prdType.patchValue({
      options: '2',
      product_type:[]
    });
    this.__prdType.get('ins_type').setValue([],{emitEvent:false});
    this.sort = new sort();
    this.__pageNumber.setValue('10');
    this.getProductTypeMst();
  }

  delete(__el, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'alertdialog';
    dialogConfig.data = {
      flag: 'S',
      id: __el.id,
      title: 'Delete ' + __el.product_type,
      api_name: '/ins/productTypeDelete',
    };
    const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt.suc == 1) {
          this.__prdTypeMst.data.splice(index, 1);
          this.__prdTypeMst._updateChangeSubscription();
          this.__export.data.splice(
            this.__export.data.findIndex((x: any) => x.id == __el.id),
            1
          );
          this.__export._updateChangeSubscription();
        }
      }
    });
  }
  customSort(ev){
    this.sort.order=ev.sortOrder;
    this.sort.field=ev.sortField;
    if(ev.sortField){
     this.getProductTypeMst();
    }
  }
  onselectItem(ev){
    this.getProductTypeMst();
  }
}
