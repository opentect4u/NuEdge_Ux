import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { insComp } from 'src/app/__Model/insComp';
import { insPrdType } from 'src/app/__Model/insPrdType';
import { insProduct } from 'src/app/__Model/insproduct';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ProductCrudComponent } from '../product-crud/product-crud.component';
import { column } from 'src/app/__Model/tblClmns';
import { productClmns } from 'src/app/__Utility/Master/isnClmns';
import ItemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';

@Component({
  selector: 'app-product-rpt',
  templateUrl: './product-rpt.component.html',
  styleUrls: ['./product-rpt.component.css']
})
export class ProductRPTComponent implements OnInit {
  formValue;
  itemsPerPage = ItemsPerPage;
  __isAllSpinner:boolean = false;
  SearchAllMst:any=[];
  // displayMode_forSearch:string;
  sort=new sort();
  __settings_prod = this.__utility.settingsfroMultiselectDropdown('id','product_name','Search Product',1);
  __settings_ins = this.__utility.settingsfroMultiselectDropdown('id','type','Search Type Of Insurance',1);
  __settings_productType = this.__utility.settingsfroMultiselectDropdown('id','product_type','Search Product Type',1);
  __settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Companies',1);
  __prdSearchForm = new FormGroup({
    ins_type_id: new FormControl([],{updateOn:'blur'}),
    product_name: new FormControl([]),
    company_id: new FormControl([],{updateOn:'blur'}),
    product_type_id: new FormControl([],{updateOn:'blur'}),
    search_all: new FormControl(''),
    // search_all_id: new FormControl('')
  });
  __exportedClmns: string[] = productClmns.Columns.filter(item => (item.field!='edit' && item.field!='delete')).map(res => {return res['field']})
  __columns: column[] = productClmns.Columns
  __isVisible : boolean = true;

  __selectPrdMst = new MatTableDataSource<insProduct>([]);
  __exportPrdMst = new MatTableDataSource<insProduct>([])
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __companyMst: insComp[] = [];
  __prdTypeMst: insPrdType[] = [];
  __productMst: insProduct[]= [];
  __insTypeMst: any=[];
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ProductRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {
  }
  ngOnInit(): void {
    this.getInsTypeMst();
    this.searchProduct();
  }

