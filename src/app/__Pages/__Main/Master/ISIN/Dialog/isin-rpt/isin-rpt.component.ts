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

  formValue;
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
    this.formValue = this.__isinFrm.value;
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

  /**
   * * This function is used to fetch the AMC master data from the server.
   * * @returns void
   * * @memberof IsinRptComponent
   * * @description
   * * This function makes an API call to retrieve the AMC master data and assigns it to the AmcMst variable.
   * * It is called during the initialization of the component to populate the AMC dropdown.
   */
  getAMCMst(){
    this.__dbIntr.api_call(0,'/amc',null).pipe(pluck("data")).subscribe((res:amc[]) =>{
         this.AmcMst = res;
    })
  }
  /**
   *  * This function is used to get the category against the selected AMC IDs.
   *  * It makes an API call to fetch the category data based on the provided AMC IDs.
   *  * @param arr_amc_ids - An array of AMC IDs for which the categories need to be fetched.
   *  * @returns void
   */
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
  /**
   *  * This function is used to get the subcategory against the selected category and AMC IDs.
   *  * It makes an API call to fetch the subcategory data based on the provided category and AMC IDs.
   *  * @returns void
   *  * @memberof IsinRptComponent
   * @param arr_cat_ids 
   * @param arr_amc_ids 
   */
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
  /**
   *  
   * * This function is used to get the scheme against the selected subcategory, category, and AMC IDs.
   * * It makes an API call to fetch the scheme data based on the provided subcategory, category, and AMC IDs.
   * * @returns void
   * @param arr_subcat_ids 
   * @param arr_cat_ids 
   * @param arr_amc_ids 
   */
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
  /**
   * * This function is used to toggle the full screen mode of the dialog.
   * * It updates the dialog's panel class and position to achieve full screen display.
   * * @returns void
   */
  fullScreen(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to minimize the dialog.
   * * * It updates the dialog's size and position to display it at the bottom right corner.
   * * * @returns void
   * * * @memberof IsinRptComponent
   */
  minimize(){
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize("40%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * It updates the dialog's panel class and position to display it in a larger view.
   * * * @returns void
   * * * @memberof IsinRptComponent
   */
  maximize(){
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({top:'0px'});
    this.__isVisible = !this.__isVisible;
  }
  /**
   *  
   * @param ev - This parameter represents the event triggered when an item is clicked.
   * * This function is called when an item is clicked in the select button dropdown.
   * * It checks the value of the clicked item and performs actions accordingly.
   */
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
  /**
   * * * This function is used to reset the form fields and pagination to their initial values.
   * * * It clears the selected AMC, category, subcategory, and scheme, and resets the pagination to '10'.
   * * * It also sets the button type to 'R' for reset.
   * * * @returns void
   * * @memberof IsinRptComponent
   */
  reset(){
    this.__isinFrm.controls['amc_id'].setValue([],{emitEVent:true});
    this.__isinFrm.controls['alt_scheme_id'].setValue('');
    this.__isinFrm.controls['alt_scheme_name'].setValue('',{emitEvent:false});
    this.pageNumber = '10';
    this.__isinFrm.get('btn_type').setValue('R');
    this.sort = new sort();
    this.submitISIN();

  }
  /**
   * * This function is used to fetch the option master data from the server.
   * * It makes an API call to retrieve the option data and assigns it to the optionMst variable.
   * * @returns void
   */
  getOptionMst(){
    this.__dbIntr.api_call(0,'/option',null).pipe(pluck("data")).subscribe((res:option[]) =>{
    this.optionMst = res;
    })
  }
  /**
   * * * This function is used to fetch the plan master data from the server.
   * * * It makes an API call to retrieve the plan data and assigns it to the planMst variable.
   * * * @returns void
   * * @memberof IsinRptComponent
   */
  getPlanMst(){
    this.__dbIntr.api_call(0,'/plan',null).pipe(pluck("data")).subscribe((res:plan[]) =>{
    this.planMst = res;
    })
  }
  /**
   * 
   * @param display_mode - This parameter represents the display mode for the scheme visibility.
   * * This function is used to set the visibility of the scheme based on the provided display mode.
   * * It updates the displayMode_forScheme variable with the given display mode.
   * * @returns void
   * @memberof IsinRptComponent
   */
  searchSchemeVisibility(display_mode){
    this.displayMode_forScheme = display_mode
  }
  /**
   * 
   * @param ev - This parameter represents the event triggered when an item is selected from the parent component.
   * * This function is used to get the selected items from the parent component.
   * * It sets the value of the alt_scheme_id control in the form and resets the alt_scheme_name control with the selected item's scheme name.
   */
  getSelectedItemsFromParent(ev){
    console.log(ev);

    this.__isinFrm.controls['alt_scheme_id'].setValue(ev.item.id);
    this.__isinFrm.controls['alt_scheme_name'].reset(ev.item.scheme_name,{emitEvent:false});
    this.searchSchemeVisibility('none');
  }
  /**
   * 
   * @param ev - This parameter represents the event triggered when a custom sort is applied.
   * * This function is used to handle custom sorting of the ISIN master data.
   * * It updates the sort order and field based on the event parameters and calls the getISINMst() function to fetch the sorted data.
   * * @returns void
   * @memberof IsinRptComponent
   */
  customSort(ev){
    this.sort.order= ev.sortOrder;
    this.sort.field= ev.sortField;
    this.getISINMst();
  }
  /**
   * * This function is used to fetch the ISIN master data based on the form values and pagination.
   * * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
   * * The retrieved data is then assigned to the __isinMst variable and the pagination links are updated.
   * * @returns void
   * @memberof IsinRptComponent
   */
  getISINMst(){
    const __fd = new FormData();
    __fd.append('paginate',this.pageNumber);
    __fd.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __fd.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : '1'));
    __fd.append('amc_id',JSON.stringify(this.formValue?.amc_id.map(item => item.id)));
    __fd.append('cat_id',JSON.stringify(this.formValue?.cat_id.map(item => item.id)));
    __fd.append('sub_cat_id',JSON.stringify(this.formValue?.sub_cat_id.map(item => item.id)));
    __fd.append('scheme_id',JSON.stringify(this.formValue?.scheme_id.map(item => item.id)));
    __fd.append('search_scheme_id',global.getActualVal(this.formValue?.alt_scheme_id));
    if(this.formValue?.btn_type == 'A'){
      __fd.append('plan_id',JSON.stringify(this.formValue?.plan_id.map(item => item.id)));
      __fd.append('opt_id',JSON.stringify(this.formValue?.opt_id.map(item => item.id)));
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
  /**
   * * * This function is used to submit the ISIN form data and fetch the ISIN master data.
   * * * It retrieves the form values, calls the getISINMst() function to fetch the data, and updates the __isinMst variable.
   * * * @returns void
   * * @memberof IsinRptComponent
   */
  submitISIN(){
    this.formValue = this.__isinFrm.value;
    this.getISINMst();
  }
  /**
   * 
   * @param itemPerpage - This parameter represents the number of items per page selected by the user.
   * * This function is used to handle the selection of items per page in the pagination.
   * * It updates the pageNumber variable with the selected item count and calls the getISINMst() function to fetch the data accordingly.
   * * @returns void
   * @memberof IsinRptComponent
   */
  onSelectItem(itemPerpage){
     this.pageNumber = itemPerpage;
     this.getISINMst()
  }
  /**
   * 
   * * This function is used to fetch paginated data based on the provided pagination object.
   * * It constructs the URL with the necessary parameters and makes an API call to retrieve the data.
   * * The retrieved data is then assigned to the __isinMst variable and the __paginate object is updated.
   * @param __paginate - This parameter represents the pagination object containing the URL for fetching paginated data.
   */
  getPaginate(__paginate){
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.pageNumber)
          + ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
          ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
          + ('&scheme_id='+  JSON.stringify(this.formValue?.scheme_id.map(item => item.id)))
          + ('&cat_id='+ JSON.stringify(this.formValue?.cat_id.map(item => item.id)))
          + ('&amc_id='+ JSON.stringify(this.formValue?.amc_id.map(item => item.id)))
          + ('&sub_cat_id='+  JSON.stringify(this.formValue?.sub_cat_id.map(item => item.id)))
          + ('&search_scheme_id=' + global.getActualVal(this.formValue?.alt_scheme_id))
          + (
            this.formValue?.btn_type == 'A' ?
            ('&plan_id=' + JSON.stringify(this.formValue?.plan_id.map(item => item.id))) +
            ('&opt_id=' + JSON.stringify(this.formValue?.opt_id.map(item => item.id)))
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
  /**
   * 
   * @param isin - This parameter represents the ISIN object that needs to be populated in the dialog.
   * * This function is used to open a dialog for manual entry of ISIN details.
   * * It configures the dialog with necessary options such as width, height, and data to be passed.
   */
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
  /**
   * 
   * @param row_obj - This parameter represents an array of ISIN objects that need to be updated in the master list.
   * * This function is used to update the ISIN master list with the provided row objects.
   * * It checks if each row object already exists in the master list and updates it accordingly.
   */
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
  /**
   * 
   * @param el - This parameter represents the ISIN object that needs to be deleted.
   * * This function is used to delete an ISIN from the master list.
   * * It opens a confirmation dialog and upon confirmation, it makes an API call to delete the ISIN.
   * * If the deletion is successful, it removes the ISIN from the master list.
   * @returns void
   * @param index - This parameter represents the index of the ISIN object in the master list.
   * @memberof IsinRptComponent
   * @description
   */
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
