import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntrComponent } from '../manual-entr/manual-entr.component';
import ItemsPerPage from '../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { stpTypeClmns } from 'src/app/__Utility/Master/trans';
import { column } from 'src/app/__Model/tblClmns';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RPTComponent implements OnInit {
  formValue;
  itemsPerPage=ItemsPerPage;
  sort=new sort();
  __StpType = new FormGroup({
    stp_type_name: new FormControl(''),
  });
  __export = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = stpTypeClmns.COLUMN
  __exportedClmns: string[] = ['sl_no', 'stp_type_name'];
  __paginate: any = [];
  __selecStpType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  @ViewChild('dt') primeTbl :Table;

  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private utility: UtiliService
  ) { }
  ngOnInit(): void {
    this.formValue = this.__StpType.value;
    this.getSTPTypeMst();
  }
  /**
   * Toggles the visibility of the dialog panel between full screen and minimized state.
   * When in full screen, it removes the 'mat_dialog' class and adds 'full_screen' class,
   * updating the position to the top of the viewport.
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * Minimizes the dialog panel by removing the 'mat_dialog' and 'full_screen' classes,
   * updating the size to '40%' width and '47px' height,
   * and positioning it at the bottom right corner of the viewport.
   * @param {void}
   * @return {void}
   * @memberof RPTComponent
   * @description
   * This function is responsible for minimizing the dialog panel to a smaller size and repositioning it.
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
   * Maximizes the dialog panel by removing the 'full_screen' class,
   * adding the 'mat_dialog' class, and updating the position to the top of the viewport.
   * @returns {void}
   * @memberof RPTComponent
   * @description
   * This function is responsible for maximizing the dialog panel to its full size.
   * It removes the 'full_screen' class, adds the 'mat_dialog' class,
   * and updates the position to the top of the viewport.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * Submits the form and retrieves the STP Type Master data based on the form values.
   * This function collects the values from the form controls,
   * appends them to a FormData object,
   * and calls the `getSTPTypeMst` method to fetch the data.
   * * @returns {void}
   * @memberof RPTComponent
   * @description
   */
  submit(){
    this.formValue = this.__StpType.value;
     this.getSTPTypeMst()
  }
  /**
   * Retrieves the STP Type Master data from the server.
   * This function creates a FormData object with the form values,
   * appends pagination and sorting parameters, 
   * and makes an API call to fetch the STP Type data.
   * * @returns {void}
   * @memberof RPTComponent
   * @description
   * This function is responsible for fetching the STP Type Master data from the server.
   * It constructs a FormData object with the necessary parameters,
   * including the STP type name, pagination, and sorting options.
   * It then makes an API call to the server to retrieve the data,
   * and processes the response to set the paginator and export data.
   * @example
   * // Usage: Call this function to fetch the STP Type Master data based on the form values.
   * @see {@link getPaginate} for handling pagination.
   * @see {@link tableExport} for exporting the data.
   */
  getSTPTypeMst() {
    const __STPTypeSearch = new FormData();
    __STPTypeSearch.append('stp_type_name',this.formValue?.stp_type_name);
    __STPTypeSearch.append('paginate', this.__pageNumber.value);
    __STPTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __STPTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/stpTypeSearch', __STPTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        // console.log(res);
        this.setPaginator(res);
        this.tableExport(__STPTypeSearch);
      });
  }

  /**
   * 
   * @param $event - The event object containing the target value for global filtering.
   * * This function filters the global data in the PrimeNG table based on the input value.
   * * It retrieves the value from the event target and applies a global filter to the table.
   * 
   * @returns {void}
   * @memberof RPTComponent
   * @description
   * This function is responsible for filtering the global data in the PrimeNG table.
   * It takes an event object as a parameter, retrieves the value from the event target,
   * and applies a global filter to the table using the 'contains' filter match mode.
   * * @example
   * // Usage: Call this function when the user types in the global filter input field.
   * @see {@link filterGlobal} for filtering the global data in the table.
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  /**
   * 
   * @returns {column[]} - Returns an array of column definitions for the table.
   * * This function retrieves the column definitions for the table from the utility service.
   * * It uses the `getColumns` method of the utility service to get the columns defined in the `__columns` property.
   * * @memberof RPTComponent
   * @description
   * This function is responsible for getting the column definitions for the table.
   */
  getColumns = () =>{
    return this.utility.getColumns(this.__columns);
  }

  /**
   * 
   * @param __STPTypeExport - The FormData object containing the STP Type data to be exported.
   * * This function exports the STP Type data to a table format.
   * * It removes the 'paginate' field from the FormData object,
   * and makes an API call to the server to retrieve the STP Type data for export.
   * * The response data is then set to the `__export` MatTableDataSource
   */
  tableExport(__STPTypeExport: FormData){
    __STPTypeExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/stpTypeExport', __STPTypeExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  /**
   *  * Sets the paginator for the STP Type data.
   * This function takes a response object, initializes the `__selecStpType`
   * @param res 
   */
  setPaginator(res){
     this.__selecStpType = new MatTableDataSource(res);
    //  console.log(this.__selecStpType);
    //  this.__paginate = res.links;
  }

  /**
   *  * Retrieves paginated data for the STP Type Master.
   * This function checks if the `__paginate` object has a URL,
   * and if so, it appends pagination and sorting parameters to the URL.
   * @param __paginate - The pagination object containing the URL for fetching paginated data.
   * 
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&stp_type_name=' + this.formValue?.stp_type_name) +
            ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.field : '') : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res);
        });
    }
  }
  /**
   *  * Opens a dialog to populate the STP Type data for editing.
   * This function creates a MatDialogConfig object,
   * sets various properties for the dialog,
   * and opens the ManualEntrComponent dialog with the provided configuration.
   * * @param {HTMLElement} el - The selected row element from the STP Type table.
   * * @returns {void}
   * * @memberof RPTComponent
   * @description
   *  
   * This function is responsible for opening a dialog to populate the STP Type data for editing.
   * It creates a MatDialogConfig object, sets various properties for the dialog,
   * and opens the ManualEntrComponent dialog with the provided configuration.
   * @param el - The selected row element from the STP Type table.
   */
  populateDT(el){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag:'STP',
       id: el.id,
       title: 'Update STP Type',
       items: el,
      product_id: this.data.product_id
    };
    dialogConfig.id = el.id;
    try {
      const dialogref = this.__dialog.open(
        ManualEntrComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          this.updateRow(dt.data);
        }

      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      console.log(ex);
      this.utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'STP',
      });
    }

  }
  /**
   *  
   * Updates the STP Type data in the table.
   * This function filters the `__selecStpType` data to find the row with the matching ID,
   * and updates the `stp_type_name` property of that row with the new value from `row_obj`.
   * * @param row_obj - The object containing the updated STP Type data.
   * * @returns {void}
   * * @memberof RPTComponent
   * * @description
   * This function is responsible for updating the STP Type data in the table.
   * It filters the `__selecStpType` data to find the row with the matching ID,
   * and updates the `stp_type_name` property of that row with the new value from `row_obj`.
   *  
   * @param row_obj - The object containing the updated STP Type data.
   * 
   */
  updateRow(row_obj){

      this.__selecStpType.data = this.__selecStpType.data.filter((value , key) => {
        if (value.id == row_obj.id) {
          value.stp_type_name = row_obj.stp_type_name;
        }
        return true;
      });
      this.__export.data = this.__export.data.filter((value , key) => {
        if (value.id == row_obj.id) {
          value.stp_type_name = row_obj.stp_type_name;
        }
        return true;
      });
  }
  /**
   *  * Custom sort function for the STP Type table.
   * This function updates the `sort` object with the selected sort field and order,
   * and calls the `getSTPTypeMst` method to retrieve the sorted data.
   *  
   *  
   * * @param ev - The event object containing the sort field and order.
   * * @returns {void}
   * @param ev - The event object containing the sort field and order.
   * 
   */
  customSort(ev){
    if(ev.sortField !='edit'){
      this.sort.field = ev.sortField;
      this.sort.order = ev.sortOrder;
      this.getSTPTypeMst();
    }
  }
  /**
   *  * Handles the selection of an item from the STP Type table.
   * This function retrieves the selected item from the event object,
   * and calls the `getSTPTypeMst` method to refresh the data.
   * * @param ev - The event object containing the selected item.
   * * @returns {void}
   * * @memberof RPTComponent
   * @param ev 
   */
  onselectItem(ev){
    // this.__pageNumber.setValue(ev.option.value);
    // this.submit();
    this.getSTPTypeMst();

  }
  /** * Exports the STP Type data to a PDF file.
 * This function calls the `downloadReport` method of the `__Rpt` service,
 * passing the selector for the STP Type table, report title, and report type.
 * */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#stpType',
      {
        title: 'STP Type - ' + new Date().toLocaleDateString(),
      },
      'STP Type',
      'p'
    );
  }
}