  getproductTypeMst(arr_ins_type_id){
       if(arr_ins_type_id.length > 0){
   this.__dbIntr.api_call(0,'/ins/productType','arr_ins_type_id='+JSON.stringify(arr_ins_type_id.map(item => item.id))).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
    this.__prdTypeMst = res;
   })}
   else{
    this.__prdTypeMst.length = 0;
    this.__prdSearchForm.controls['product_type_id'].setValue([],{emitEvent:true});
   }

  //   if(arr_comp_ids.length > 0){
  //  this.__dbIntr.api_call(0,'/ins/productType','arr_comp_id='+JSON.stringify(arr_comp_ids.map(item => item.id))).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
  //   this.__prdTypeMst = res;
  //  })}
  //  else{
  //   this.__prdTypeMst.length = 0;
  //   this.__prdSearchForm.controls['product_type_id'].setValue([],{emitEvent:true});
  //  }
  }
  getcompanyMst(arr_ins_type_ids){
    if(arr_ins_type_ids.length > 0){
    this.__dbIntr.api_call(0,'/ins/company','arr_ins_type_id='+JSON.stringify(arr_ins_type_ids.map(item => item.id)))
    .pipe(pluck("data")).subscribe((res: insComp[]) =>{
      this.__companyMst = res;
      // if(this.data.company_id){
      //  this.__prdSearchForm.patchValue({
      //   company_id:this.__companyMst.filter((x: any) => x.id == Number(this.data.company_id)).map((x: insComp) =>
      //   ({
      //     id:x.id,
      //     comp_short_name:x.comp_short_name
      //   })
      //   )
      //  });
      //  console.log( this.__prdSearchForm.value.company_id);

      // }
    })}
    else{
      this.__companyMst.length = 0;
      this.__prdSearchForm.controls['company_id'].setValue([],{emitEvent:true});
    }
  }
  ngAfterViewInit(){

    // this.__prdSearchForm.controls['search_all'].valueChanges
    // .pipe(
    //   tap(() => this.__isAllSpinner = true),
    //   debounceTime(200),
    //   distinctUntilChanged(),
    //   switchMap((dt) =>
    //     dt?.length > 1
    //       ? this.__dbIntr.searchItems(
    //         '/searchAll',
    //         dt)
    //       : []
    //   ),
    //   map((x: responseDT) => x.data),
    // )
    // .subscribe({
    //   next: (value) => {
    //     this.__prdSearchForm.controls['search_all_id'].setValue('')
    //     this.SearchAllMst = value;
    //     this.searchResultVisibility('block')
    //     this.__isAllSpinner = false;
    //   },
    //   complete: () => console.log(''),
    //   error: (err) => console.log(),
    // });

  this.__prdSearchForm.controls['ins_type_id'].valueChanges.subscribe(res =>{
    this.getcompanyMst(res);
    this.getproductTypeMst(res);
  })
  // this.__prdSearchForm.controls['company_id'].valueChanges.subscribe(res =>{
  //   this.getproductTypeMst(res);
  // })

  this.__prdSearchForm.controls['product_type_id'].valueChanges.subscribe(res =>{
    this.getProductMst(res);
  })
  }
  getProductMst(arr_prod_type_ids){
    if(arr_prod_type_ids.length > 0){
      this.__dbIntr.api_call(0,'/ins/product','arr_product_type_id='+ JSON.stringify(arr_prod_type_ids.map(item => item.id)))
      .pipe(pluck("data")).subscribe((res:insProduct[]) =>{
          this.__productMst = res;
      })
      }
      else{
        this.__productMst.length = 0;
        this.__prdSearchForm.controls['product_name'].setValue([]);
      }
  }
  // searchResultVisibility(display_mode){
  //   this.displayMode_forSearch = display_mode;
  // }
  getInsTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe((res: any) =>{
         this.__insTypeMst = res;
    })
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
  getproductMst(){
    const __fb = new FormData();
    console.log(JSON.stringify(this.formValue?.company_id));
    __fb.append('product_name',JSON.stringify(this.formValue?.product_name.map(item => item.id)));
    __fb.append('company_id',JSON.stringify(this.formValue?.company_id.map(item => item.id)));
    __fb.append('search_all',global.getActualVal(this.formValue?.search_all));
    __fb.append('ins_type_id',JSON.stringify(this.formValue?.ins_type_id.map(item => {return item['id']})));
    __fb.append('paginate', this.__pageNumber.value);
    __fb.append('product_type_id',JSON.stringify(this.formValue?.product_type_id.map(item => item.id)))
    __fb.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''));
    __fb.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1'));
     this.__dbIntr.api_call(1,'/ins/productDetailSearch',__fb).pipe(pluck("data")).subscribe((res: any) =>{
        this.__selectPrdMst = new MatTableDataSource(res.data);
        this.__paginate = res.links;
        this.tableExport(__fb);
     })
  }
  tableExport(__fb){
    __fb.delete('paginate');
    this.__dbIntr.api_call(1,'/ins/productExport',__fb) .pipe(pluck("data"))
    .subscribe((res: insProduct[]) => {
      this.__exportPrdMst = new MatTableDataSource(res);
    });
  }
  searchProduct(){
    this.formValue = this.__prdSearchForm.value;
    this.getproductMst();
  }
  exportPdf(){
    this.__Rpt.downloadReport(
      '#insProd',
      {
        title: 'Insurance Product - '+ new Date().toLocaleDateString(),
      },
      'InsProduct'
    );
  }
  delete(__el:insProduct,index: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'P',
      id: __el.id,
      title: 'Delete '  + __el.product_name,
      api_name:'/ins/productDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectPrdMst.data.splice(index,1);
          this.__selectPrdMst._updateChangeSubscription();
          this.__exportPrdMst.data.splice(this.__exportPrdMst.data.findIndex((x: any) => x.id == __el.id),1);
          this.__exportPrdMst._updateChangeSubscription();
        }
      }

    })
  }
  populateDT(__el: insProduct){
   this.openDialog(__el,__el.id)
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + (this.__pageNumber.value)) +
            ('&search_all='+global.getActualVal(this.formValue?.search_all))+
            ('&product_name=' + (JSON.stringify(this.formValue?.product_name.map(item => {return item['id']})))) +
            ('&ins_type_id=' +  (JSON.stringify(this.formValue?.ins_type_id.map(item => {return item['id']})))) +
            ('&company_id=' +  (JSON.stringify(this.formValue?.company_id.map(item => item.id)))) +
            ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : '')) +
            ('&product_type_id='+ (JSON.stringify(this.formValue?.product_type_id.map(item => item.id))))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__selectPrdMst = new MatTableDataSource(res.data);
          this.__paginate = res.links;
        });
    }
  }
  openDialog(product: insProduct,__id: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'INSPRODUCT',
      id: __id,
      product: product,
      title: __id == 0 ? 'Add Product' : 'Update Product',
      product_id:this.data.product_id,
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ProductCrudComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.id > 0){
            //update Row
            this.updateRow(dt.data)
          }
          else{
            //Add Row
            this.__exportPrdMst.data.unshift(dt.data);
            this.__exportPrdMst._updateChangeSubscription();
            this.__selectPrdMst.data.unshift(dt.data);
            this.__selectPrdMst._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'INSPRODUCT',
      });
    }
  }
  updateRow(row_obj){
    this.__selectPrdMst.data = this.__selectPrdMst.data.filter((value: insProduct, key) => {
      if (value.id == row_obj.id) {
        value.id = row_obj.id;
        value.company_id = row_obj.company_id;
        value.comp_full_name = row_obj.comp_full_name;
        value.comp_short_name = row_obj.comp_short_name;
        value.product_name = row_obj.product_name;
        value.ins_type_id = row_obj.ins_type_id;
        value.ins_type_name = row_obj.ins_type_name;
        value.product_type_id = row_obj.product_type_id
        value.product_type = row_obj.product_type
      }
      return true;
    });

    this.__exportPrdMst.data = this.__exportPrdMst.data.filter((value: insProduct, key) => {
      if (value.id == row_obj.id) {
        value.id = row_obj.id;
        value.company_id = row_obj.company_id;
        value.comp_full_name = row_obj.comp_full_name;
        value.comp_short_name = row_obj.comp_short_name;
        value.product_name = row_obj.product_name;
        value.ins_type_id = row_obj.ins_type_id;
        value.ins_type_name = row_obj.ins_type_name;
        value.product_type_id = row_obj.product_type_id
        value.product_type = row_obj.product_type
      }
      return true;
    });

  }

    reset(){
      this.__prdSearchForm.controls['ins_type_id'].setValue([],{emitEvent:true});
       this.sort= new sort;
      this.__pageNumber.setValue('10');
       this.searchProduct();
    }
    customSort(ev){
      if(ev.sortField!= 'edit' && ev.sortField != 'delete'){
        this.sort.field =ev.sortField;
        this.sort.order =ev.sortOrder;
        if(ev.sortField){
          this.getproductMst();
        }
      }
    }
    onselectItem(ev){
      this.getproductMst();
    }
    getSelectedItemsFromParent(ev){

    }
}
