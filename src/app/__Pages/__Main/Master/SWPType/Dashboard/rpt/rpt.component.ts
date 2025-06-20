import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit , Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ManualEntryComponent } from '../manual-entry/manual-entry.component';
import ItemsPerPage from '../../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { column } from 'src/app/__Model/tblClmns';
import { swpTypeClmns } from 'src/app/__Utility/Master/trans';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RptComponent implements OnInit {

  formValue;
  itemsPerPage=ItemsPerPage;
  sort=new sort();
  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __SwpType = new FormGroup({
    swp_type_name: new FormControl(''),
  });
  __export = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = swpTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'swp_type_name'];
  __paginate: any = [];
  __selecSwpType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  @ViewChild('dt') primeTbl :Table;

  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) { }
  ngOnInit(): void {
    this.formValue = this.__SwpType.value;
    this.getSWPTypeMst();
  }
  /**
   * * This function is used to toggle the full screen mode of the dialog.
   * * @returns void
   * * @memberof RptComponent
   *  
   * * @description
   * * This function is responsible for toggling the full screen mode of the dialog.
   * * It updates the panel classes and position of the dialog based on the current visibility state.
   * * @example
   * * // Usage: Call this function when the user clicks the full screen button on the dialog.
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * This function is used to minimize the dialog.
   * * * @returns void
   * * * @memberof RptComponent
   *    * * @description
   * * * This function is responsible for minimizing the dialog by updating its size and position.
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
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof RptComponent
   * * * @description
   * * * This function is responsible for maximizing the dialog by updating its panel classes and position.
   * * * @example
   * * * // Usage: Call this function when the user clicks the maximize button on the dialog.
   *  
   * * * @returns {void}
   * * * @memberof RptComponent
   *  
   * * * @description
   * * * This function is responsible for maximizing the dialog by updating its panel classes and position.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * * This function is used to submit the SWP Type form data.
   * * * @returns void
   * * * @memberof RptComponent
   * * * @description
   *  
   * * * This function is responsible for submitting the SWP Type form data and fetching the SWP Type master data.
   * * * It retrieves the form values, calls the getSWPTypeMst function with the specified sorting parameters,
   * * * and updates the displayed SWP Type data accordingly.
   * * * @example
   *  * * // Usage: Call this function when the user clicks the submit button on the SWP Type form.
   * * * @returns {void}
   * * * @memberof RptComponent
   */
  submit(){
    this.formValue = this.__SwpType.value;
     this.getSWPTypeMst(
      this.__sortColumnsAscOrDsc.active,
      this.__sortColumnsAscOrDsc.direction ? this.__sortColumnsAscOrDsc.direction : 'asc'
     )
  }

  /**
   * 
   * @param $event - The event triggered by the global filter input.
   * @description
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  /**
   * 
   * @returns {column[]} - Returns the columns for the SWP Type table.
   * @description
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }
  /**
   * 
   * @param column_name - The name of the column to sort by.
   * @param sort_by 
   */
  getSWPTypeMst(column_name: string | null = '',sort_by: string | null | '' = 'asc') {
    const __SWPTypeSearch = new FormData();
    __SWPTypeSearch.append('swp_type_name',this.formValue?.swp_type_name);
    __SWPTypeSearch.append('paginate', this.__pageNumber.value);
    __SWPTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __SWPTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/swpTypeSearch', __SWPTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.setPaginator(res);
        this.tableExport(__SWPTypeSearch);
      });
  }

  /**
   * 
   * @param __SWPTypeExport - The FormData object containing the SWP Type export data.
   * * @description
   * * This function is responsible for exporting the SWP Type data to a file.
   * * It removes the 'paginate' field from the FormData object and makes an API call to the '/swpTypeExport' endpoint.
   * * * The response data is then assigned to the __export MatTableDataSource object for display.
   * * @example
   * * // Usage: Call this function when the user clicks the export button on the SWP Type page.
   * * @returns {void}
   */
  tableExport(__SWPTypeExport: FormData){
    __SWPTypeExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/swpTypeExport', __SWPTypeExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  /**
   * 
   * @param res - The response data from the SWP Type search API call.
   * * @description
   * * This function is responsible for setting the paginator data for the SWP Type table.
   */
  setPaginator(res){
     this.__selecSwpType = new MatTableDataSource(res);
    //  this.__paginate = res.links;
  }
  /**
   * 
   * @param __paginate - The pagination object containing the URL for fetching paginated data.
   * * @description
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&swp_type_name=' + this.formValue?.swp_type_name) +
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
   * 
   * @param row_obj - The object containing the updated SWP Type data.
   */
  updateRow(row_obj){

    this.__selecSwpType.data = this.__selecSwpType.data.filter((value , key) => {
      if (value.id == row_obj.id) {
        value.swp_type_name = row_obj.swp_type_name;
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value , key) => {
      if (value.id == row_obj.id) {
        value.swp_type_name = row_obj.swp_type_name;
      }
      return true;
    });
}
/**
 * 
 * @param el - The object containing the SWP Type data to be populated in the dialog.
 * * @description
 * * This function is responsible for opening a dialog to populate the SWP Type data.
 * * It creates a MatDialogConfig object, sets various properties for the dialog,
 * * and opens the ManualEntryComponent dialog with the provided configuration.
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
      flag:'SWP',
       id: el.id,
       title: 'Update SWP Type',
       items: el,
      product_id: this.data.product_id
    };
    dialogConfig.id = el.id;
    try {
      const dialogref = this.__dialog.open(
        ManualEntryComponent,
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
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SWP',
      });
    }
}
/**
 * 
 * @param ev - The event triggered by the custom sort action.
 * * @description
 * * This function is responsible for handling the custom sort action on the SWP Type table.
 * * It updates the sort field and order based on the event parameters and calls the getSWPTypeMst function to fetch the sorted data.
 */
customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField!='delete'){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  this.getSWPTypeMst();
}
}
/**
 * 
 * @param ev - The event triggered by the selection of an item in the SWP Type table.
 * * @description
 * * This function is responsible for handling the selection of an item in the SWP Type table.
 * * It calls the getSWPTypeMst function to fetch the updated SWP Type data based on the selected item.
 * * * @example
 * * * // Usage: Call this function when the user selects an item in the SWP Type table.
 * * * @returns {void}
 * * * @memberof RptComponent
 * */
onselectItem(ev){
  this.getSWPTypeMst();
}
/**
 * * * This function is used to export the SWP Type data as a PDF file.
 * * * @returns void
 * * * @memberof RptComponent
 * * * @description
 *  
 * * * This function is responsible for downloading the SWP Type report as a PDF file.
 * * * It calls the downloadReport method of the RPTService with the specified parameters.
 * * * @example
 * * * // Usage: Call this function when the user clicks the export button on the SWP Type page.
 */
exportPdf(){
  this.__Rpt.downloadReport(
    '#swpType',
    {
      title: 'SWP Type - ' + new Date().toLocaleDateString(),
    },
    'SWP Type',
    'p'
  );
}
}
