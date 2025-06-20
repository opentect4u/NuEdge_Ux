import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { SiptypemodificationComponent } from '../sipTypeModification/sipTypeModification.component';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { responseDT } from 'src/app/__Model/__responseDT';
import { column } from 'src/app/__Model/tblClmns';
import { sipTypeClmns } from 'src/app/__Utility/Master/trans';
import { Table } from 'primeng/table';
@Component({
  selector: 'sipTypeRpt-component',
  templateUrl: './sipTypeRpt.component.html',
  styleUrls: ['./sipTypeRpt.component.css'],
})
export class SiptyperptComponent implements OnInit {

  formValue;
  itemsPerPage=ItemsPerPage;
  sort=new sort();
  __trnsType = new FormGroup({
    sip_type_name: new FormControl(''),
  });
  __export = new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = sipTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'sip_type_name'];
  __paginate: any = [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  @ViewChild('dt') primeTbl :Table;

  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<SiptyperptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.formValue = this.__trnsType.value;
    this.getSIPTypeMst();
  }

  /*
    * This function is used to fetch the SIP Type Master data from the server.
    * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
    * @returns void
    * @memberof SiptyperptComponent
    * @description
    * This function is responsible for fetching the SIP Type Master data from the server.
    * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
    * @example
    *  // Usage: Call this function to get the SIP Type Master data.
    * * @returns {void}
    * @memberof SiptyperptComponent
    * @description
    * This function is responsible for fetching the SIP Type Master data from the server.
    * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
    * * @example
    * // Usage: Call this function to get the SIP Type Master data.
    * * @returns {void}
    * @memberof SiptyperptComponent
    * @description
    * This function is responsible for fetching the SIP Type Master data from the server.
    * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
    * * @example
    * // Usage: Call this function to get the SIP Type Master data.
    * * @returns {void}
    * @memberof SiptyperptComponent
    * @description
    *   
    * This function is responsible for fetching the SIP Type Master data from the server.
    * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
    * * @example
    * // Usage: Call this function to get the SIP Type Master data.
    */
  getSIPTypeMst() {
    const __SIPTypeSearch = new FormData();
    __SIPTypeSearch.append('sip_type_name',this.formValue?.sip_type_name);
    __SIPTypeSearch.append('paginate', this.__pageNumber.value);
    __SIPTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __SIPTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/sipTypeSearch', __SIPTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        // this.__paginate = res.links;
        // this.setPaginator(res.data);
        this.setPaginator(res);
        this.tableExport(__SIPTypeSearch);
      });
  }

  /**
   * 
   * @param $event - The event object that contains the value to filter the global search.
   * @description
   * This function is used to filter the global search in the SIP Type table.
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  /**   * 
   * @returns {column[]} - Returns the columns for the SIP Type table.
   * @description
   * This function is used to get the columns for the SIP Type table.
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }

  /**   * 
   * @param __SIPTypeExport - The FormData object containing the parameters for exporting SIP Type data.
   * @description
   * This function is used to export the SIP Type data based on the provided parameters.
   */
  tableExport(
    __SIPTypeExport
  ) {
    __SIPTypeExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/sipTypeExport', __SIPTypeExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  /**   * 
   * @param __paginate - The pagination value to be used for fetching the SIP Type Master data.
   * @description
   * This function is used to get the SIP Type Master data with pagination.
   */
  getTrnsTypeMst(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/sipType', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }

  /**   * 
   * @param __res - The response data to be set in the paginator.
   * @description
   * This function is used to set the paginator with the provided response data.
   */
  private setPaginator(__res) {
    this.__selecttrnsType = new MatTableDataSource(__res);
  }
  /**  * 
   * @param __paginate - The pagination object containing the URL for fetching paginated data.
   * @description
   * This function is used to get paginated data based on the provided pagination object.
   * It checks if the URL is present in the pagination object and makes an API call to fetch the data.
   * @param {any} __paginate - The pagination object containing the URL for fetching paginated data.
   * @return {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is used to get paginated data based on the provided pagination object.
   * It checks if the URL is present in the pagination object and makes an API call to fetch the data.
   * @example
   * // Usage: Call this function with the pagination object to fetch paginated data.
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&sip_type_name=' + this.formValue?.sip_type_name) +
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
  /**   * 
   * @param __items - The item to be populated in the dialog.
   * @description
   * This function is used to open a dialog for adding or updating a SIP Type.
   * It takes an item as a parameter and passes it to the dialog component.
   * @param {any} __items - The item to be populated in the dialog.
   * @return {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is used to open a dialog for adding or updating a SIP Type.
   * It takes an item as a parameter and passes it to the dialog component.
   * @example
   * // Usage: Call this function with the item to open the dialog.
   */
  populateDT(__items: any) {
    this.openDialog(__items.id, __items);
  }
  /**   * 
   * @param {number} id - The ID of the SIP Type to be added or updated.
   * @param {any} __items - Additional items to be passed to the dialog.
   * @description
   * This function is used to open a dialog for adding or updating a SIP Type.
   * It creates a MatDialogConfig object, sets various properties for the dialog,
   * and opens the SiptypemodificationComponent dialog with the provided configuration.
   * * @returns {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for opening a dialog for adding or updating a SIP Type.
   * It creates a MatDialogConfig object, sets various properties for the dialog,
   * and opens the SiptypemodificationComponent dialog with the provided configuration.
   * * @example
   * // Usage: Call this function to open the dialog for adding or updating a SIP Type.
   *  
   * * @param {number} id - The ID of the SIP Type to be added or updated.
   * @param {any} __items - Additional items to be passed to the dialog.
   * * @returns {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for opening a dialog for adding or updating a SIP Type.
   * It creates a MatDialogConfig object, sets various properties for the dialog,
   * and opens the SiptypemodificationComponent dialog with the provided configuration.
   */
  openDialog(id, __items) {
    // console.log(__items);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SIP',
      id: id,
      title: id == 0 ? 'Add Sip Type' : 'Update Sip Type',
      items: __items,
      product_id: this.data.prodcut_id,
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        SiptypemodificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.addRow(dt.data);
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      // console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SIP',
      });
    }
  }
  /**   * 
   * @description
   * This function is used to toggle the visibility of the dialog.
   * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
   * It also updates the position of the dialog to the top of the screen.
   * * @returns {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for toggling the visibility of the dialog.
   * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
   * It also updates the position of the dialog to the top of the screen.
   * * @example
   * // Usage: Call this function to toggle the visibility of the dialog.
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**   * 
   * @description
   * This function is used to minimize the dialog.
   *  It removes the 'mat_dialog' and 'full_screen' panel classes from the dialog reference,
   * and updates the size and position of the dialog.
   * * @returns {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for minimizing the dialog.
   * It removes the 'mat_dialog' and 'full_screen' panel classes from the dialog reference,
   * and updates the size and position of the dialog.
   * * @example
   * // Usage: Call this function to minimize the dialog.
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
  /**   * 
   * @description
   * This function is used to maximize the dialog.
   * It removes the 'full_screen' panel class and adds the 'mat_dialog' panel class to the dialog reference.
   * It also updates the position of the dialog to the top of the screen.
   * * @returns {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for maximizing the dialog.
   *  It removes the 'full_screen' panel class and adds the 'mat_dialog' panel class to the dialog reference.
   * It also updates the position of the dialog to the top of the screen.
   * * @example
   * // Usage: Call this function to maximize the dialog.
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**   *
   * This function is used to export the SIP Type data as a PDF file.
   * It calls the downloadReport method of the RPTService with the appropriate parameters.
   * * @returns void
   * @memberof SiptyperptComponent
   * @description 
   * This function is responsible for exporting the SIP Type data as a PDF file.
   * It calls the downloadReport method of the RPTService with the appropriate parameters.
   * * @example
   * // Usage: Call this function to export the SIP Type data as a PDF file.
   * @returns {void}
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for exporting the SIP Type data as a PDF file.
   * 
   * It calls the downloadReport method of the RPTService with the appropriate parameters.
   * * @example
   * // Usage: Call this function to export the SIP Type data as a PDF file.
   */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#SipType',
      {
        title: 'SIP Type - ' + new Date().toLocaleDateString(),
      },
      'SIP Type',
      'p'
    );
  }
  /**
   * * This function is used to submit the form and fetch the SIP Type Master data.
   * It retrieves the value from the form control and calls the getSIPTypeMst method to fetch the data.
   * @returns void
   * @memberof SiptyperptComponent  
   */
  submit() {
    this.formValue = this.__trnsType.value;
    this.getSIPTypeMst();
  }
  private updateRow(row_obj: any) {
    this.__selecttrnsType.data = this.__selecttrnsType.data.filter(
      (value: any, key) => {
        if (value.id == row_obj.id) {
          value.sip_type_name = row_obj.sip_type_name;
        }
        return true;
      }
    );
    this.__export.data = this.__export.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.sip_type_name = row_obj.sip_type_name;
      }
      return true;
    });
  }
  /**
   * 
   * @param row_obj - The SIP Type object to be added to the master table.
   * @description
   * This function is used to add a new row to the SIP Type master table.
   * It takes a SIP Type object as a parameter and adds it to both the __selecttrnsType and __export data sources.
   * * @returns void
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for adding a new row to the SIP Type master table.
   */
  addRow(row_obj) {
    this.__selecttrnsType.data.unshift(row_obj);
    this.__export.data.unshift(row_obj);
    this.__export._updateChangeSubscription();
    this.__selecttrnsType._updateChangeSubscription();
  }
  /**
   * 
   * @param __el - The SIP Type object to be deleted from the master table.
   * @description
   * This function is used to delete a SIP Type from the master table.
   * It opens a confirmation dialog and, upon confirmation, removes the SIP Type from both the __selecttrnsType and __export data sources.
   * @param index 
   * @returns void
   * @memberof SiptyperptComponent
   * @description
   */
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'ST',
        id: __el.id,
        title: 'Delete '  + __el.sip_type_name,
        api_name:'/sipTypeDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selecttrnsType.data.splice(index,1);
            this.__selecttrnsType._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
  }
  /**
   * 
   * @param ev - The event object containing the sort field and order.
   * @description
   * This function is used to handle the custom sorting of the SIP Type master table.
   * It updates the sort field and order based on the event object and calls the getSIPTypeMst method to fetch the sorted data.
   * @returns void
   * @memberof SiptyperptComponent
   * @description
   * This function is responsible for handling the custom sorting of the SIP Type master table.
   * It updates the sort field and order based on the event object and calls the getSIPTypeMst method to fetch the sorted data.
   * * @example
   * // Usage: Call this function when the user interacts with the sorting feature of the SIP Type master table.
   * @param {any} ev - The event object containing the sort field and order.
   */
  customSort(ev){
    if(ev.sortField!= 'edit' && ev.sortField != 'delete'){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.getSIPTypeMst();
  }
  }
  /**
   * * This function is used to handle the selection of an item in the SIP Type master table.
   * It calls the getSIPTypeMst method to fetch the updated data based on the selected item.
   * @returns void
   * @param ev 
   */
  onselectItem(ev){
    this.getSIPTypeMst();
  }
}
