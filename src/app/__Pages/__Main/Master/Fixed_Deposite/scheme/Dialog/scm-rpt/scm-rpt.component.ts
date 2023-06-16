import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { fdComp } from 'src/app/__Model/fdCmp';
import { fdScm } from 'src/app/__Model/fdScm';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmCrudComponent } from '../scm-crud/scm-crud.component';

@Component({
  selector: 'app-scm-rpt',
  templateUrl: './scm-rpt.component.html',
  styleUrls: ['./scm-rpt.component.css']
})
export class ScmRptComponent implements OnInit {
  @ViewChild('prdName') __prdName: ElementRef;
  __isScmVisisble: boolean = false;
  @ViewChildren("insTypeChecked") private __insTypeChecked: QueryList<ElementRef>;
  __settings_compType = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type');
  __settings = this.__utility.settingsfroMultiselectDropdown('id','comp_short_name','Search Companies');
  __prdSearchForm = new FormGroup({
    scheme_name: new FormControl(''),
    company_id: new FormControl([]),
    comp_type_id: new FormControl([])
  });
  __exportedClmns: string[] = ['sl_no','comp_type','comp_full_name','comp_short_name','scheme_name'];
  __columns: string[] = ['edit','delete','sl_no','comp_type','comp_full_name','comp_short_name','scheme_name']
  __isVisible : boolean = true;
  __selectScmMst = new MatTableDataSource<any>([]);
  __exportScmMst = new MatTableDataSource<any>([])
  __pageNumber = new FormControl(10);
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
    this.getcompanyMst();
  }
  ngOnInit(): void {
    this.getcompanyTypeMst();
    setTimeout(()=>{
      this.getScmMst();
    },500)
  }
  getcompanyTypeMst(){
   this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe((res) =>{
    this.__cmpTypeMst = res;
   })
  }
  getcompanyMst(res: string | null = ''){
    this.__dbIntr.api_call(0,'/fd/company',null).pipe(pluck("data")).subscribe((res: fdComp[]) =>{
      this.__companyMst = res;
      if(this.data.company_id){
      //  this.__prdSearchForm.patchValue({
      //   company_id:this.__companyMst.filter((x: any) => x.id == Number(this.data.company_id)).map((x: insComp) =>
      //   ({
      //     id:x.id,
      //     comp_short_name:x.comp_short_name
      //   })
      //   )
      //  });
       console.log( this.__prdSearchForm.value.company_id);

      }
    })
  }
  ngAfterViewInit(){
     // Product NAME SEARCH
  this.__prdSearchForm.controls['scheme_name'].valueChanges.
  pipe(
    tap(()=> this.__isScmVisisble = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(dt => dt?.length > 1 ?
      this.__dbIntr.searchItems('/fd/scheme', dt )
      : []),
    map((x: responseDT) => x.data)
  ).subscribe({
    next: (value) => {
      this.__scmMst = value
      this.searchResultVisibility('block');
      this.__isScmVisisble = false;
    },
    complete: () => console.log(''),
    error: (err) => {
      this.__isScmVisisble = false;
    }
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
  getScmMst(column_name: string | null = '', sort_by: string | null = 'asc'){
    const __fb = new FormData();
    console.log(JSON.stringify(this.__prdSearchForm.value.company_id));
    __fb.append('scheme_name',global.getActualVal(this.__prdSearchForm.value.scheme_name));
    __fb.append('company_id',JSON.stringify(this.__prdSearchForm.value.company_id));
    __fb.append('comp_type_id',JSON.stringify(this.__prdSearchForm.value.comp_type_id));
    __fb.append('paginate', this.__pageNumber.value);
    __fb.append('column_name', column_name);
    __fb.append('sort_by', sort_by);
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
    this.getScmMst(this.__sortColumnsAscOrDsc.active,this.__sortColumnsAscOrDsc.direction);
  }
  exportPdf(){

  }
  sortData(__ev){
    this.__sortColumnsAscOrDsc =__ev;
    this.getScmMst(__ev.active,__ev.direction);
  }
  delete(__el:fdScm,index: number){
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = false;
    // dialogConfig.role = "alertdialog";
    // dialogConfig.data = {
    //   flag: 'S-FD',
    //   id: __el.id,
    //   title: 'Delete '  + __el.scheme_name,
    //   api_name:'/productDelete'
    // };
    // const dialogref = this.__dialog.open(
    //   DeletemstComponent,
    //   dialogConfig
    // );
    // dialogref.afterClosed().subscribe((dt) => {
    //   if(dt){
    //     if(dt.suc == 1){
    //       this.__selectScmMst.data.splice(index,1);
    //       this.__selectScmMst._updateChangeSubscription();
    //       this.__exportScmMst.data.splice(this.__exportScmMst.data.findIndex((x: any) => x.id == __el.id),1);
    //       this.__exportScmMst._updateChangeSubscription();
    //     }
    //   }

    // })
  }
  populateDT(__el: fdScm){
   this.openDialog(__el,__el.id)
  }
  getval(__paginate){
     this.__pageNumber.setValue(__paginate.toString());
    this.getScmMst(
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
            ('&scheme_name=' + global.getActualVal(this.__prdSearchForm.value.scheme_name)) +
            ('&comp_type_id=' +  JSON.stringify(this.__prdSearchForm.value.comp_type_id)) +
            ('&company_id=' +  JSON.stringify(this.__prdSearchForm.value.company_id)) +
            ('&sort_by=' + this.__sortColumnsAscOrDsc.direction) +
            ('&column_name=' + this.__sortColumnsAscOrDsc.active)
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
  resetValues(){
    this.__prdSearchForm.reset();
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
    getItems(__items: fdScm,__mode){
      this.__prdSearchForm.controls['scheme_name'].reset(__items ? __items.scheme_name : '',{emitEvent: false});
      this.searchResultVisibility('none');
    }
    reset(){
      this.__prdSearchForm.patchValue({
        company_id: [],
        product_type_id: []
      });
       this.getItems(null,'P');
       this.searchProduct();
    }

}
