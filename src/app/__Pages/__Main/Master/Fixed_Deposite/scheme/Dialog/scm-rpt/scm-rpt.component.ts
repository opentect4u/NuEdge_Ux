import { Overlay } from '@angular/cdk/overlay';
import { Component, Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {debounceTime, distinctUntilChanged, map, pluck, switchMap, tap} from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { fdComp } from 'src/app/__Model/fdCmp';
import { fdScm } from 'src/app/__Model/fdScm';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmCrudComponent } from '../scm-crud/scm-crud.component';
import { column } from 'src/app/__Model/tblClmns';
import { SchemeClmns } from 'src/app/__Utility/Master/FixedDepositClmn';
import { sort } from 'src/app/__Model/sort';
import ItemsPerPage from '../../../../../../../../assets/json/itemsPerPage.json';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';

@Component({
  selector: 'app-scm-rpt',
  templateUrl: './scm-rpt.component.html',
  styleUrls: ['./scm-rpt.component.css']
})
export class ScmRptComponent implements OnInit {
  // __isAllSpinner: boolean = false;
  // displayMode_forSearch:string;
  __settings_scm = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme');
  __settings_compType = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type');
  __settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Companies');
  __prdSearchForm = new FormGroup({
    scheme_name: new FormControl([]),
    company_id: new FormControl([],{updateOn:'blur'}),
    comp_type_id: new FormControl([],{updateOn:'blur'}),
    search_all:new FormControl(''),
    // search_all_id: new FormControl('')
  });
  // SearchAllMst:any=[];
  __exportedClmns: string[] =  SchemeClmns.Column.filter(res => (res.field!='edit' && res.field!='delete')).map(item => {return item['field']});
  __columns: column[] = SchemeClmns.Column;
  sort =new sort();
  itemsPerPage = ItemsPerPage;

