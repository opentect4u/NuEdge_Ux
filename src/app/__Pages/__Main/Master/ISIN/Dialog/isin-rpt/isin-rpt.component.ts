import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import filterOpt from '../../../../../../../assets/json/filterOption.json';
import { sort } from 'src/app/__Model/sort';
import itemsPerPage from '../../../../../../../assets/json/itemsPerPage.json';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { category } from 'src/app/__Model/__category';
import { subcat } from 'src/app/__Model/__subcategory';
import { scheme } from 'src/app/__Model/__schemeMst';
import { plan } from 'src/app/__Model/plan';
import { option } from 'src/app/__Model/option';
import { column } from 'src/app/__Model/tblClmns';
import { ISINClmns } from 'src/app/__Utility/Master/schemeClmns';
import { global } from 'src/app/__Utility/globalFunc';
import { ManualEntrComponent } from '../manual-entr/manual-entr.component';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
type selectBtn ={
  label:string,
  value:string,
  icon:string
}
@Component({
  selector: 'app-isin-rpt',
  templateUrl: './isin-rpt.component.html',
  styleUrls: ['./isin-rpt.component.css']
})
export class IsinRptComponent implements OnInit {
  settingsForAmc = this.__utility.settingsfroMultiselectDropdown('id','amc_short_name','Search AMC',2);
  settingsForcat = this.__utility.settingsfroMultiselectDropdown('id','cat_name','Search Category',2);
  settingsForsubcat = this.__utility.settingsfroMultiselectDropdown('id','subcategory_name','Search Subcategory',2);
  settingsForScm = this.__utility.settingsfroMultiselectDropdown('id','scheme_name','Search Scheme',2);
  settingsForPLN = this.__utility.settingsfroMultiselectDropdown('id','plan_name','Search Plan',2);
  settingsForOPT = this.__utility.settingsfroMultiselectDropdown('id','opt_name','Search Option',2);
  selectBtn:selectBtn[] = filterOpt;
  itemsPerPage:selectBtn[] = itemsPerPage;
  __isSchemeSpinner:boolean =false;
  pageNumber= '10'
  displayMode_forScheme:string;
  sort = new sort();
  __isVisible:boolean = true;
  __isinFrm = new FormGroup({
    amc_id: new FormControl([],{updateOn:'blur'}),
    cat_id:new FormControl([],{updateOn:'blur'}),
    sub_cat_id: new FormControl([],{updateOn:'blur'}),
    scheme_id: new FormControl([]),
    isin: new FormControl(''),
    alt_scheme_name: new FormControl(''),
    alt_scheme_id: new FormControl([]),
    plan_id: new FormControl([]),
    opt_id: new FormControl([]),
    btn_type: new FormControl('R')
  })
  AmcMst:amc[] =[];
  catMst: category[] = [];
  subCatMst:subcat[] = [];
  schemeMst:scheme[] = [];
  planMst: plan[]= [];
  optionMst:option[] =[];
  searchedSchemeMst:scheme[] =[];
  __columns:column[] = ISINClmns.Columns;
  __isinMst: any =[];
  __paginate: any=[];
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<IsinRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }

  ngOnInit(): void {
    this.getAMCMst();
  }

  ngAfterViewInit(){
    this.__isinFrm.controls['amc_id'].valueChanges.subscribe(res =>{
      this.getcategoryAgainstAmc(res);
      this.getSubcategoryAgainstCategory(this.__isinFrm.controls['cat_id'].value,res);
      this.getSchemeAgainstSubCategory(this.__isinFrm.controls['sub_cat_id'].value,
      this.__isinFrm.controls['cat_id'].value,
      res);
    })
    this.__isinFrm.controls['cat_id'].valueChanges.subscribe(res =>{
      this.getSubcategoryAgainstCategory(res,this.__isinFrm.controls['amc_id'].value);
      this.getSchemeAgainstSubCategory(this.__isinFrm.controls['sub_cat_id'].value,
      res,
      this.__isinFrm.controls['amc_id'].value
      )
    })
    this.__isinFrm.controls['sub_cat_id'].valueChanges.subscribe(res =>{
      this.getSchemeAgainstSubCategory(res,this.__isinFrm.controls['cat_id'].value,this.__isinFrm.controls['amc_id'].value);
    })
    // + '&arr_amc_id='+JSON.stringify(this.__isinFrm.value.amc_id.map(item => item.id))
    this.__isinFrm.controls['alt_scheme_name'].valueChanges.pipe(
      tap(() => (this.__isSchemeSpinner = true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((dt) =>
        dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', dt) : []
      ),
      map((x: any) => x.data)
    ).subscribe({
      next: (value) => {
        this.searchedSchemeMst = value;
        this.searchSchemeVisibility('block');
        this.__isSchemeSpinner = false;
        this.__isinFrm.controls['alt_scheme_id'].setValue('');
      },
      complete: () => console.log(''),
      error: (err) => {
        this.__isSchemeSpinner = false;
      },
    });
  }

  getAMCMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res:amc[]) =>{
         this.AmcMst = res;
    })
  }
  getcategoryAgainstAmc(arr_amc_ids){
    if(arr_amc_ids.length > 0){
      this.__dbIntr.api_call(0,'/category','arr_amc_id='+JSON.stringify(arr_amc_ids.map(item => item.id)))
      .pipe(pluck("data")).subscribe((res:category[]) =>{
        this.catMst = res;
     })
     }
     else{
           this.catMst.length = 0;
           this.__isinFrm.controls['cat_id'].reset([],{emitEvent:true});
      }
  }
  getSubcategoryAgainstCategory(arr_cat_ids,arr_amc_ids){
    if(arr_cat_ids.length > 0 && arr_amc_ids.length > 0){
      this.__dbIntr.api_call(0,'/subcategory',
      'arr_cat_id='+JSON.stringify(arr_cat_ids.map(item => item.id))
      +'&arr_amc_id='+JSON.stringify(arr_amc_ids.map(item => item.id))
      )
      .pipe(pluck("data")).subscribe((res:subcat[]) =>{
        this.subCatMst = res;
     })
     }
     else{
        this.subCatMst.length = 0;
        this.__isinFrm.controls['sub_cat_id'].reset([],{emitEvent:true});
      }
  }
  getSchemeAgainstSubCategory(arr_subcat_ids,arr_cat_ids,arr_amc_ids){
    if(arr_subcat_ids.length > 0 && arr_cat_ids.length > 0 && arr_amc_ids.length > 0){
      this.__dbIntr.api_call(0,'/scheme',
      'arr_subcat_id='+JSON.stringify(arr_subcat_ids.map(item => item.id))
      +'&arr_cat_id='+JSON.stringify(arr_cat_ids.map(item => item.id))
      +'&arr_amc_id='+JSON.stringify(arr_amc_ids.map(item => item.id))
      )
      .pipe(pluck("data")).subscribe((res:scheme[]) =>{
        this.schemeMst = res;
     })
     }
     else{
        this.schemeMst.length = 0;
        this.__isinFrm.controls['scheme_id'].reset([]);
      }
  }
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'55px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  onItemClick(ev){
    if(ev.option.value == 'A'){
      this.getOptionMst();
      this.getPlanMst();
    }
    else{
      //Reset
       this.reset();
    }
  }
  reset(){
    this.__isinFrm.controls['amc_id'].setValue([],{emitEVent:true});
    this.__isinFrm.controls['alt_scheme_id'].setValue('');
    this.__isinFrm.controls['alt_scheme_name'].setValue('',{emitEvent:false});
    this.pageNumber = '10';
    this.__isinFrm.get('btn_type').setValue('R');
    this.sort = new sort();
    this.getISINMst();

  }
  getOptionMst(){
    this.__dbIntr.api_call(0,'/option',null).pipe(pluck("data")).subscribe((res:option[]) =>{
    this.optionMst = res;
    })
  }
  getPlanMst(){
    this.__dbIntr.api_call(0,'/plan',null).pipe(pluck("data")).subscribe((res:plan[]) =>{
    this.planMst = res;
    })
  }
  searchSchemeVisibility(display_mode){
    this.displayMode_forScheme = display_mode
  }
  getSelectedItemsFromParent(ev){
    console.log(ev);

    this.__isinFrm.controls['alt_scheme_id'].setValue(ev.item.id);
    this.__isinFrm.controls['alt_scheme_name'].reset(ev.item.scheme_name,{emitEvent:false});
    this.searchSchemeVisibility('none');
  }
  customSort(ev){
    this.sort.order= ev.sortOrder;
    this.sort.field= ev.sortField;
    this.getISINMst();
  }
  getISINMst(){
    const __fd = new FormData();
    __fd.append('paginate',this.pageNumber);
    __fd.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __fd.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    __fd.append('amc_id',JSON.stringify(this.__isinFrm.value.amc_id.map(item => item.id)));
    __fd.append('cat_id',JSON.stringify(this.__isinFrm.value.cat_id.map(item => item.id)));
    __fd.append('sub_cat_id',JSON.stringify(this.__isinFrm.value.sub_cat_id.map(item => item.id)));
    __fd.append('scheme_id',JSON.stringify(this.__isinFrm.value.scheme_id.map(item => item.id)));
    __fd.append('search_scheme_id',global.getActualVal(this.__isinFrm.value.alt_scheme_id));
    if(this.__isinFrm.value.btn_type == 'A'){
      __fd.append('plan_id',JSON.stringify(this.__isinFrm.value.plan_id.map(item => item.id)));
      __fd.append('opt_id',JSON.stringify(this.__isinFrm.value.opt_id.map(item => item.id)));
    }
    this.__dbIntr.api_call(1,'/schemeISINDetailSearch',__fd).pipe(pluck("data")).subscribe((res: any) =>{
       this.__isinMst = res.data;
       this.__paginate = res.links;
      //  this.ExportTable(__fd);
    })
  }
  // ExportTable(__ISINFrmData){
  //  __ISINFrmData.delete('paginate');
  //  this.__dbIntr.api_call(1,'/ISINExport',__ISINFrmData).pipe(pluck("data")).subscribe((res: any) =>{
  //       // assign Export value to a variable
  //   })
  // }
  submitISIN(){
    this.getISINMst();
  }
  onSelectItem(itemPerpage){
     this.pageNumber = itemPerpage;
     this.getISINMst()
  }
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.pageNumber)
          + ('&scheme_id='+  JSON.stringify(this.__isinFrm.value.scheme_id.map(item => item.id)))
          + ('&cat_id='+ JSON.stringify(this.__isinFrm.value.cat_id.map(item => item.id)))
          + ('&amc_id='+ JSON.stringify(this.__isinFrm.value.amc_id.map(item => item.id)))
          + ('&sub_cat_id='+  JSON.stringify(this.__isinFrm.value.sub_cat_id.map(item => item.id)))
          + ('&search_scheme_id=' + global.getActualVal(this.__isinFrm.value.alt_scheme_id))
          + (
            this.__isinFrm.value.btn_type == 'A' ?
            ('&plan_id=' + JSON.stringify(this.__isinFrm.value.plan_id.map(item => item.id))) +
            ('&opt_id=' + JSON.stringify(this.__isinFrm.value.opt_id.map(item => item.id)))
            :
            ''
          )
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.__isinMst = res.data;
          this.__paginate = res.links;
        },
        error=>{
        });
    }

  }
  populateDT(isin){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "ISIN_" + isin.id,
    dialogConfig.data = {
      flag:"ISIN",
      title:"ISIN Entry",
      id:isin.id,
      isViewMode:false,
      isinDtls: isin
    }
    try {
      const dialogref = this.__dialog.open(
        ManualEntrComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe(res =>{
        if(res){
          this.updateRow(res.data)
        }
      })
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        flag:"ISIN"
      });
    }
  }
  updateRow(row_obj){
     row_obj.forEach(el =>{
        if(this.__isinMst.findIndex(item => item.id == el.id) != -1){
           this.__isinMst = this.__isinMst.filter((value,key) =>{
                   if(value.id == el.id){
                      value.isin_no = el.isin_no;
                      value.amc_short_name = el.amc_short_name;
                      value.amc_short_name = el.amc_short_name;
                      value.cat_name = el.cat_name;
                      value.subcategory_name = el.subcategory_name;
                      value.scheme_name = el.scheme_name;
                      value.plan_name = el.plan_name;
                      value.opt_name = el.opt_name;
                      value.plan_id = el.plan_id;
                      value.option_id = el.option_id;
                      value.amc_id = el.amc_id;
                      value.product_code = el.product_code;
                   }
                   return true;
           })
        }
        else{
          this.__isinMst.push(el)
        }

     })
  }
  deleteISIN(el,index){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = 'alertdialog';
      dialogConfig.data = {
        flag: 'I',
        id: el.id,
        title: 'Delete '  + (el.isin_no ? el.isin_no : ''),
        api_name:'/schemeISINDelete'
      };
      const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt.suc == 1) {
            this.__isinMst.splice(index, 1);
          }
        }
      });
    }
}
