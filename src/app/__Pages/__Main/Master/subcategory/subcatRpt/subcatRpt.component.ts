/**
* Sub category report screen open in modal dialog box
*/

import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
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
  debounceTime,
  distinctUntilChanged,
  map,
  pluck,
  switchMap,
  tap,
} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { SubcateModificationComponent } from '../subcateModification/subcateModification.component';
import ItepPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { subcatClmns } from 'src/app/__Utility/Master/subcatClmns';
import { Table } from 'primeng/table';
@Component({
  selector: 'subcatRpt-component',
  templateUrl: './subcatRpt.component.html',
  styleUrls: ['./subcatRpt.component.css'],
})
export class SubcatrptComponent implements OnInit {

  /**
   * For Holding form data after submit
   */
  formValue;

  @ViewChild('dt') primeTbl :Table;

  settings = this.__utility.settingsfroMultiselectDropdown('id','cat_name','Search Category');
  itemsPerPage = ItepPerPage;
  sort = new sort();
  // @ViewChild('searchcat') __searchCat: ElementRef;
  @ViewChild('searchsubcat') searchsubcat: ElementRef;
  __export = new MatTableDataSource<subcat>([]);
  __catMst: category[] = [];
  __subcatMst: subcat[] = [];
  __iscatspinner: boolean = false;
  __issubcatspinner: boolean = false;
  __isVisible: boolean = true;
  __subcatForm = new FormGroup({
    subcat_name: new FormControl(''),
    subcat_id: new FormControl(
      this.data.sub_cat_id ? this.data.sub_cat_id : ''
    ),
    cat_name: new FormControl([]),
    // cat_id: new FormControl(this.data.cat_id ? this.data.cat_id : ''),
    options: new FormControl('2'),
  });
  __selectSubCategory = new MatTableDataSource<subcat>([]);
  __pageNumber = new FormControl('10');
  __paginate: any = [];
  __exportedClmns: string[] = ['sl_no', 'cat_name', 'subcategory_name'];
  __columns: column[] = subcatClmns.COLUMN;
  constructor(
    private __Rpt: RPTService,
    private __dialog: MatDialog,
    private __utility: UtiliService,
    public dialogRef: MatDialogRef<SubcatrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) {
  }
  /**
   * Export PDF of sub-category
   */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#subcategory',
      {
        title: 'Sub-Category - ' + new Date().toLocaleDateString(),
      },
      'Sub Category',
      'p'
    );
  }

  ngOnInit() {
    this.getCategoryMst();
    this.getSubcatMst();
  }

  /**
   * Get sub category master data from backend API
   */
  getSubcatMst() {
    const __amcSearch = new FormData();
    __amcSearch.append(
      'cat_id',
      JSON.stringify(this.formValue?.cat_name.map(item => item.id))
    );
    __amcSearch.append(
      'subcat_id',
      global.getActualVal(this.formValue?.subcat_id)
    );
    __amcSearch.append('paginate', this.__pageNumber.value);
    // __amcSearch.append(
    //   'field',
    //   global.getActualVal(this.sort.field) ? this.sort.field : ''
    // );
    // __amcSearch.append(
    //   'order',
    //   global.getActualVal(this.sort.order) ? this.sort.order : ''
    // );

__amcSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
__amcSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/subcategoryDetailSearch', __amcSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        // this.__paginate = res.links;
        // this.setPaginator(res.data);
        this.setPaginator(res);
        this.tableExport(__amcSearch);
      });
  }

  /**Function for search in datatable */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  /**Function for get columns for searching in datatable */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }


  /**
   *  Get sub category master data from backend API
   * * This function fetches subcategory data from the backend API and sets it to the paginator.
   * @param params - Optional parameter for additional query parameters.
   * * @param __paginate - Optional parameter to specify the number of items per page.  
    * * Default value is '10'.
   * * This function uses the `api_call` method from the `DbIntrService` to make the API call.
   * * It subscribes to the response and maps the data to the `__selectSubCategory` MatTableDataSource.
   * * @returns void
   * * @example
   * ```typescript
   * this.getSubCategorymaster();
   * ```  
   */
  getSubCategorymaster(
    params: string | null = null,
    __paginate: string | null = '10'
  ) {
    this.__dbIntr
      .api_call(0, '/subcategory', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  private setPaginator(__res) {
    this.__selectSubCategory = new MatTableDataSource(__res);
  }
  
  /**
   * Get Category from backend API for listed down in filer scetion, so that we can filter that subcategory via these
   */
  getCategoryMst(){
     this.__dbIntr.api_call(0,'/category',null).pipe(pluck("data")).subscribe((res:category[]) =>{
      this.__catMst = res;
      if(this.data.cat_id){
        this.setCategoryControl(this.__catMst.filter(item => item.id == Number(this.data.cat_id)));
      }
      this.submit();
     })
  }

  /**
   * automatically populate category.
   * @param catDtls 
   */
  setCategoryControl(catDtls){
    this.__subcatForm.patchValue({
      cat_name:catDtls.map(({id,cat_name}) => ({id,cat_name}))
    })
  }

  ngAfterViewInit() {
    this.__subcatForm.controls['subcat_name'].valueChanges
      .pipe(
        tap(() => {
          this.__issubcatspinner = true;
          this.__subcatForm.controls['subcat_id'].setValue('');
      }),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/subcategory',
          (dt + '&arr_cat_id='+ JSON.stringify(this.__subcatForm.value.cat_name.map(item => item.id)))
          ) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__subcatForm.controls['subcat_id'].setValue('');
          this.__subcatMst = value;
          this.searchResultVisibility('block', 'S');
          this.__issubcatspinner = false;
        },
        complete: () => console.log(''),
        error: (err) => console.log(),
      });
  }
  /**
   * Open modal dialog box in full screen
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**
   * minimize modal dialog box
   */
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '47px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  /**
   * maximize modal dialog box
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

   /**
   * get subcategory list via selected filter
   */
  submit() {
    this.formValue = this.__subcatForm.value;
    this.getSubcatMst();
  }
  outsideClick(__ev, mode) {
    if (__ev) {
      this.searchResultVisibility('none', mode);
    }
  }

  /**Function for list selection from search input field and select particular item from that list*/
  getItems(__items, __type) {
    switch (__type) {
      case 'S':
        this.__subcatForm.controls['subcat_id'].setValue(__items.id);
        this.__subcatForm.controls['subcat_name'].reset(
          __items.subcategory_name,
          { onlySelf: true, emitEvent: false }
        );
        this.searchResultVisibility('none', 'S');
        break;
      default:
        break;
    }
  }

  /**Function for export table*/
  tableExport(__amcSearch) {
    __amcSearch.delete('paginate');
    this.__dbIntr
      .api_call(1, '/subcategoryExport', __amcSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res: subcat[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  /**
   * function for visibility of search input field list
   * @param display_mode 
   * @param __type 
   */
  searchResultVisibility(display_mode, __type) {
    switch (__type) {
      case 'S':
        this.searchsubcat.nativeElement.style.display = display_mode;
        break;
      default:
        break;
    }
  }

  /**
   *  Function for pagination of subcategory
   * * This function retrieves paginated data from the backend API based on the provided pagination URL and parameters.
   * * @param __paginate - An object containing the pagination URL and other parameters.
   * * This function constructs the URL with the current page number, selected category IDs, subcategory ID, sort order, and sort field.
   * * It then calls the `getpaginationData` method from the `DbIntrService` to fetch the data.
   * * @returns void
   * * @example
   * ```typescript
   * this.getPaginate({
   *   url: 'https://api.example.com/subcategories',
   *  });
   * @param __paginate 
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&cat_id=' + JSON.stringify(this.formValue?.cat_name.map(item => item.id))) +
            ('&subcat_id=' + this.formValue?.subcat_id) +
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

  /**
   * Open Dialog box for modification of subcategory
   * @param __subcategory 
   * @param __subcatId 
   */
  openDialog(__subcategory: subcat | null = null, __subcatId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'S',
      id: __subcatId,
      items: __subcategory,
      title: __subcatId == 0 ? 'Add Sub Category' : 'Update Sub Category',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __subcatId > 0 ? __subcatId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        SubcateModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectSubCategory.data.unshift(dt.data);
            this.__selectSubCategory._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'S',
      });
    }
  }
  /**
   * Func for open subcategory modal in dialog box
   * @param __items 
   */
  populateDT(__items) {
    this.openDialog(__items, __items.id);
  }
  /** Update subcategory */
  updateRow(row_obj: subcat) {
    this.__selectSubCategory.data = this.__selectSubCategory.data.filter(
      (value: subcat, key) => {
        if (value.id == row_obj.id) {
          value.subcategory_name = row_obj.subcategory_name;
          value.category_id = row_obj.category_id;
          value.cat_name = row_obj.cat_name;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: subcat, key) => {
      if (value.id == row_obj.id) {
        value.subcategory_name = row_obj.subcategory_name;
        value.category_id = row_obj.category_id;
        value.cat_name = row_obj.cat_name;
      }
      return true;
    });
  }

  /**
   * Function for reset form and call API for fetching subcategory
   */
  refreshOrAdvanceFlt() {
    // this.__subcatForm.get('cat_name').setValue('',{emitEvent:false});
    this.__subcatForm.get('subcat_name').setValue('',{emitEvent:false});
    this.__subcatForm.patchValue({
      options: '2',
      cat_name:[],
      subcat_id:''
    });
    this.__pageNumber.setValue('10');
    this.sort = new sort();
    this.submit();
  }
  /**
   * Function for delete subcategory
   */
  delete(__el, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'alertdialog';
    dialogConfig.data = {
      flag: 'S',
      id: __el.id,
      title: 'Delete ' + __el.subcategory_name,
      api_name: '/subcatDelete',
    };
    const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt.suc == 1) {
          this.__selectSubCategory.data.splice(index, 1);
          this.__selectSubCategory._updateChangeSubscription();
          this.__export.data.splice(
            this.__export.data.findIndex((x: any) => x.id == __el.id),
            1
          );
          this.__export._updateChangeSubscription();
        }
      }
    });
  }
  /**
   *  Function for custom sort of subcategory table
   * * This function is triggered when the user sorts the table by a specific field.
   * * It updates the `sort` object with the selected field and order.
   * * @param ev - The event object containing the sort field and order.
   * * * If the sort field is not 'edit' or 'delete', it calls the `getSubcatMst` method to fetch the sorted data.
   * * @returns void
   * * @example
   * ```typescript
   * this.customSort({ sortField: 'subcategory_name', sortOrder: 1 });
   * ```
   * * @description
   * This function checks if the `sortField` is not 'edit' or 'delete' before updating the `sort` object and fetching the data.
   * * It ensures that the sorting functionality works only for valid fields and does not interfere with the edit or delete actions.
   * @param ev 
   */
  customSort(ev) {
    if(ev.sortField != 'edit' && ev.sortField != 'delete'){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    if(ev.sortField){
     this.getSubcatMst();
  }
  }
  }
  /*
    * Function for handling item selection from the dropdown
    * @param ev - The event object containing the selected item.
    * @description
    * This function is triggered when an item is selected from the dropdown.
    *   It calls the `getSubcatMst` method to fetch the subcategory data based on the selected item.
    *  @returns void
    *  @example
    * ```typescript
    * this.onselectItem(event);
    * ```
    * @param ev
    * @returns void
    * */

  onselectItem(ev) {
    // this.submit();
    this.getSubcatMst();
  }
}
