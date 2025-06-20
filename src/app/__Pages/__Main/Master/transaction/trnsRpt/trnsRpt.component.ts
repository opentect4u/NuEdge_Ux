import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { TrnsModificationComponent } from '../trnsModification/trnsModification.component';
import { column } from 'src/app/__Model/tblClmns';
import { transClmns } from 'src/app/__Utility/Master/trans';
import { sort } from 'src/app/__Model/sort';
// import { TrnstypeModificationComponent } from '../trnstypeModification/trnstypeModification.component';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { Table } from 'primeng/table';
@Component({
selector: 'trnsRpt-component',
templateUrl: './trnsRpt.component.html',
styleUrls: ['./trnsRpt.component.css']
})
export class TrnsrptComponent implements OnInit {
  @ViewChild('dt') primeTbl :Table;
  formValue;
  itemsPerPage = ItemsPerPage
  sort =new sort();
  __trns_type: any=[];
  __trnsType = new FormGroup({
    trns_name: new FormControl(''),
    trans_type_id: new FormControl('')
  })
  __export =  new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = transClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'trns_type','trns_name'];
  __paginate: any= [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<TrnsrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.formValue = this.__trnsType.value;
  this.getTransactionTypeMst();
  this.getTransMst();
}

/**
 * * This function is used to fetch the transaction master data based on the provided filters and pagination.
 * * @returns void
 * * @memberof TrnsrptComponent
 * * @description
 * * This function is responsible for fetching the transaction master data from the server.
 * * It creates a FormData object, appends the necessary parameters such as pagination, product ID,
 * * field, order, transaction name, and transaction type ID, and then makes an API call to retrieve the data.
 * * The response is then processed to set the paginator and export the data.
 */
getTransMst(){
  const __tranSearch = new FormData();
  __tranSearch.append('paginate',this.__pageNumber.value);
  __tranSearch.append('product_id',this.data.product_id);
  __tranSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
  __tranSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
  __tranSearch.append('trns_name',this.formValue?.trns_name ? this.formValue?.trns_name : '');
  __tranSearch.append('trns_type_id',this.formValue?.trans_type_id ? this.formValue?.trans_type_id : '');
   this.__dbIntr.api_call(1,'/transctionSearch',__tranSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    // this.__paginate =res.links;
    // this.setPaginator(res.data);
    this.setPaginator(res);
     this.tableExport(__tranSearch);
   })
}

/**
 * * This function is used to filter the global search in the PrimeNG table.
 * * @param $event - The event object containing the search input value.
 * * @returns void
 * * @memberof TrnsrptComponent
 */
filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}
/**
 *  * This function is used to get the columns for the transaction report table.
 *  * It retrieves the columns from the utility service based on the predefined column configuration.
 *  * @function getColumns
 * @returns {column[]} - Returns the columns for the transaction report table.
 * * @memberof TrnsrptComponent
 * * @description
 */
getColumns = () =>{
  return this.__utility.getColumns(this.__columns);
}

/**
 * * This function is used to fetch the transaction type master data.
 * * It makes an API call to retrieve the transaction type data based on the product ID.
 * * The retrieved data is then stored in the __trns_type variable for further use.
 */
getTransactionTypeMst(){
  this.__dbIntr.api_call(0,'/transctiontype',
  'product_id=' + this.data.product_id).pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
   this.__trns_type = res;
  });
}

/**
 *  * This function is used to export the transaction data based on the provided filters.
 *  * It removes the 'paginate' parameter from the export data and makes an API call to retrieve the transaction export data.
 *  * The retrieved data is then stored in the __export variable for further use.
 */
