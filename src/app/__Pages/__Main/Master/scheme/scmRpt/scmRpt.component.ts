/**
 * @file scmRpt.component.ts
 * This file contains the ScmRptComponent class which is responsible for managing the scheme report functionality in the Angular application.
 *  It includes methods for fetching scheme data, handling form submissions, and managing the display of scheme details.
 *  It also includes methods for filtering and sorting scheme data, as well as managing the visibility of the scheme report dialog.
 * @author [SUMAN MITRA]  
 * @version 1.0
 * * @date [Date]
 * * @description This component provides functionality for displaying and managing scheme reports, including filtering, sorting, and exporting data.
 *  
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
import { scheme } from 'src/app/__Model/__schemeMst';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmModificationComponent } from '../scmModification/scmModification.component';
import { schemeClmns } from '../../../../../__Utility/Master/schemeClmns';
import itemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { column } from 'src/app/__Model/tblClmns';
import { amc } from 'src/app/__Model/amc';
import { sort } from 'src/app/__Model/sort';
import frequency from '../../../../../../assets/json/SipFrequency.json';
import trxnType from '../../../../../../assets/json/Master/scmtrxnType.json';
import { Table } from 'primeng/table';
type selectBtn = {
  label: string;
  value: string;
  icon: string;
};

@Component({
  selector: 'app-scmRpt',
  templateUrl: './scmRpt.component.html',
  styleUrls: ['./scmRpt.component.css'],
})
export class ScmRptComponent implements OnInit {

  @ViewChild('dt') primeTbl :Table;

  formValue;

  __freq = frequency;
  __trxnType = trxnType;
  sort = new sort();

  settings_for_trxn_type = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'trxn_type',
    'Search Trxn Type',
    3
  );

  settings_for_freq = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'freq_name',
    'Search Frequency',
    2
  );

  settings = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'amc_short_name',
    'Search AMC',
    1
  );
  settingsForcat = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'cat_name',
    'Search Category',
    2
  );
  settingsForsubcat = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'subcategory_name',
    'Search Subcategory',
    1
  );
  settingsForScm = this.__utility.settingsfroMultiselectDropdown(
    'id',
    'scheme_name',
    'Search Scheme',
    1
  );
  tableWidth:number = 264;

  __amcMst: amc[] = [];
  isOpenMegaMenu: boolean = false;
  __isSchemeSpinner: boolean = false;
  isLoading: boolean = false;
  selectBtn: selectBtn[] = [
    { label: 'Advance Filter', value: 'A', icon: 'pi pi-filter' },
    { label: 'Reset', value: 'R', icon: 'pi pi-refresh' },
  ];
  itemsPerPage: selectBtn[] = itemsPerPage;
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  @ViewChild('searchcat') __searchCat: ElementRef;
  @ViewChild('searchsubcat') searchsubcat: ElementRef;
  // toppings = new FormControl();
  // toppingList: any = [];
  __scmForm = new FormGroup({
    scheme_status: new FormControl('O'),
    amc_name: new FormControl([], { updateOn: 'change' }),
    cat_id: new FormControl([], { updateOn: 'change' }),
    subcat_id: new FormControl([], { updateOn: 'change' }),
    scheme_id: new FormControl([], { updateOn: 'change' }),
    options: new FormControl('2'),
    alt_scheme_name: new FormControl(''),
    alt_scheme_id: new FormControl(''),
    advanceFlt: new FormControl('R'),
    freq: new FormControl([]),
    amt_rng: new FormControl(''),
    trxn_type: new FormControl([]),
  });
  __isVisible: boolean = true;
  displayMode_forScheme: string;
  __paginate: any = [];
  __pageNumber = new FormControl('A');
  __selectScm = new MatTableDataSource<scheme>([]);
  __exportedClmns: string[] = [];
  __columns: column[] = [];
  ClmnList: column[] = [];
  SelectedClms: string[] = [];
  __catMst: category[] = [];
  __subcatMst: subcat[] = [];
  schemeMst: scheme[] = [];
  searchedSchemeMst: Partial<scheme[]> = [];
  // __columnsForsummary: string[] = [];
  // __columnsForDetails: string[] = [];
  __export = new MatTableDataSource<scheme>([]);
  __iscatspinner: boolean = false;
  __issubcatspinner: boolean = false;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ScmRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    // this.getSchemeMst();
    this.formValue = this.__scmForm.value;
    this.setColumns(
      this.__scmForm.value.scheme_status,
      this.__scmForm.value.options
    );
    this.getAmcMst();
    this.getSchemeMst();
  }

  /**
   * Fetches the AMC master data from the database.
   * This method makes an API call to retrieve the AMC data and stores it in the `__amcMst` property.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called during the component initialization to populate the AMC master data.
   * * It uses the `api_call` method from the `DbIntrService` to fetch the data from the server.
   * * The retrieved data is then assigned to the `__amcMst` property, which can be used in the template for displaying AMC options.
   * * @example
   * this.getAmcMst();
   * @returns {void}
   * @method getAmcMst
   * @description This method is responsible for fetching the AMC master data from the server and storing it in the component's property.
   * * @see DbIntrService.api_call
   * * @usage 
   * This method is typically called during the component's initialization phase to ensure that the AMC data is available for selection in the form.
   * * @note  
   * This method does not take any parameters and does not return any value.
   * * It uses the `pluck` operator to extract the `data` property from the API response.
   */
  getAmcMst = () => {
    this.__dbIntr
      .api_call(0, '/amc', null)
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        this.__amcMst = res;
      });
  };
  
  /**
   *  Fetches categories against the provided AMC IDs.
   * This method makes an API call to retrieve categories based on the AMC IDs passed as an argument.
   * @param {Array} arr_amc_ids - An array of AMC IDs for which categories are to be fetched.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to populate the category dropdown based on the selected AMC IDs.
   * * It uses the `api_call` method from the `DbIntrService` to fetch the data from the server.
   * * The retrieved data is then assigned to the `__catMst` property, which can be used in the template for displaying category options.
   * * @example
   * this.getcategoryAgainstAmc([{id: 1}, {id: 2}]);
   * * @returns {void}
   * @method getcategoryAgainstAmc
   * @description This method is responsible for fetching categories against the provided AMC IDs from the server and storing them in the component's property.
   * * * @see DbIntrService.api_call
   * * @usage
   * This method is typically called when the user selects an AMC from the dropdown, and it updates the category options accordingly.
   * * @note
   * This method does not take any parameters and does not return any value.
   *  * It uses the `pluck` operator to extract the `data` property from the API response. 
   */
  getcategoryAgainstAmc = (arr_amc_ids) => {
    if (arr_amc_ids.length > 0) {
      this.__dbIntr
        .api_call(
          0,
          '/category',
          'arr_amc_id=' + JSON.stringify(arr_amc_ids.map((item) => item.id))
        )
        .pipe(pluck('data'))
        .subscribe((res: category[]) => {
          this.__catMst = res;
        });
    } else {
      // console.log('asdasddasdads')
      this.__scmForm.controls['cat_id'].reset([], { emitEvent: true });
      this.__catMst = [];
    }
  };

  /**
   *  Fetches subcategories against the provided category and AMC IDs.
   * This method makes an API call to retrieve subcategories based on the category and AMC IDs passed as arguments.
   * * @param {Array} arr_cat_ids - An array of category IDs for which subcategories are to be fetched.
   * * @param {Array} arr_amc_ids - An array of AMC IDs for which subcategories are to be fetched.
   * * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to populate the subcategory dropdown based on the selected category and AMC IDs.
   * * It uses the `api_call` method from the `DbIntrService` to fetch the data from the server.
   * * * The retrieved data is then assigned to the `__subcatMst` property, which can be used in the template for displaying subcategory options.
   * * * @example
   * this.getSubcategoryAgainstCategory([{id: 1}, {id: 2}], [{id: 1}]);
   * * @returns {void}
   * @method getSubcategoryAgainstCategory
   * * @description This method is responsible for fetching subcategories against the provided category and AMC IDs from the server and storing them in the component's property.
   * * * @see DbIntrService.api_call
   * * * @usage
   * This method is typically called when the user selects a category from the dropdown, and it updates the subcategory options accordingly.
   * * * @note
   * This method does not take any parameters and does not return any value.
   *  * It uses the `pluck` operator to extract the `data` property from the API response.
   */
  getSubcategoryAgainstCategory = (arr_cat_ids, arr_amc_ids) => {
    if (arr_cat_ids.length > 0 && arr_amc_ids.length > 0) {
      this.__dbIntr
        .api_call(
          0,
          '/subcategory',
          'arr_cat_id=' +
            JSON.stringify(arr_cat_ids.map((item) => item.id)) +
            '&arr_amc_id=' +
            JSON.stringify(arr_amc_ids.map((item) => item.id))
        )
        .pipe(pluck('data'))
        .subscribe((res: subcat[]) => {
          this.__subcatMst = res;
        });
    } else {
      this.__scmForm.controls['subcat_id'].reset([], { emitEvent: true });
      this.__subcatMst = [];
    }
  };
  /**
   *  Fetches schemes against the provided subcategory, category, and AMC IDs.
   * This method makes an API call to retrieve schemes based on the subcategory, category, and AMC IDs passed as arguments.
   * * @param {Array} arr_subcat_ids - An array of subcategory IDs for which schemes are to be fetched.
   * * * @param {Array} arr_cat_ids - An array of category IDs for which schemes are to be fetched.
   * * * @param {Array} arr_amc_ids - An array of AMC IDs for which schemes are to be fetched.
   * * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to populate the scheme dropdown based on the selected subcategory, category, and AMC IDs.
   * * * It uses the `api_call` method from the `DbIntrService` to fetch the data from the server.
   * * * The retrieved data is then assigned to the `schemeMst` property, which can be used in the template for displaying scheme options.
   * * * @example
   *  this.getSchemeAgainstSubCategory([{id: 1}, {id: 2}], [{id: 1}], [{id: 1}]);
   * * * @returns {void}
   * * @method getSchemeAgainstSubCategory
   * * @description This method is responsible for fetching schemes against the provided subcategory, category, and AMC IDs from the server and storing them in the component's property.
   * * * @see DbIntrService.api_call
   * * * @usage
   * This method is typically called when the user selects a subcategory from the dropdown, and it updates the scheme options accordingly.
   * * * @note
   * This method does not take any parameters and does not return any value.
   * * It uses the `pluck` operator to extract the `data` property from the API response.
   */
  getSchemeAgainstSubCategory = (arr_subcat_ids, arr_cat_ids, arr_amc_ids) => {
    if (
      arr_subcat_ids.length > 0 &&
      arr_cat_ids.length > 0 &&
      arr_amc_ids.length > 0
    ) {
      this.__dbIntr
        .api_call(
          0,
          '/scheme',
          'arr_subcat_id=' +
            JSON.stringify(arr_subcat_ids.map((item) => item.id)) +
            '&arr_cat_id=' +
            JSON.stringify(arr_cat_ids.map((item) => item.id)) +
            '&arr_amc_id=' +
            JSON.stringify(arr_amc_ids.map((item) => item.id))
        )
        .pipe(pluck('data'))
        .subscribe((res: scheme[]) => {
          this.schemeMst = res;
        });
    } else {
      this.__scmForm.controls['scheme_id'].reset([]);
      this.schemeMst = [];
    }
  };

  /**
   * Handles the form submission for scheme search.
   * This method is called when the user submits the scheme search form.
   * It retrieves the form values and calls the `getSchemeMst` method to fetch the scheme data based on the selected filters.
   * @return {void}
   * @memberof ScmRptComponent
   */
  setColumns(scm_status, option) {
    const clmnsTobeRemoved = ['edit', 'delete'];
    const Clms = ['nfo_start_dt', 'nfo_end_dt', 'nfo_reopen_dt'];
    // console.log(this.ClmnList)
    
    if (option == 2) {
      this.__columns = schemeClmns.Summary;
    } else {
      const clmn =scm_status == 'N' ? schemeClmns.column_selector : schemeClmns.column_selector.filter((item) => !Clms.includes(item.field));
      this.__columns = clmn;
    }
    console.log(this.__columns);
    this.tableWidth = this.__columns.map(el => el.width ? Number(el.width.split('rem')[0]) : 0).reduce(function (x, y) {return x + y;}, 0);
    this.ClmnList = scm_status == 'N' ? schemeClmns.column_selector : schemeClmns.column_selector.filter((item) => !Clms.includes(item.field));
    this.SelectedClms = this.__columns.map((x) => x.field);
    // console.log()
    // this.__exportedClmns = this.__columns
    //   .filter((x: any) => !clmnsTobeRemoved.includes(x.field))
    //   .map((item) => {
    //     return item['field'];
    //   });
  }

  
  /**
   * Handles the form submission for scheme search.
   * This method is called when the user submits the scheme search form.
   * It retrieves the form values and calls the `getSchemeMst` method to fetch the scheme data based on the selected filters.
   * @return {void}
   * @memberof ScmRptComponent
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }

  /**
   * search scheme in datatable
   * @param $event 
   */
  filterGlobal($event){
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  /**
   *  Fetches the scheme master data based on the selected filters.
   * This method makes an API call to retrieve scheme data based on the selected filters such as AMC, category, subcategory, scheme ID, and transaction type.
   *  * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called to fetch the scheme master data based on the selected filters from the form.
   * * * It uses the `api_call` method from the `DbIntrService` to make a POST request to the `/schemeDetailSearch` endpoint.
   *  * * The form values are appended to a `FormData` object, which is then sent in the request body.
   *  * * The retrieved data is then processed and displayed in the table.
   *  * @example
   *  this.getSchemeMst('scheme_name', 'asc');
   * *  * @param {string} column_name - The name of the column to sort by (optional).
   * * * @param {string} sort_by - The sorting order (asc or desc) (optional).
   *  * * @returns {void}
   * * * @method getSchemeMst
   *  * * @description This method is responsible for fetching the scheme master data based on the selected filters and displaying it in the table.
   * * * * @see DbIntrService.api_call
   * * * * @usage
   * This method is typically called when the user submits the scheme search form or when the filters are changed.
   * * * @note
   * This method does not take any parameters and does not return any value.
   * * It uses the `map` operator to transform the response data before subscribing to it.
   */
  getSchemeMst(
    column_name: string | null = '',
    sort_by: string | null = 'asc'
  ) {
    const __scmExport = new FormData();
    __scmExport.append('paginate', this.__pageNumber.value);
    __scmExport.append('scheme_type', this.formValue?.scheme_status);
    __scmExport.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __scmExport.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    __scmExport.append(
      'cat_id',
      JSON.stringify(this.formValue?.cat_id.map((item) => item.id))
    );
    __scmExport.append(
      'amc_id',
      JSON.stringify(this.formValue?.amc_name.map((item) => item.id))
    );
    __scmExport.append(
      'subcat_id',
      JSON.stringify(this.formValue?.subcat_id.map((item) => item.id))
    );
    __scmExport.append(
      'scheme_id',
      JSON.stringify(this.formValue?.scheme_id.map((item) => item.id))
    );
    __scmExport.append('search_scheme_id',global.getActualVal(this.formValue?.alt_scheme_id));
    if(this.formValue?.advanceFlt == 'A'){
      __scmExport.append(
        'trans_type_id',
        JSON.stringify(this.formValue?.trxn_type.map((item) => item.id))
      );
      __scmExport.append(
        'amount_range',
        global.getActualVal(this.formValue?.amt_rng)
      );
      __scmExport.append(
        'frequency',
        JSON.stringify(this.formValue?.freq.map((item) => item.id))
      );
    }

    this.__dbIntr
      .api_call(1, '/schemeDetailSearch', __scmExport)
      .pipe(
        map((x: any) => x.data)
      )
      .subscribe((res: any) => {
        console.log(res);
        // res.data.forEach(el =>{
        //     console.log(el.sip_date.join())
        // })
        const dt = res.data.map(el => {
             el.scheme_type = el.scheme_type == 'O' ? 'Ongoing Scheme' : "NFO";
             return el;
        })
        this.setPaginator(dt);
        // this.__paginate = res.links
        // this.tableExport(__scmExport);
      });
  }

  /**
   * Sets the paginator for the scheme data.
   * This method updates the paginator based on the total number of records and the current page size.
   * @param {scheme[]} data - The array of scheme data to be paginated.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to set the paginator for the scheme data.
   * * It calculates the total number of pages based on the length of the data and the current page size.
   * * It then updates the `__paginate` property with the new paginator settings.
   * * @example
   * this.setPaginator(schemeData);
   * * @param {scheme[]} data - The array of scheme data to be paginated.
   * * @returns {void}
   * * @method setPaginator
   * * @description This method is responsible for setting the paginator for the scheme data.
   * * * @usage
   *  This method is typically called after fetching the scheme data to update the paginator settings.
   * * * @note
   * This method does not take any parameters and does not return any value.
   * * It uses the `length` property of the data array to calculate the total number of pages.
   */ 
  populateDT(__scm: scheme) {
    this.openDialog(__scm, __scm.id, __scm.scheme_type);
  }
 /**
  * Opens a dialog for scheme modification.
  * If the dialog is already open, it updates the size of the dialog.
  * @param {scheme | null} __scheme - The scheme data to be modified, can be null for new schemes.
  * @param {number} __scmId - The ID of the scheme to be modified, 0 for new schemes.
  * @param {string} __scmType - The type of the scheme (e.g., 'Ongoing', 'NFO').
  * @return {void}
  * @memberof ScmRptComponent
  * @description This method is called to open a dialog for scheme modification.
  *   * It creates a new `MatDialogConfig` object and sets various properties such as `autoFocus`, `closeOnNavigation`, `disableClose`, `hasBackdrop`, and `width`.
  * *   * It also sets the `data` property of the dialog config with the scheme details, including the flag, ID, items, title, right position, product ID, and scheme type.
  * *   * If the scheme ID is greater than 0, it sets the dialog ID to the scheme ID, otherwise it sets it to '0'.
  * *   * It then opens the dialog using the `MatDialog` service and subscribes to the `afterClosed` event to handle the dialog result.
  * * @example
  * this.openDialog(schemeData, schemeId, schemeType);
  * * @param {scheme | null} __scheme - The scheme data to be modified, can be null for new schemes.
  * * @param {number} __scmId - The ID of the scheme to be modified, 0 for new schemes.
  * * @param {string} __scmType - The type of the scheme (e.g., 'Ongoing', 'NFO').
  * * @returns {void}
  * * @method openDialog
  * * @description This method is responsible for opening a dialog for scheme modification.
  * * * @see MatDialog
  * * * @usage
  * This method is typically called when the user wants to add or update a scheme.
  * * * @note
  * This method does not take any parameters and does not return any value.
  * * It uses the `MatDialog` service to open the dialog and handle the dialog result.
  * * * It also uses the `MatDialogConfig` to configure the dialog properties such as width, data, and ID.
  * * * It uses the `afterClosed` method to handle the dialog result and update the scheme data accordingly.
  * */
  openDialog(
    __scheme: scheme | null = null,
    __scmId: number,
    __scmType: string
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SC',
      id: __scmId,
      items: __scheme,
      title: __scmId == 0 ? 'Add Scheme' : 'Update Scheme',
      right: global.randomIntFromInterval(1, 60),
      product_id: this.data.product_id ? this.data.product_id : '',
      scheme_type: __scmType == 'NFO' ? 'N' : "O",
    };
    dialogConfig.id = __scmId > 0 ? __scmId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ScmModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectScm.data.unshift(dt.data);
            this.__selectScm._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SC',
      });
    }
  }
  /**
   * Updates a row in the scheme data.
   * This method filters the existing scheme data and updates the row with the provided `row_obj`.
   * * @param {scheme} row_obj - The scheme object containing the updated data.
   * * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called to update a specific row in the scheme data.
   * * It filters the existing scheme data and updates the row with the provided `row_obj`.
   * * * It updates various properties of the scheme object such as `product_id`, `amc_id`, `category_id`, `subcategory_id`, `scheme_name`, etc.
   * * * It also updates the scheme type, NFO dates, SIP and STP amounts, and other related properties.
   * * * @example
   * this.updateRow({#scheme object with updated data#});
   * * * @param {scheme} row_obj - The scheme object containing the updated data.
   *  * * @returns {void}
   * * * @method updateRow
   * * * @description This method is responsible for updating a specific row in the scheme data.
   * * * * @usage
   * This method is typically called when the user updates a scheme in the dialog.
   *  * * * @note
   * This method does not take any parameters and does not return any value.
   * * It uses the `filter` method to find the row with the matching ID and updates its properties.
   *  * * It also updates the `__selectScm.data` array with the modified row.
   * * * It uses the `data` property of the `__selectScm` MatTableDataSource to update the scheme data.
   * */
  updateRow(row_obj: scheme) {
    this.__selectScm.data = this.__selectScm.data.filter(
      (value: scheme, key) => {
        if (value.id == row_obj.id) {
          value.product_id = row_obj.product_id,
            value.amc_id = row_obj.amc_id,
            value.category_id = row_obj.category_id,
            value.subcategory_id = row_obj.subcategory_id,
            value.scheme_name = row_obj.scheme_name,
            value.id = row_obj.id,
            value.scheme_type = row_obj.scheme_type == 'O' ? 'Ongoing Scheme' : 'NFO',
            value.nfo_start_dt = row_obj.nfo_start_dt,
            value.nfo_end_dt = row_obj.nfo_end_dt,
            value.nfo_reopen_dt = row_obj.nfo_reopen_dt,
            value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt,
            value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt,
            value.pip_add_min_amt = row_obj.pip_add_min_amt,
            value.sip_add_min_amt = row_obj.sip_add_min_amt,
            value.sip_date = row_obj.sip_date,
            value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt,
            value.gstin_no = row_obj.gstin_no;
          value.stp_date = row_obj.stp_date;
          value.swp_date = row_obj.swp_date;
          value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt;
          value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt;
          value.ava_special_sip = row_obj.ava_special_sip;
          value.special_sip_name = row_obj.special_sip_name;
          value.ava_special_swp = row_obj.ava_special_swp;
          value.special_swp_name = row_obj.special_swp_name;
          value.ava_special_stp = row_obj.ava_special_stp;
          value.special_stp_name = row_obj.special_stp_name;
          value.nfo_entry_date = row_obj.nfo_entry_date;
          value.step_up_min_amt = row_obj.step_up_min_amt;
          value.step_up_min_per = row_obj.step_up_min_per;
          value.benchmark = row_obj.benchmark;
          value.benchmark_id = row_obj.benchmark_id;
          value.A_sip_min_A_amount = row_obj.A_sip_min_A_amount;
          value.A_sip_min_F_amount = row_obj.A_sip_min_F_amount;
          value.A_stp_min_amount = row_obj.A_stp_min_amount;
          value.A_swp_min_amount = row_obj.A_swp_min_amount;
          value.D_sip_min_A_amount = row_obj.D_sip_min_A_amount;
          value.D_sip_min_F_amount = row_obj.D_sip_min_F_amount;
          value.D_stp_min_amount = row_obj.D_stp_min_amount;
          value.D_swp_min_amount = row_obj.D_swp_min_amount;
          value.F_sip_min_A_amount = row_obj.F_sip_min_A_amount;
          value.F_sip_min_F_amount = row_obj.F_sip_min_F_amount;
          value.F_stp_min_amount = row_obj.F_stp_min_amount;
          value.F_swp_min_amount = row_obj.F_swp_min_amount;
          value.M_sip_min_A_amount = row_obj.M_sip_min_A_amount;
          value.M_sip_min_F_amount = row_obj.M_sip_min_F_amount;
          value.M_stp_min_amount = row_obj.M_stp_min_amount;
          value.M_swp_min_amount = row_obj.M_swp_min_amount;
          value.Q_sip_min_A_amount = row_obj.Q_sip_min_A_amount;
          value.Q_sip_min_F_amount = row_obj.Q_sip_min_F_amount;
          value.Q_stp_min_amount = row_obj.Q_stp_min_amount;
          value.Q_swp_min_amount = row_obj.Q_swp_min_amount;
          value.S_sip_min_A_amount = row_obj.S_sip_min_A_amount;
          value.S_sip_min_F_amount = row_obj.S_sip_min_F_amount;
          value.S_stp_min_amount = row_obj.S_stp_min_amount;
          value.S_swp_min_amount = row_obj.S_swp_min_amount;
          value.W_sip_min_A_amount = row_obj.W_sip_min_A_amount;
          value.W_sip_min_F_amount = row_obj.W_sip_min_F_amount;
          value.W_stp_min_amount = row_obj.W_stp_min_amount;
          value.W_swp_min_amount = row_obj.W_swp_min_amount;
          value.sip_allowed = row_obj.sip_allowed;
          value.stp_allowed = row_obj.stp_allowed;
          value.swp_allowed = row_obj.swp_allowed;
          value.switch_allowed = row_obj.switch_allowed;
          value.purchase_allowed = row_obj.purchase_allowed;
          value.switch_min_amt = row_obj.switch_min_amt;
          value.switch_mul_amt = row_obj.switch_mul_amt;
          value.exit_load = row_obj.exit_load;
          value.pip_multiple_amount = row_obj.pip_multiple_amount;
          value.tax_implication = row_obj.tax_implication;
          value.tax_implication_id = row_obj.tax_implication_id;
        }
        return true;
      }
    );
    // this.__export.data = this.__export.data.filter((value: scheme, key) => {
    //   if (value.id == row_obj.id) {
    //     (value.product_id = row_obj.product_id),
    //       (value.amc_id = row_obj.amc_id),
    //       (value.category_id = row_obj.category_id),
    //       (value.subcategory_id = row_obj.subcategory_id),
    //       (value.scheme_name = row_obj.scheme_name),
    //       (value.id = row_obj.id),
    //       (value.scheme_type = row_obj.scheme_type == 'O' ? 'Ongoing Scheme' : 'NFO'),
    //       (value.nfo_start_dt = row_obj.nfo_start_dt),
    //       (value.nfo_end_dt = row_obj.nfo_end_dt),
    //       (value.nfo_reopen_dt = row_obj.nfo_reopen_dt),
    //       (value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt),
    //       (value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt),
    //       (value.pip_add_min_amt = row_obj.pip_add_min_amt),
    //       (value.sip_add_min_amt = row_obj.sip_add_min_amt),
    //       (value.sip_date = row_obj.sip_date),
    //       (value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt),
    //       (value.gstin_no = row_obj.gstin_no);
    //     value.stp_date = row_obj.stp_date;
    //     value.swp_date = row_obj.swp_date;
    //     value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt;
    //     value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt;
    //     value.ava_special_sip = row_obj.ava_special_sip;
    //     value.special_sip_name = row_obj.special_sip_name;
    //     value.ava_special_swp = row_obj.ava_special_swp;
    //     value.special_swp_name = row_obj.special_swp_name;
    //     value.ava_special_stp = row_obj.ava_special_stp;
    //     value.special_stp_name = row_obj.special_stp_name;
    //     value.nfo_entry_date = row_obj.nfo_entry_date;
    //     value.step_up_min_amt = row_obj.step_up_min_amt;
    //     value.step_up_min_per = row_obj.step_up_min_per;
    //     value.benchmark = row_obj.benchmark;
    //     value.benchmark_id = row_obj.benchmark_id;
    //     value.A_sip_min_A_amount = row_obj.A_sip_min_A_amount;
    //       value.A_sip_min_F_amount = row_obj.A_sip_min_F_amount;
    //       value.A_stp_min_amount = row_obj.A_stp_min_amount;
    //       value.A_swp_min_amount = row_obj.A_swp_min_amount;
    //       value.D_sip_min_A_amount = row_obj.D_sip_min_A_amount;
    //       value.D_sip_min_F_amount = row_obj.D_sip_min_F_amount;
    //       value.D_stp_min_amount = row_obj.D_stp_min_amount;
    //       value.D_swp_min_amount = row_obj.D_swp_min_amount;
    //       value.F_sip_min_A_amount = row_obj.F_sip_min_A_amount;
    //       value.F_sip_min_F_amount = row_obj.F_sip_min_F_amount;
    //       value.F_stp_min_amount = row_obj.F_stp_min_amount;
    //       value.F_swp_min_amount = row_obj.F_swp_min_amount;
    //       value.M_sip_min_A_amount = row_obj.M_sip_min_A_amount;
    //       value.M_sip_min_F_amount = row_obj.M_sip_min_F_amount;
    //       value.M_stp_min_amount = row_obj.M_stp_min_amount;
    //       value.M_swp_min_amount = row_obj.M_swp_min_amount;
    //       value.Q_sip_min_A_amount = row_obj.Q_sip_min_A_amount;
    //       value.Q_sip_min_F_amount = row_obj.Q_sip_min_F_amount;
    //       value.Q_stp_min_amount = row_obj.Q_stp_min_amount;
    //       value.Q_swp_min_amount = row_obj.Q_swp_min_amount;
    //       value.S_sip_min_A_amount = row_obj.S_sip_min_A_amount;
    //       value.S_sip_min_F_amount = row_obj.S_sip_min_F_amount;
    //       value.S_stp_min_amount = row_obj.S_stp_min_amount;
    //       value.S_swp_min_amount = row_obj.S_swp_min_amount;
    //       value.W_sip_min_A_amount = row_obj.W_sip_min_A_amount;
    //       value.W_sip_min_F_amount = row_obj.W_sip_min_F_amount;
    //       value.W_stp_min_amount = row_obj.W_stp_min_amount;
    //       value.W_swp_min_amount = row_obj.W_swp_min_amount;
    //       value.sip_allowed = row_obj.sip_allowed;
    //       value.stp_allowed = row_obj.stp_allowed;
    //       value.swp_allowed = row_obj.swp_allowed;
    //       value.switch_allowed = row_obj.switch_allowed;
    //       value.purchase_allowed = row_obj.purchase_allowed;
    //       value.switch_min_amt = row_obj.switch_min_amt;
    //       value.switch_mul_amt = row_obj.switch_mul_amt;
    //       value.exit_load = row_obj.exit_load;
    //       value.pip_multiple_amount = row_obj.pip_multiple_amount;
    //       value.tax_implication = row_obj.tax_implication;
    //       value.tax_implication_id = row_obj.tax_implication_id;
    //   }
    //   return true;
    // });
  }
  /**
   * Angular lifecycle hook that is called after the component's view has been fully initialized.
   * This method sets up subscriptions to form control value changes and initializes the component's state.
   * * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called after the component's view has been fully initialized.
   * * It sets up subscriptions to form control value changes for options, scheme status, AMC name, category ID, and subcategory ID.
   *  * It also initializes the search scheme functionality and sets up the virtual scroll speed.
   * * * @example
   * this.ngAfterViewInit();
   * * @returns {void}
   * * @method ngAfterViewInit
   *  * * @description This method is responsible for initializing the component's state and setting up subscriptions to form control value changes.
   * * * * @usage
   * This method is typically called after the component's view has been fully initialized.
   * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * It uses the `valueChanges` observable of the form controls to subscribe to changes in their values.
   * * * It also uses the `debounceTime`, `distinctUntilChanged`, and `switchMap` operators to handle the search functionality for schemes.
   * * * It sets up the virtual scroll speed for the scheme search results.
   * * * @see DbIntrService.searchItems
   * * * @see MatDialog
   * * @see MatTableDataSource
   * * @usage
   * This method is typically called after the component's view has been fully initialized to set up the necessary subscriptions and initial state.
  */
  ngAfterViewInit() {
    this.__scmForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumns(this.__scmForm.get('scheme_status').value, res);
    });

    this.__scmForm.controls['scheme_status'].valueChanges.subscribe((res) => {
      this.setColumns(res, this.__scmForm.get('options').value);
    });

    this.__scmForm.controls['amc_name'].valueChanges.subscribe((res) => {
      console.log(res);
      this.getcategoryAgainstAmc(res);
      this.getSubcategoryAgainstCategory(
        this.__scmForm.controls['cat_id'].value,
        res
      );
      this.getSchemeAgainstSubCategory(
        this.__scmForm.controls['subcat_id'].value,
        this.__scmForm.controls['cat_id'].value,
        res
      );
    });
    this.__scmForm.controls['cat_id'].valueChanges.subscribe((res) => {
      this.getSubcategoryAgainstCategory(
        res,
        this.__scmForm.controls['amc_name'].value
      );
      this.getSchemeAgainstSubCategory(
        this.__scmForm.controls['subcat_id'].value,
        res,
        this.__scmForm.controls['amc_name'].value
      );
    });
    this.__scmForm.controls['subcat_id'].valueChanges.subscribe((res) => {
      this.getSchemeAgainstSubCategory(
        res,
        this.__scmForm.controls['cat_id'].value,
        this.__scmForm.controls['amc_name'].value
      );
    });

    this.__scmForm.controls['alt_scheme_name'].valueChanges
      .pipe(

        tap(() => (
          this.__isSchemeSpinner = true,
          this.__scmForm.controls['alt_scheme_id'].setValue('')
          )),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/scheme', dt) : []
        ),
        map((x: any) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.searchedSchemeMst = value;
          this.searchSchemeVisibility('block');
          this.__isSchemeSpinner = false;
          this.__scmForm.controls['alt_scheme_id'].setValue('');
        },
        complete: () => console.log(''),
        error: (err) => {
          this.__isSchemeSpinner = false;
        },
      });

      const el = document.querySelector<HTMLElement>('.cdk-virtual-scroll-viewport');
      this.changeWheelSpeed(el, 0.99);
  }

  /**
   * Changes the wheel speed for the virtual scroll container.
   * This method adjusts the scroll speed of the virtual scroll container based on the mouse wheel movement.
   * @param {HTMLElement} container - The container element for the virtual scroll.
   * @param {number} speedY - The speed factor for vertical scrolling.
   * @return {Function} - A function to remove the event listeners when no longer needed.
   */
  changeWheelSpeed(container, speedY) {
    var scrollY = 0;
    var handleScrollReset = function() {
        scrollY = container.scrollTop;
    };
    var handleMouseWheel = function(e) {
        e.preventDefault();
        scrollY += speedY * e.deltaY
        if (scrollY < 0) {
            scrollY = 0;
        } else {
            var limitY = container.scrollHeight - container.clientHeight;
            if (scrollY > limitY) {
                scrollY = limitY;
            }
        }
        container.scrollTop = scrollY;
    };

    var removed = false;
    container.addEventListener('mouseup', handleScrollReset, false);
    container.addEventListener('mousedown', handleScrollReset, false);
    container.addEventListener('mousewheel', handleMouseWheel, false);

    return function() {
        if (removed) {
            return;
        }
        container.removeEventListener('mouseup', handleScrollReset, false);
        container.removeEventListener('mousedown', handleScrollReset, false);
        container.removeEventListener('mousewheel', handleMouseWheel, false);
        removed = true;
    };
  }
  /**
   * Sets the visibility of the search scheme based on the display mode.
   * This method updates the `displayMode_forScheme` property to control the visibility of the search scheme.
   * @param {string} display_mode - The display mode to set for the search scheme visibility.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to set the visibility of the search scheme based on the provided display mode.
   * * It updates the `displayMode_forScheme` property to control the visibility of the search scheme.
   * * * @example
   * this.searchSchemeVisibility('block');
   *  * * @param {string} display_mode - The display mode to set for the search scheme visibility.
   * * * @returns {void}
   * * * @method searchSchemeVisibility
   * * * @description This method is responsible for setting the visibility of the search scheme based on the provided display mode.
   * * * * * @usage
   * This method is typically called when the user interacts with the search scheme input field to show or hide the search results.
   * * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * It updates the `displayMode_forScheme` property to control the visibility of the search scheme.
   * * * * @see MatDialog
   * * * * @see MatTableDataSource
   * * * @usage
   * This method is typically called when the user interacts with the search scheme input field to show or hide the search results.
   * */
  searchSchemeVisibility(display_mode) {
    this.displayMode_forScheme = display_mode;
  }
  /**
   * Refreshes or advances the filter based on the selected advance filter option.
   *  This method checks if the advance filter option is set to 'R' (Refresh) and updates the form controls accordingly.
   * * @return {void}
   * @memberof ScmRptComponent
   *  * @description This method is called to refresh or advance the filter based on the selected advance filter option.
   * * It checks if the advance filter option is set to 'R' (Refresh) and updates the form controls accordingly.
   *  * * It resets the options, frequency, amount range, and transaction type controls to their default values.
   * * * It also clears the selected AMC name and sets the alternate scheme ID and name to empty values.
   * * * @example
   * this.refreshOrAdvanceFlt();
   * * * @returns {void}
   * * * @method refreshOrAdvanceFlt
   * * * @description This method is responsible for refreshing or advancing the filter based on the selected advance filter option.
   * * * * @usage
   * This method is typically called when the user selects the advance filter option to refresh or advance the filter.
   * * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * It updates the form controls to reset the filter options and clear the selected values.
   * * * * It also sets the page number to '10' and resets the sorting order.
   * * * * @see DbIntrService.api_call
   * * * * @see MatDialog
   * * * @see MatTableDataSource
   * * * @usage
   * This method is typically called when the user selects the advance filter option to refresh or advance the filter.
   * */
  refreshOrAdvanceFlt() {
    if (this.__scmForm.controls['advanceFlt'].value == 'R') {
      this.__scmForm.patchValue({
        options: '2',
        freq:[],
        amt_rng:'',
        trxn_type:[]
      });
      this.__scmForm.get('amc_name').setValue([],{emitEvent:true});
      this.__scmForm.controls['alt_scheme_id'].setValue('');
      this.__scmForm.controls['alt_scheme_name'].setValue('',{emitEvent:false});
      this.__pageNumber.setValue('10');
      this.sort = new sort();
     this.submit();
    }
  }
  /**
   * Submits the form and retrieves the scheme master data based on the form values.
   * This method collects the form values and calls the `getSchemeMst` method to fetch the scheme data.
   * * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called to submit the form and retrieve the scheme master data based on the form values.
   * * It collects the form values from the `__scmForm` and assigns them to the `formValue` property.
   * * * It then calls the `getSchemeMst` method with the sorting order and direction to fetch the scheme data.
   * * * @example
   * this.submit();
   * * * @returns {void}
   * * * @method submit
   * * * @description This method is responsible for submitting the form and retrieving the scheme master data based on the form values.
   * * * * @usage
   * This method is typically called when the user clicks the submit button to fetch the scheme data.
   * * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * * It collects the form values from the `__scmForm` and assigns them to the `formValue` property.
   *  
   * * * It then calls the `getSchemeMst` method with the sorting order and direction to fetch the scheme data.
   * * * * @see DbIntrService.api_call
   * * * @see MatDialog
   * * * @see MatTableDataSource
   * * * @usage
   * This method is typically called when the user clicks the submit button to fetch the scheme data.
   * */
  submit() {
    this.formValue = this.__scmForm.value;
    this.getSchemeMst(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
  }
  /**
   * Exports the scheme data to a table format.
   *  This method calls the `api_call` method of the `__dbIntr` service to export the scheme data based on the provided `__scmExport` object.
   * * @param {scheme} __scmExport - The scheme export object containing the data to be exported.
   * * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called to export the scheme data to a table format.
   * * It calls the `api_call` method of the `__dbIntr` service with the endpoint '/schemeExport' and the `__scmExport` object.
   * * * It maps the response data to an array of `scheme` objects and assigns it to the `__export` property.
   * * * @example
   * this.tableExport({#scheme export object#});
   * * * @param {scheme} __scmExport - The scheme export object containing the data to be exported.
   * * * @returns {void}
   * * * @method tableExport
   * * * @description This method is responsible for exporting the scheme data to a table format.
   * * * * * @usage
   * This method is typically called when the user wants to export the scheme data to a table format.
   * * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * It calls the `api_call` method of the `__dbIntr` service with the endpoint '/schemeExport' and the `__scmExport` object.
   * * * * It maps the response data to an array of `scheme` objects and assigns it to the `__export` property.
   * * * * @see DbIntrService.api_call
   * * * @see MatDialog
   * * * @see MatTableDataSource
   * * * @usage
   * This method is typically called when the user wants to export the scheme data to a table format.
   * */
  tableExport(__scmExport) {
    this.__dbIntr
      .api_call(1, '/schemeExport', __scmExport)
      .pipe(
        map((x: any) => x.data)
      )
      .subscribe((res: scheme[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  /**
   * Retrieves the scheme master data with pagination.
   * This method calls the `api_call` method of the `__dbIntr` service to fetch the scheme data with pagination.
   *  * @param {string | null} __paginate - The pagination parameter, default is '10'.
   * * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called to retrieve the scheme master data with pagination.
   * * It calls the `api_call` method of the `__dbIntr` service with the endpoint '/scheme' and the pagination parameter.
   * * * It maps the response data to an array of scheme objects and sets the paginator for the MatTableDataSource.
   * * * @example
   * this.getSchememaster('10');
   * * * @param {string | null} __paginate - The pagination parameter, default is '10'.
   * * * @returns {void}
   * * * @method getSchememaster
   * * * @description This method is responsible for retrieving the scheme master data with pagination.
   *  * * * * @usage
   * This method is typically called when the component is initialized to fetch the initial scheme data.
   * * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * * It calls the `api_call` method of the `__dbIntr` service with the endpoint '/scheme' and the pagination parameter.
   * * * * * It maps the response data to an array of scheme objects and sets the paginator for the MatTableDataSource.
   * * * * * @see DbIntrService.api_call
   * * * @see MatDialog
   * * * @see MatTableDataSource
   * * * @usage
   *  This method is typically called when the component is initialized to fetch the initial scheme data.
   * */
  getSchememaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/scheme', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  /**
   * Retrieves the paginated scheme data based on the provided pagination object.
   * This method calls the `getpaginationData` method of the `__dbIntr` service to fetch the paginated scheme data.
   * @param {paginate} __paginate - The pagination object containing the URL for pagination.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to retrieve the paginated scheme data based on the provided pagination object.
   * It calls the `getpaginationData` method of the `__dbIntr` service with the constructed URL and query parameters.
   * It maps the response data to an array of scheme objects and updates the `__paginate` property with the new links.
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.isLoading = !this.isLoading;
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&scheme_id=' +
              JSON.stringify(
                this.formValue?.scheme_id.map((item) => item.id)
              )) +
              ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
              ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : '')) +
            ('&cat_id=' +
              JSON.stringify(
                this.formValue?.cat_id.map((item) => item.id)
              )) +
            ('&amc_id=' +
              JSON.stringify(
                this.formValue?.amc_name.map((item) => item.id)
              )) +
            ('&subcat_id=' +
              JSON.stringify(
                this.formValue?.subcat_id.map((item) => item.id)
              )) +
            ('&scheme_type=' + this.formValue?.scheme_status) +
            (
              this.formValue?.advanceFlt == 'A'?
              (('&freq=' + JSON.stringify(this.formValue?.freq.map(item => item.id)))
              + ('&trans_type_id=' + JSON.stringify(this.formValue?.trxn_type.map(item => item.id)))
              + ('&amount_range=' + global.getActualVal(this.formValue?.amt_rng))
              )
              : ''
            )

        )
        .pipe(
          map((x: any) => x.data),
          map((x) => {
            this.__paginate = x.links;
            return x.data.map((item) => {
              const object = { ...item };
              object.daily_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'D'
              );
              (object.daily_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'D'
              )),
                (object.weekly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                  item.sip_freq_wise_amt,
                  'F',
                  'W'
                ));
              (object.weekly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'W'
              )),
                (object.fortnightly_sip_fresh_min_amt =
                  global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'F'));
              (object.fortnightly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'F'
              )),
                (object.monthly_sip_fresh_min_amt = global.getFrequencywiseAmt(
                  item.sip_freq_wise_amt,
                  'F',
                  'M'
                ));
              (object.monthly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'M'
              )),
                (object.quarterly_sip_fresh_min_amt =
                  global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'Q'));
              object.quarterly_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'Q'
              );
              object.semi_anually_sip_fresh_min_amt =
                global.getFrequencywiseAmt(item.sip_freq_wise_amt, 'F', 'S');
              object.semi_anually_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'S'
              );
              object.anually_sip_fresh_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'F',
                'A'
              );
              object.anually_sip_add_min_amt = global.getFrequencywiseAmt(
                item.sip_freq_wise_amt,
                'A',
                'A'
              );
              object.daily_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'D'
              );
              object.weekly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'W'
              );
              object.fortnightly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'F'
              );
              object.monthly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'M'
              );
              object.quarterly_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'Q'
              );
              object.semi_anually_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'S'
              );
              object.anually_swp_amt = global.getFrequencywiseAmt(
                item.swp_freq_wise_amt,
                'F',
                'A'
              );
              object.daily_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'D'
              );
              object.weekly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'W'
              );
              object.fortnightly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'F'
              );
              object.monthly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'M'
              );
              object.quarterly_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'Q'
              );
              object.semi_anually_stp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'S'
              );
              object.anually_swp_amt = global.getFrequencywiseAmt(
                item.stp_freq_wise_amt,
                'F',
                'A'
              );
              return object;
            });
          })
        )
        .subscribe(
          (res: any) => {
            this.setPaginator(res);
            // this.__paginate = res.links;
            this.isLoading = !this.isLoading;
          },
          (error) => {
            this.isLoading = !this.isLoading;
          }
        );
    }
  }
  /**
   * Retrieves the scheme master data based on the provided sorting order and direction.
   * This method calls the `getPaginate` method to fetch the paginated scheme data.
   * @param {string} [__sortOrder] - The sorting order, default is 'asc'.
   * @param {string} [__sortDirection] - The sorting direction, default is 'asc'.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to retrieve the scheme master data based on the provided sorting order and direction.
   * It calls the `getPaginate` method to fetch the paginated scheme data with the specified sorting parameters.
   */
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.submit();
  }
  
  /**
   * set the datata source for the paginator.
   * This method sets the data source for the paginator to the provided response data. 
   * @param __res 
   */
  setPaginator(__res) {
    this.__selectScm = new MatTableDataSource(__res);
  }
  
  /**
   * Toggles the full-screen mode of the dialog.
   * This method adds or removes the 'full_screen' class from the dialog panel and updates its position.
   * * @return {void}
   * @memberof ScmRptComponent
   * * @description This method is called to toggle the full-screen mode of the dialog.
   * * It adds or removes the 'full_screen' class from the dialog panel and updates its position to occupy the full screen.
   * * * @example
   * this.fullScreen();
   * * * @returns {void}
   * * * @method fullScreen
   * * * @description This method is responsible for toggling the full-screen mode of the dialog.
   * * * * * @usage
   * This method is typically called when the user clicks the full-screen button in the dialog header.
   * * * * * @note
   * This method does not take any parameters and does not return any value.
   * * * It adds or removes the 'full_screen' class from the dialog panel and updates its position to occupy the full screen.
   * * * * @see MatDialogRef
   * * * @see MatDialogConfig
   * * * @usage
   * This method is typically called when the user clicks the full-screen button in the dialog header.
   * * @example
   * this.fullScreen(); 
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * Minimizes the dialog to a smaller size and positions it at the bottom right corner.
   * This method updates the dialog size and position to create a minimized view.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to minimize the dialog to a smaller size and position it at the bottom right corner.
   * It updates the dialog size and position to create a minimized view.
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
   * Maximizes the dialog to occupy the full screen.
   * This method updates the dialog size and position to create a maximized view.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to maximize the dialog to occupy the full screen.
   * It updates the dialog size and position to create a maximized view.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**
   * Exports the scheme data to a PDF file.
   * This method calls the `downloadReport` method of the `__Rpt` service to export the scheme data as a PDF.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to export the scheme data to a PDF file.
   * It calls the `downloadReport` method of the `__Rpt` service with the specified parameters to generate and download the PDF report.
   */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#scheme',
      {
        title: 'Scheme ',
      },
      'Scheme'
    );
  }

  /**
   * Handles the outside click event to hide the search results.
   * This method is called when an outside click occurs, and it hides the search results based on the provided mode.
   * @param {Event} __ev - The event object representing the outside click.
   * @param {string} mode - The mode indicating which search results to hide ('S' for subcategory, 'C' for category).
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called when an outside click occurs to hide the search results.
   * It updates the visibility of the search results based on the provided mode.
   */
  outsideClick(__ev, mode) {
    if (__ev) {
      this.searchResultVisibility('none', mode);
    }
  }
  /**
   * Handles the selection of items from the search results.
   * This method updates the form controls based on the selected item and hides the search results.
   * @param {any} __items - The selected item from the search results.
   * @param {string} __type - The type of item ('S' for subcategory, 'C' for category).
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called when an item is selected from the search results.
   * It updates the form controls with the selected item's values and hides the search results based on the provided type.
   */
  getItems(__items, __type) {
    switch (__type) {
      case 'S':
        this.__scmForm.controls['subcat_id'].setValue(__items.id);
        this.__scmForm.controls['subcat_name'].reset(__items.subcategory_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'S');
        break;
      case 'C':
        this.__scmForm.controls['cat_id'].setValue(__items.id);
        this.__scmForm.controls['cat_name'].reset(__items.cat_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'C');
        break;
      default:
        break;
    }
  }
  /**
   * Sets the visibility of the search results based on the provided display mode and type.
   * This method updates the display style of the search subcategory or category elements based on the provided type.
   * @param {string} display_mode - The display mode to set for the search results ('block' or 'none').
   * @param {string} __type - The type of search results ('S' for subcategory, 'C' for category).
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to set the visibility of the search results based on the provided display mode and type.
   */
  searchResultVisibility(display_mode, __type) {
    switch (__type) {
      case 'S':
        this.searchsubcat.nativeElement.style.display = display_mode;
        break;
      case 'C':
        this.__searchCat.nativeElement.style.display = display_mode;
        break;
    }
  }
  /**
   * Sorts the scheme data based on the provided sorting parameters.
   * This method updates the sorting order and direction and retrieves the scheme master data accordingly.
   * @param {sort} sort - The sorting parameters containing the active field and direction.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to sort the scheme data based on the provided sorting parameters.
   * It updates the `__sortAscOrDsc` property with the new sorting order and direction, and then calls the `getSchemeMst` method to fetch the sorted scheme data.
   */
  sortData(sort) {
    this.__sortAscOrDsc = sort;
    this.getSchemeMst(sort.active, sort.direction);
  }
  /**
   * Deletes a scheme from the list.
   * This method opens a confirmation dialog to delete the selected scheme and updates the data source accordingly.
   * @param {any} __el - The scheme element to be deleted.
   * @param {number} index - The index of the scheme in the data source.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to delete a scheme from the list.
   * It opens a confirmation dialog and, if confirmed, removes the scheme from the data source and updates the table.
   */
  delete(__el, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'alertdialog';
    dialogConfig.data = {
      flag: 'S',
      id: __el.id,
      title: 'Delete ' + __el.scheme_name,
      api_name: '/schemeDelete',
    };
    const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt.suc == 1) {
          this.__selectScm.data.splice(index, 1);
          this.__selectScm._updateChangeSubscription();
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
   * Converts SIP dates from the provided string to a JSON object.
   * This method is currently commented out and does not perform any operations.
   * @param {string} __sipDt - The SIP date string to be converted.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to convert SIP dates from the provided string to a JSON object.
   */
  convertSIPDates(__sipDt) {
    //  return JSON.parse(__sipDt);
  }
  /**
   * Handles the item click event to refresh or advance the filter.
   * This method is called when an item is clicked in the table, and it triggers the `refreshOrAdvanceFlt` method.
   * @param {Event} ev - The click event object.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called when an item is clicked in the table.
   * It triggers the `refreshOrAdvanceFlt` method to refresh or advance the filter based on the selected option.
   */
  onItemClick(ev) {
    this.refreshOrAdvanceFlt();
  }
  /**
   * Custom sorting function for the scheme table.
   * This method updates the sorting field and order based on the event and retrieves the scheme master data.
   * @param {any} ev - The event object containing the sort field and order.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to perform custom sorting on the scheme table.
   * It updates the `sort` property with the new field and order, and then calls the `getSchemeMst` method to fetch the sorted scheme data.
   */
  customSort(ev) {
    if(ev.sortField != 'edit' && ev.sortField!= 'delete'){
      this.sort.field = ev.sortField;
      this.sort.order = ev.sortOrder;
      this.getSchemeMst();
    }
  }
  /**
   * Handles the selection of an item from the scheme list.
   * This method is called when an item is selected, and it retrieves the scheme master data.
   * @param {Event} ev - The event object containing the selected item.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called when an item is selected from the scheme list.
   * It retrieves the scheme master data by calling the `getSchemeMst` method.
   */
  onselectItem(ev) {
    this.getSchemeMst();
  }
  /**
   * Retrieves the selected columns from the provided columns array.
   * This method filters out the 'edit' and 'delete' columns and updates the table width and exported columns.
   * @param {Array} columns - The array of column objects to be processed.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to retrieve the selected columns from the provided columns array.
   * It filters out the 'edit' and 'delete' columns, calculates the total width of the table, and updates the exported columns for CSV export.
   */
  getSelectedColumns(columns) {
    const clm = ['edit', 'delete'];
    console.log(columns);
    this.tableWidth = columns.map(el => el.width ? Number(el.width.split('rem')[0]) : 0).reduce(function (x, y) {return x + y;}, 0);
    this.__columns = columns.map(({ field, header,width }) => ({ field, header,width }));
    // console.log(this.__columns)
    this.__exportedClmns = this.__columns
      .filter((x: any) => !clm.includes(x.field))
      .map((item) => {
        return item['field'];
      });
  }
  /**
   * Handles the selection of an item from the parent component.
   * This method updates the form controls with the selected item's ID and name, and hides the search scheme.
   * @param {Event} ev - The event object containing the selected item.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called when an item is selected from the parent component.
   * It updates the `alt_scheme_id` and `alt_scheme_name` form controls with the selected item's values and hides the search scheme.
   */
  getSelectedItemsFromParent = (ev) => {
    this.__scmForm.controls['alt_scheme_id'].setValue(ev.item.id);
    this.__scmForm.controls['alt_scheme_name'].reset(ev.item.scheme_name, {
      emitEvent: false,
    });
    this.searchSchemeVisibility('none');
  };

  /**
   * Exports the scheme data to a CSV file.
   * This method processes the selected scheme data and downloads it as a CSV file.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to export the scheme data to a CSV file.
   * It processes the selected scheme data, refines it, and downloads it as a CSV file.
   */
  /*** Addition Later */
  exportCsv = () =>{
    const refinedData = []
    const props =  this.__columns.filter(el => el.field != 'edit' && el.field != 'delete');
    const dt = this.__selectScm.data.map((value,index) => {
            let obj = {};
            props.forEach((el) =>{
                if(el.header == 'SIP Dates' || el.header == 'STP Dates' || el.header == 'SWP Dates'){
                  obj ={...obj,
                    [el.header]: this.getModifiedValueFromArr(el.field,value[el.field])
                  }
                }
                else{
                  obj ={...obj,
                    [el.header]: this.getModifiedValueFromArr(el.field,value[el.field])
                  }
                }
              
            })
            if(index == 0){
              refinedData.push(Object.keys(obj))
            }
            refinedData.push(Object.values(obj))
            return obj;
      });
      console.log(refinedData)
      this.downloadCsv(refinedData)
  }
  /***End */

  /**
   * Retrieves the modified value from the provided array based on the field type.
   * This method processes the values based on the field type and returns a formatted string.
   * @param {string} field - The field name to determine how to process the values.
   * @param {any} values - The values to be processed based on the field type.
   * @return {string} - The modified value as a string.
   * @memberof ScmRptComponent
   * @description This method is called to retrieve the modified value from the provided array based on the field type.
   * It processes the values based on the field type and returns a formatted string.
   */
  getModifiedValueFromArr =  (field,values) =>{
        switch(field){
          case 'sip_date':
          case 'stp_date':
          case 'swp_date': 
          // console.log(values); 
          return values ? JSON.parse(values).map(el => el.date).join('/') : 'N/A';
          // break;
          // case 'scheme_type': return values == 'O' ? 'Ongoing' : "NFO"
          default: 
          // console.log(values);
          return values ? values?.toString()?.replace(',','.') : 'N/A'
        }
  }

  /**
   * Downloads the provided data as a CSV file.
   * This method processes the data and creates a CSV file for download.
   * @param {Array} data - The data to be downloaded as a CSV file.
   * @return {void}
   * @memberof ScmRptComponent
   * @description This method is called to download the provided data as a CSV file.
   * It processes the data, creates a CSV content string, and triggers the download of the CSV file.
   */
  downloadCsv = (data) =>{
    try{
      let csvContent = ''
      data.forEach(row => {
        csvContent += row.join(',') + '\n'
      })
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
      const objUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objUrl;
      link.download = 'scheme.csv';
      link.click();
    }
    catch(err){
        console.log(err)
    }

  }
}
