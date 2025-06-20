import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { option } from 'src/app/__Model/option';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { OptionModificationComponent } from '../optionModification/optionModification.component';
import * as XLSX from 'xlsx';
import { sort } from 'src/app/__Model/sort';
import ItemPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { column } from 'src/app/__Model/tblClmns';
import { optClmns } from 'src/app/__Utility/Master/optionClmns';
import { Table } from 'primeng/table';
@Component({
  selector: 'optRpt-component',
  templateUrl: './optRpt.component.html',
  styleUrls: ['./optRpt.component.css'],
})
export class OptrptComponent implements OnInit {

  /**
   * Holfing form data after submit form
   */
  formValue;

  itemsPerPage= ItemPerPage
  sort = new sort();
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    option: new FormControl(''),
    options: new FormControl('2'),
  });
  __export = new MatTableDataSource<option>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = optClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'opt_name'];
  __paginate: any = [];
  __selectOption = new MatTableDataSource<option>([]);
  __isVisible: boolean = true;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<OptrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  @ViewChild('dt') primeTbl :Table;

  ngOnInit() {
    this.formValue = this.__catForm.value;
    this.getoptionMst();
  }
  /**
   * * This function is used to fetch the option master data from the server.
   * * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
   * * The response is then processed to set the paginator and export the data. 
   * * @returns void
   * * @memberof OptrptComponent
   * * @description
   * * This function is responsible for fetching the option master data based on the form values and pagination settings.
   * * It uses the DbIntrService to make an API call and processes the response to update the table data and export options.
   */
  getoptionMst() {
    const __optionSrch = new FormData();
    __optionSrch.append('option', this.formValue?.option);
    __optionSrch.append('paginate', this.__pageNumber.value);
    __optionSrch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __optionSrch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/optionDetailSearch', __optionSrch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        // this.__paginate = res.links;
        // this.setPaginator(res.data);
        this.setPaginator(res);
        this.tableExport(__optionSrch);
      });
  }
  /**
   *  * This function is used to get the columns for the option report table.
   *  * It utilizes the utility service to retrieve the columns based on the predefined column structure.
   *  * @function getColumns
   * @returns Array<column>
   * * @memberof OptrptComponent
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }
  /**
   * * * This function is used to filter the global search in the option report table.
   * * * It takes the event as an argument, retrieves the value from the event target,
   * * * and applies the filter to the prime table.
   * * * @function filterGlobal 
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  /**
   *  * This function is used to export the option data to a file.
   *  * It removes the pagination parameter from the search options and makes an API call to export the data.
   *  * The response is then processed to set the export data source.
   * @param __optionSrch 
   */
  tableExport(__optionSrch) {
    __optionSrch.delete('paginate');
    this.__dbIntr
      .api_call(1, '/optionExport', __optionSrch)
      .pipe(map((x: any) => x.data))
      .subscribe((res: option[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  /**
   *  * This function is used to set the paginator for the option report table.
   *  * It takes the response data as an argument and initializes the MatTableDataSource with the data.
   *  * @function setPaginator    
   * @param __res 
   * * @memberof OptrptComponent
   * * @description
   * * This function is responsible for setting the paginator for the option report table.
   * * It initializes the MatTableDataSource with the provided response data, allowing for pagination and sorting of the table. 
   */
  private setPaginator(__res) {
    this.__selectOption = new MatTableDataSource(__res);
  }
  /**
   *  * This function is used to get the pagination data for the option report table.
   *  * It takes the pagination object as an argument and makes an API call to retrieve the pagination data.
   *  * The response is then processed to set the paginator and update the pagination links.
   * @function getPaginate  
   * @param __paginate 
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&option=' + this.formValue?.option) +
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
   *  * This function is used to populate the option report table with the provided items.
   *  * It opens a dialog for adding or updating the option based on the provided items.
   *  * @function populateDT
   *  * @memberof OptrptComponent
   * @param __items 
   */
  populateDT(__items: option) {
    this.openDialog(__items, __items.id);
  }

  /**
   *  * This function is used to open a dialog for adding or updating an option.
   *  * It creates a MatDialogConfig object, sets various properties for the dialog,
   *  * and opens the OptionModificationComponent dialog with the provided configuration. 
   * @param __category 
   * @param __catId 
   */
  openDialog(__category: option | null = null, __catId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'O',
      id: __catId,
      items: __category,
      title: __catId == 0 ? 'Add Option' : 'Update Option',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        OptionModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectOption.data.unshift(dt.data);
            this.__selectOption._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'O',
      });
    }
  }
  /**
   *  * This function is used to update a row in the option report table.
   *  * It filters the existing data in the __selectOption and __export data sources,
   *  * and updates the opt_name of the row object with the provided row_obj. 
   * * @function updateRow
   * * @memberof OptrptComponent
   * * @description
   * @param row_obj 
   */
  private updateRow(row_obj: option) {
    this.__selectOption.data = this.__selectOption.data.filter(
      (value: option, key) => {
        if (value.id == row_obj.id) {
          value.opt_name = row_obj.opt_name;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: option, key) => {
      if (value.id == row_obj.id) {
        value.opt_name = row_obj.opt_name;
      }
      return true;
    });
  }
  /**
   * * This function is used to toggle the full screen mode of the dialog.  
   * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialogRef.
   * * * It also updates the position of the dialogRef to the top of the screen.
   * * @function fullScreen
   * * @memberof OptrptComponent
   *  
   * * This function is responsible for toggling the full screen mode of the dialog.
   * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialogRef.
   * * It also updates the position of the dialogRef to the top of the screen.
   * * @description
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   *  * This function is used to minimize the dialog.
   *  * It removes the 'mat_dialog' and 'full_screen' panel classes from the dialogRef,
   *  * updates the size of the dialogRef to '40%' width and '55px' height, 
   * *  * and updates the position of the dialogRef to the bottom right corner of the screen.
   * *  * @function minimize
   * *  * @memberof OptrptComponent
   * * * @description
   * *  * This function is responsible for minimizing the dialog by removing the 'mat_dialog' and 'full_screen' panel classes,
   * *  * updating the size to '40%' width and '55px' height, and positioning it at the bottom right corner of the screen.
   */
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  /**
   * 
   * * This function is used to maximize the dialog.  
   * * It removes the 'full_screen' panel class and adds the 'mat_dialog' panel class to the dialogRef.
   * * It also updates the position of the dialogRef to the top of the screen.
   * * @function maximize
   * * @memberof OptrptComponent
   * * @description
   * * This function is responsible for maximizing the dialog by removing the 'full_screen' panel class,
   * * adding the 'mat_dialog' panel class, and updating the position of the dialogRef to the top of the screen.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**
   * * This function is used to export the option report as a PDF file.
   * * It calls the downloadReport method of the RPTService with the appropriate parameters.
   * * @function exportPdf
   */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#Option',
      {
        title: 'Option - '+ new Date().toLocaleDateString(),
      },
      'Option',
      'p'
    );
  }
  /**
   * * * This function is used to submit the form data for the option report.
   * * * It retrieves the values from the form and calls the getoptionMst method to fetch the option master data.
   * * * @function submit 
   * * * @memberof OptrptComponent
   * * * @description
   * * * This function is responsible for submitting the form data for the option report.
   * * * It retrieves the values from the form and calls the getoptionMst method to fetch the option master data based on the submitted values.
   * * * @returns void
   */
  submit() {
    this.formValue = this.__catForm.value;
    this.getoptionMst();
  }
  /**
   *  * This function is used to delete an option from the option report table. 
   *  * It opens a confirmation dialog to confirm the deletion and then makes an API call to delete the option.
   * *  * If the deletion is successful, it removes the option from both the __selectOption and __export data sources.
   * * * @function delete
   * * * @memberof OptrptComponent
   * * * @description
   * * * This function is responsible for deleting an option from the option report table.
   * * * It opens a confirmation dialog to confirm the deletion and then makes an API call to delete the option.
   * * * If the deletion is successful, it removes the option from both the __selectOption and __export data sources.
   * * * @param __el  
   * * * @param index
   * * * @returns void
   */
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'O',
        id: __el.id,
        title: 'Delete '  + __el.opt_name,
        api_name:'/optionDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selectOption.data.splice(index,1);
            this.__selectOption._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
  }
  /**
   * * * This function is used to export the option report table data to an Excel file.
   * * * It retrieves the table element by its ID, converts it to a workbook using the XLSX library,
   * * * and then writes the workbook to a file named 'option.xlsx'.
   * * * @function exportTbl  
   *  * * @memberof OptrptComponent
   * * * @description
   * * * This function is responsible for exporting the option report table data to an Excel file.
   */
  exportTbl(){
    // let { sheetName, fileName } = getFileName(name);
    let targetTableElm = document.getElementById('Option');
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: 'AMC'
    });
    XLSX.writeFile(wb, `option.xlsx`,{cellStyles:true});
  }
  /**
   *  * This function is used to handle the custom sorting of the option report table.
   *  * It checks if the sort field is not 'edit' or 'delete',  
   *  *  * and if so, it updates the sort object with the sort field and order,
   *  *  * and then calls the getoptionMst method to fetch the sorted option master data.
   *  * * @function customSort
   *  * * @memberof OptrptComponent
   *  * * @description
   *  *  * This function is responsible for handling the custom sorting of the option report table.
   *  *  * It checks if the sort field is not 'edit' or 'delete', and if so, it updates the sort object with the sort field and order,
   *  *  * and then calls the getoptionMst method to fetch the sorted option master data.
   *  *  * @param ev - The event object containing the sort field and order.
   */
  customSort(ev){
    if(ev.sortField != 'edit' && ev.sortField != 'delete'){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.getoptionMst();
    }
  }
  /**
   *  * This function is used to handle the selection of an item in the option report table.
   *  * It calls the getoptionMst method to fetch the updated option master data
   *  * * @function onselectItem
   *  * @memberof OptrptComponent
   *  * @description
   *  * This function is responsible for handling the selection of an item in the option report table.
   */
  onselectItem(ev){
    this.getoptionMst();
  }
}