tableExport(__trnsExport){
  __trnsExport.delete('paginate');
  this.__dbIntr.api_call(1,'/transctionExport',__trnsExport).pipe(map((x: any) => x.data)).subscribe((res: any[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}
/**
 *  * This function is used to get the transaction master data with pagination.
 *  * It makes an API call to retrieve the transaction data based on the provided pagination parameter
 * @param __paginate 
 */
getTrnsMst(__paginate: string | null = '10'){
  this.__dbIntr.api_call(0,'/transction',
  'paginate='+__paginate + '&product_id=' + this.data.product_id).pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
    this.setPaginator(res.data);
    this.__paginate = res.links;
  });
}

/**
 *  * This function is used to set the paginator for the transaction type data.
 * * It takes the response data as input and initializes the MatTableDataSource with the provided data.
 * * @function setPaginator
 *  * @memberof TrnsrptComponent
 *  * @description
 *  * This function is responsible for setting the paginator for the transaction type data.
 *  * It initializes the MatTableDataSource with the provided response data.
 *  * @param {any} __res - The response data to be set as the paginator.
 * @param __res 
 */
private setPaginator(__res) {
  this.__selecttrnsType = new MatTableDataSource(__res);
}

/**
 *  * This function is used to get the pagination data for the transaction report.
 *  * It makes an API call to retrieve the pagination data based on the provided URL and pagination parameters.
 *  * The retrieved data is then processed to set the paginator and update the __paginate variable.
 * @param __paginate 
 */
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&trns_name='+this.__trnsType.value.trns_name)
        + ('&trns_type_id='+this.__trnsType.value.trans_type_id)
        + ('&product_id='+this.data.product_id)
        + ('&order=' + (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete' ? this.sort.order : '') : '1')) +
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
 *  * This function is used to populate the dialog with the transaction details.
 * * It opens a dialog with the provided transaction ID and items.
 * * @function populateDT
 *  * @memberof TrnsrptComponent
 * * @description
 * * This function is responsible for populating the dialog with the transaction details.
 * * It opens a dialog with the provided transaction ID and items, allowing the user to view or modify the transaction details.
 * @param __items 
 */
populateDT(__items: any) {
  this.openDialog(__items.id, __items);
}
/**
 *  * This function is used to open a dialog for adding or updating a transaction.
 *  * It creates a MatDialogConfig object, sets various properties for the dialog,
 * @param id 
 * @param __items 
 */
openDialog(id, __items) {
  // console.log(__items);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '50%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.id = 'TRNS_'+id;
  dialogConfig.data = {
    flag : 'TRNS_'+id,
    id: id,
    title: id == 0 ? 'Add Transaction' : 'Update Transaction',
    items: __items,
    product_id:this.data.product_id
  };
  try{
    const dialogref = this.__dialog.open(TrnsModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
           this.updateRow(dt.data);
      }
      else{
        this.addRow(dt.data);
      }
    });
  }
  catch(ex){
    // console.log(ex);

    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.addPanelClass('mat_dialog');
    this.__utility.getmenuIconVisible({
      id: id,
      items: __items,
      flag:'TRNS_'+id
    });
  }

}
/**
 * * This function is used to toggle the visibility of the dialog.
 * * It adds or removes panel classes to change the dialog's appearance and updates its position.
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
 * * * It removes the 'mat_dialog' and 'full_screen' panel classes, updates the dialog size, and sets its position.
 * * * @returns void
 */
minimize(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.updateSize("40%",'47px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
/**
 * * * This function is used to maximize the dialog.
 * * * It removes the 'full_screen' panel class, adds the 'mat_dialog' panel class, and updates the dialog position.
 * * * It also toggles the visibility state of the dialog.
 * * * @returns void
 */
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

/**
 * * This function is used to export the transaction report as a PDF.
 * * It calls the downloadReport method of the RPTService with the specified parameters.
 */
exportPdf(){
  this.__Rpt.downloadReport('#trns',
  {
    title: 'Transaction - ' + new Date().toLocaleDateString()
  }, 'Transaction','portrait')
}
/**
 * * This function is used to submit the form and fetch the transaction master data based on the selected transaction type.
 * * It retrieves the value of the transaction type form control and calls the getTransMst method to fetch the data.
 * * @returns void
 */
submit(){
  this.formValue =this.__trnsType.value;
   this.getTransMst();
}
/**
 *  * This function is used to update a row in the transaction type and export data.
 *  * It filters the data in both __selecttrnsType and __export data sources to find the row with the matching ID,
 *  * and updates the transaction type and name for that row.
 * @param row_obj 
 */
private updateRow(row_obj: any) {
  this.__selecttrnsType.data = this.__selecttrnsType.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type,
        value.trns_name = row_obj.trns_name
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type,
        value.trns_name = row_obj.trns_name
      }
      return true;
    }
  );
}
/**
 *  * This function is used to add a new row to the transaction type and export data.
 *  * It unshifts the new row object to both __selecttrnsType and __export data sources,
 *  * and updates the change subscription for both data sources.
 * @param row_obj 
 */
addRow(row_obj){
  this.__selecttrnsType.data.unshift(row_obj);
  this.__export.data.unshift(row_obj);
  this.__export._updateChangeSubscription();
  this.__selecttrnsType._updateChangeSubscription();
}
/**
 *  * This function is used to delete a transaction type from the list.
 *  * It opens a confirmation dialog to confirm the deletion of the transaction type.
 *  * If confirmed, it removes the transaction type from both __selecttrnsType and __export data sources.
 * @param __el 
 * @param index 
 */
delete(__el,index){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'TT',
      id: __el.id,
      title: 'Delete '  + __el.trns_name,
      api_name:'/trnsDelete'
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
 *  * This function is used to handle the custom sorting of the transaction report table.
 *  * It checks if the sort field is not 'edit' or 'delete', and if so,
 *  * it updates the sort object with the new field and order, and then calls the getTransMst method to fetch the sorted data.
 * @function customSort
 * @param ev 
 */
customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField != 'delete'){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.getTransMst();
  }

}
/**
 *  * This function is used to handle the selection of an item from the transaction type dropdown.
 *  * It updates the transaction type form control value and calls the getTransMst method to fetch the data based on the selected item.
 *  * @function onselectItem
 *  * @memberof TrnsrptComponent
 *  * @description
 * @param ev 
 */
onselectItem(ev){
  // this.__pageNumber.setValue(ev.option.value);
  // this.submit();
  this.getTransMst();
}
}