  __isVisible : boolean = true;
  __selectScmMst = new MatTableDataSource<any>([]);
  __exportScmMst = new MatTableDataSource<any>([])
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __companyMst: fdComp[] = [];
  __cmpTypeMst: any = [];
  __scmMst: fdScm[]= [];
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ScmRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {
  }
  ngOnInit(): void {
    this.getcompanyTypeMst();
    this.getScmMst();
  }
  getcompanyTypeMst(){
   this.__dbIntr.api_call(0,'/fd/companyType',null)
   .pipe(pluck("data"))
   .subscribe((res) =>{
    this.__cmpTypeMst = res;
   })
  }
  getcompanyMst(arr_comp_type_ids){
    if(arr_comp_type_ids.length > 0){
    this.__dbIntr.api_call(0,'/fd/company',JSON.stringify(arr_comp_type_ids.map(item => item.id))).pipe(pluck("data")).subscribe((res: fdComp[]) =>{
      this.__companyMst = res;
    })
    }
    else{
      this.__prdSearchForm.controls['company_id'].setValue([],{emitEvent:true});
      this.__companyMst.length = 0;
    }
  }
  ngAfterViewInit(){
       this.__prdSearchForm.controls['comp_type_id'].valueChanges.subscribe(res =>{
         this.getcompanyMst(res);
       })
      this.__prdSearchForm.controls['company_id'].valueChanges.subscribe(res =>{
          this.getSchemeAgainstCompany(res);
      })
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
  }
  // searchResultVisibility(display_mode){
  //   this.displayMode_forSearch = display_mode;
  // }
  getSchemeAgainstCompany(arr_comp_ids){
    if(arr_comp_ids.length > 0){
      this.__dbIntr.api_call(0,'/fd/scheme','arr_comp_id='+JSON.stringify(arr_comp_ids.map(item => item.id)))
      .pipe(pluck("data")).subscribe((res:fdScm[]) =>{
            this.__scmMst = res;
      })
    }
    else{
      this.__prdSearchForm.controls['scheme_name'].setValue([]);
      this.__scmMst.length = 0;
    }


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
  getScmMst(){
    const __fb = new FormData();
    console.log(JSON.stringify(this.__prdSearchForm.value.company_id));
    __fb.append('scheme_name',JSON.stringify(this.__prdSearchForm.value.scheme_name.map(item=> item.id)));
    __fb.append('company_id',JSON.stringify(this.__prdSearchForm.value.company_id.map(item=> item.id)));
    __fb.append('comp_type_id',JSON.stringify(this.__prdSearchForm.value.comp_type_id.map(item=> item.id)));
    __fb.append('search_all', (global.getActualVal(this.__prdSearchForm.value.search_all) ? this.__prdSearchForm.value.search_all : ''));
    __fb.append('paginate', this.__pageNumber.value);
    __fb.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __fb.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
     this.__dbIntr.api_call(1,'/fd/schemeDetailSearch',__fb).pipe(pluck("data")).subscribe((res: any) =>{
        this.__selectScmMst = new MatTableDataSource(res.data);
        this.__paginate = res.links;
        this.tableExport(__fb);
     })
  }
  tableExport(__fb){
    __fb.delete('paginate');
    this.__dbIntr.api_call(1,'/fd/schemeExport',__fb) .pipe(pluck("data"))
    .subscribe((res: fdScm[]) => {
      this.__exportScmMst = new MatTableDataSource(res);
    });
  }
  searchProduct(){
    this.getScmMst();
  }
  exportPdf(){
    this.__Rpt.downloadReport(
      '#fdScm',
      {
        title: 'FD Scheme- ' + new Date().toLocaleDateString(),
      },
      'FDScheme'
    );
  }
  delete(__el:fdScm,index: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'S-FD',
      id: __el.id,
      title: 'Delete '  + __el.scheme_name,
      api_name:'/fd/schemeDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectScmMst.data.splice(index,1);
          this.__selectScmMst._updateChangeSubscription();
          this.__exportScmMst.data.splice(this.__exportScmMst.data.findIndex((x: any) => x.id == __el.id),1);
          this.__exportScmMst._updateChangeSubscription();
        }
      }

    })
  }
  populateDT(__el: fdScm){
   this.openDialog(__el,__el.id)
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&search_all=' + (global.getActualVal(this.__prdSearchForm.value.search_all) ? this.__prdSearchForm.value.search_all : '')) +
            ('&scheme_name=' + JSON.stringify(this.__prdSearchForm.value.scheme_name.map(item=> item.id))) +
            ('&comp_type_id=' +  JSON.stringify(this.__prdSearchForm.value.comp_type_id.map(item=> item.id))) +
            ('&company_id=' +  JSON.stringify(this.__prdSearchForm.value.company_id.map(item=> item.id)))
            +('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
            +('&order='+ (global.getActualVal(this.sort.order) ? this.sort.order : '1'))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__selectScmMst = new MatTableDataSource(res.data);
          this.__paginate = res.links;
        });
    }
  }
  openDialog(product: fdScm,__id: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SCM',
      id: __id,
      scheme: product,
      title: __id == 0 ? 'Add scheme' : 'Update scheme',
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ScmCrudComponent,
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
            this.__exportScmMst.data.unshift(dt.data);
            this.__exportScmMst._updateChangeSubscription();
            this.__selectScmMst.data.unshift(dt.data);
            this.__selectScmMst._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
     console.log(ex)
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SCM',
      });
    }
  }
  updateRow(row_obj){
    this.__selectScmMst.data = this.__selectScmMst.data.filter((value: fdScm, key) => {
      if (value.id == row_obj.id) {
        value.id = row_obj.id;
        value.comp_id = row_obj.comp_id;
        value.comp_full_name = row_obj.comp_full_name;
        value.comp_short_name = row_obj.comp_short_name;
        value.comp_type_id = row_obj.comp_type_id;
        value.comp_type = row_obj.comp_type;
        value.scheme_name = row_obj.scheme_name;
      }
      return true;
    });

    this.__exportScmMst.data = this.__exportScmMst.data.filter((value: fdScm, key) => {
      if (value.id == row_obj.id) {
        value.id = row_obj.id;
        value.comp_id = row_obj.comp_id;
        value.comp_full_name = row_obj.comp_full_name;
        value.comp_short_name = row_obj.comp_short_name;
        value.comp_type_id = row_obj.comp_type_id;
        value.comp_type = row_obj.comp_type;
        value.scheme_name = row_obj.scheme_name;
      }
      return true;
    });

  }
    reset(){
      this.__prdSearchForm.controls['comp_type_id'].reset([],{emitEvent:true});
      this.__prdSearchForm.controls['search_all'].setValue('',{emitEvent:false});
      // this.__prdSearchForm.controls['search_all_id'].setValue('',{emitEvent:false});
      this.__pageNumber.setValue('10');
      this.sort =new sort();
      this.getScmMst();
    }
    customSort(ev){
      this.sort.field =ev.sortField;
      this.sort.order =ev.sortOrder;
      if(ev.sortField){
        this.getScmMst();
      }
    }
    onselectItem(ev){
      this.__pageNumber.setValue(ev.option.value);
      this.getScmMst();
    }
    // getSelectedItemsFromParent(ev){
    // //  this.__prdSearchForm.controls['search_all'].setValue(
    // //    ev.item
    // //    )
    // }
}
