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

@Component({
  selector: 'app-product-rpt',
  templateUrl: './product-rpt.component.html',
  styleUrls: ['./product-rpt.component.css']
})
export class ProductRPTComponent implements OnInit {
  @ViewChild('prdName') __prdName: ElementRef;
  __isProductnameVisisble: boolean = false;
  @ViewChildren("insTypeChecked") private __insTypeChecked: QueryList<ElementRef>;
  __settings_productType = this.__utility.settingsfroMultiselectDropdown('id','product_type','Search Product Type');
  __settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Companies');
  __prdSearchForm = new FormGroup({
    ins_type_id: new FormArray([]),
    product_name: new FormControl(''),
    company_id: new FormControl([]),
    is_all: new FormControl(false),
    product_type_id: new FormControl([])
  });
  __exportedClmns: string[] = ['sl_no','ins_type_name','comp_full_name','comp_short_name','product_type','product_name'];
  __columns: string[] = ['edit','delete','sl_no','ins_type_name','comp_full_name','comp_short_name','product_type','product_name']
  __isVisible : boolean = true;
  __selectPrdMst = new MatTableDataSource<insProduct>([]);
  __exportPrdMst = new MatTableDataSource<insProduct>([])
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __companyMst: insComp[] = [];
  __prdTypeMst: insPrdType[] = [];
  __productMst: insProduct[]= [];
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ProductRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {
    this.getcompanyMst();
  }
  __insTypeMst: any= [];
  ngOnInit(): void {
    this.getInsTypeMst();
    this.getproductTypeMst();
    setTimeout(()=>{
      this.getproductMst();
    },500)
  }
  getproductTypeMst(){
   this.__dbIntr.api_call(0,'/ins/productType',null).pipe(pluck("data")).subscribe((res: insPrdType[]) =>{
    this.__prdTypeMst = res;
   })
  }
  getcompanyMst(res: string | null = ''){
    this.__dbIntr.api_call(0,'/ins/company',null).pipe(pluck("data")).subscribe((res: insComp[]) =>{
      this.__companyMst = res;
      if(this.data.company_id){
       this.__prdSearchForm.patchValue({
        company_id:this.__companyMst.filter((x: any) => x.id == Number(this.data.company_id)).map((x: insComp) =>
        ({
          id:x.id,
          comp_short_name:x.comp_short_name
        })
        )
       });
       console.log( this.__prdSearchForm.value.company_id);

      }
    })
  }
  ngAfterViewInit(){
    this.__prdSearchForm.controls['is_all'].valueChanges.subscribe(res =>{
      const ins_type: FormArray = this.__prdSearchForm.get('ins_type_id') as FormArray;
      ins_type.clear();
      if(!res){
        this.uncheckAll();
      }
      else{
        this.__insTypeMst.forEach(__el =>{
          ins_type.push(new FormControl(__el.id));
        })
        this.checkAll();
      }
    })

     // Product NAME SEARCH
  this.__prdSearchForm.controls['product_name'].valueChanges.
  pipe(
    tap(()=> this.__isProductnameVisisble = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/ins/product', dt )
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      console.log(value);
      this.__productMst = value
      this.searchResultVisibility('block');
      this.__isProductnameVisisble = false;
    },
    complete: () => console.log(''),
    error: (err) => {
      this.__isProductnameVisisble = false;
    }
  })
  }
  getInsTypeMst(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
      console.log(res);

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
  getproductMst(column_name: string | null = '', sort_by: string | null = 'asc'){
    const __fb = new FormData();
    console.log(JSON.stringify(this.__prdSearchForm.value.company_id));
    __fb.append('product_name',global.getActualVal(this.__prdSearchForm.value.product_name));
    __fb.append('company_id',JSON.stringify(this.__prdSearchForm.value.company_id));
    __fb.append('ins_type_id',JSON.stringify(this.__prdSearchForm.value.ins_type_id));
    __fb.append('paginate', this.__pageNumber.value);
    __fb.append('product_type_id',JSON.stringify(this.__prdSearchForm.value.product_type_id))
    __fb.append('column_name', column_name);
    __fb.append('sort_by', sort_by);
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
    this.getproductMst(this.__sortColumnsAscOrDsc.active,this.__sortColumnsAscOrDsc.direction);
  }
  exportPdf(){

  }
  sortData(__ev){
    this.__sortColumnsAscOrDsc =__ev;
    this.getproductMst(__ev.active,__ev.direction);
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
  getval(__paginate){
     this.__pageNumber.setValue(__paginate.toString());
    this.getproductMst(
      this.__sortColumnsAscOrDsc.active,
      this.__sortColumnsAscOrDsc.direction
    );
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&product_name=' + global.getActualVal(this.__prdSearchForm.value.product_name)) +
            ('&ins_type_id=' +  JSON.stringify(this.__prdSearchForm.value.ins_type_id)) +
            ('&company_id=' +  JSON.stringify(this.__prdSearchForm.value.company_id)) +
            ('&sort_by=' + this.__sortColumnsAscOrDsc.direction) +
            ('&column_name=' + this.__sortColumnsAscOrDsc.active) +
            ('&product_type_id='+ JSON.stringify(this.__prdSearchForm.value.product_type_id))
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
  resetValues(){
    this.__prdSearchForm.reset();
  }

  onInsTypeChange(e){
    const ins_type: FormArray = this.__prdSearchForm.get('ins_type_id') as FormArray;
    if (e.checked) {
      ins_type.push(new FormControl(e.source.value));
    } else {
      let i: number = 0;
      ins_type.controls.forEach((item: any) => {
        if (item.value == e.source.value) {
          ins_type.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.__prdSearchForm.get('is_all').setValue(ins_type.controls.length == 3 ?  true : false,{emitEvent: false})
    }
    uncheckAll(){
      this.__insTypeChecked.forEach((element:any) => {
        element.checked = false;
      });
    }
    checkAll(){
        this.__insTypeChecked.forEach((element:any) => {
          element.checked = true;
        });
    }
    outsideClick(__ev){
      if(__ev){
        console.log(__ev);

        this.searchResultVisibility('none');
      }
    }
    searchResultVisibility(display_mode){
      this.__prdName.nativeElement.style.display = display_mode;
    }
    getItems(__items: insProduct,__mode){
      this.__prdSearchForm.controls['product_name'].reset(__items ? __items.product_name : '',{emitEvent: false});
      this.searchResultVisibility('none');
    }
    reset(){
      this.__prdSearchForm.patchValue({
        company_id: [],
        is_all: false,
        product_type_id: []
      });
       this.getItems(null,'P');
       (<FormArray>this.__prdSearchForm.get('ins_type_id')).clear();
       this.uncheckAll();
       this.searchProduct();
    }
}
