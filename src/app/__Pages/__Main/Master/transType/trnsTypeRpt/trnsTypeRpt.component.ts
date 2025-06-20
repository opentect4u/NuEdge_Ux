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
import { TrnstypeModificationComponent } from '../trnstypeModification/trnstypeModification.component';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { global } from 'src/app/__Utility/globalFunc';
import { column } from 'src/app/__Model/tblClmns';
import { transClmns, trnsTypeClmns } from 'src/app/__Utility/Master/trans';
import { Table } from 'primeng/table';


@Component({
selector: 'trnsTypeRpt-component',
templateUrl: './trnsTypeRpt.component.html',
styleUrls: ['./trnsTypeRpt.component.css']
})
export class TrnstyperptComponent implements OnInit {

  formValue;

  itemsPerPage = ItemsPerPage
  sort =new sort();

  __sortColumnsAscOrDsc: any = { active: '', direction: 'asc' };
  __trnsType = new FormGroup({
    trns_type: new FormControl('')
  })
  __export =  new MatTableDataSource<any>([]);
  __pageNumber = new FormControl('10');
  __columns: column[]=trnsTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'trns_type'];
  __paginate: any= [];
  __selecttrnsType = new MatTableDataSource<any>([]);
  __isVisible: boolean = true;
  @ViewChild('dt') primeTbl :Table;

constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<TrnstyperptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.formValue = this.__trnsType.value;
  this.gettransTypeMst();
}
/**
 * * * This function is used to fetch the transaction type master data based on the form values and pagination.
 * * * It creates a FormData object, appends the necessary parameters, and makes an API call to retrieve the data.
 * * * The retrieved data is then used to set the paginator and update the table export.
 * * * @returns void
 */
gettransTypeMst(){
  const __trnsTypeSearch = new FormData();
  __trnsTypeSearch.append('trns_type',this.formValue.trns_type);
  __trnsTypeSearch.append('paginate',this.__pageNumber.value);
  __trnsTypeSearch.append('product_id',this.data.product_id);
  __trnsTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
  __trnsTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
   this.__dbIntr.api_call(1,'/transctiontypeSearch',__trnsTypeSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    // this.__paginate =res.links;
    // this.setPaginator(res.data);
    this.setPaginator(res);

     this.tableExport(__trnsTypeSearch);
   })
}
/**
 *  * * This function is used to filter the global search input in the PrimeNG table.
 *  * * It retrieves the value from the input event and applies the filter to the table.
 *  * * @param $event - The input event containing the search value.
 *  * * @returns void
 */
filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}
/**
 * * * This function is used to get the columns for the transaction type report.
 * * * It utilizes the utility service to retrieve the columns based on the defined column structure.
 * * * @returns {column[]} - An array of column objects representing the transaction type report columns.
 * * * @memberof TrnstyperptComponent
 * * * @description
 * * * This function is responsible for fetching the columns for the transaction type report.
 * * * It uses the utility service to get the columns based on the defined column structure.
 */
getColumns = () =>{
  return this.__utility.getColumns(this.__columns);
}
/**
 * 
 * @param __trnsTypeExport - The FormData object containing the transaction type export parameters.
 * * @returns void
 */
tableExport(__trnsTypeExport){
  __trnsTypeExport.delete('paginate')
  this.__dbIntr.api_call(1,'/transctiontypeExport',__trnsTypeExport).pipe(map((x: any) => x.data)).subscribe((res: any[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}
/**
 *  * * This function is used to fetch the transaction type master data with pagination.
 * * * It makes an API call to retrieve the data based on the provided pagination parameter and product ID.
 * * * The retrieved data is then used to set the paginator and update the table.
 * * * @memberof TrnstyperptComponent
 * @param __paginate - The pagination parameter to control the number of items per page.
 * * @returns void
 */
getTrnsTypeMst(__paginate: string | null = '10'){
  this.__dbIntr.api_call(0,'/transctiontype',
  'paginate='+__paginate + '&product_id=' + this.data.product_id).pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
    this.setPaginator(res.data);
    this.__paginate = res.links;
  });
}

/**
 * * * This function is used to set the paginator for the transaction type data.
 * * * It initializes the MatTableDataSource with the provided response data.
 * * * @param __res - The response data to be set as the paginator.
 * * * @returns void
 */
private setPaginator(__res) {
  this.__selecttrnsType = new MatTableDataSource(__res);
  // this.__selecttrnsType.paginator = this.paginator;
}
/**
 * * * This function is used to get the pagination data for the transaction type report.
 * * * It retrieves the pagination URL and appends the necessary parameters such as page number, transaction type, product ID, order, and field.
 * * * The retrieved data is then used to set the paginator and update the table.
 * * * @param __paginate - The pagination object containing the URL for pagination.
 * * * @returns void
 */
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        +('&trns_type='+ this.formValue?.trns_type)
        + ('&product_id=' +this.data.product_id) +
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
 * 
 * @param __paginate - The pagination parameter to control the number of items per page.
 * * * @returns void
 * * * @description
 * * * This function is used to handle the pagination of the transaction type report.
 * * * It sets the page number in the form control and submits the form to fetch the data for the specified page.
 */
getval(__paginate) {
   this.__pageNumber.setValue(__paginate.toString());
  this.submit();
}

/**
 *  * * This function is used to populate the data table with the provided items.
 *  * * It opens a dialog for adding or updating a transaction type based on the provided item.
 *  * * @memberof TrnstyperptComponent
 *  * @description
 * * This function is responsible for populating the data table with the provided items.
 * * It opens a dialog for adding or updating a transaction type based on the provided item.
 * * @param {any} __items - The item to be populated in the data table.
 * * @returns void
 * * @memberof TrnstyperptComponent
 * @param __items - The item to be populated in the data table.
 */
populateDT(__items: any) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items.id, __items);
}
/**
 *  * * This function is used to open a dialog for adding or updating a transaction type.
 *  * * It creates a MatDialogConfig object, sets various properties for the dialog,
 * @param id - The ID of the transaction type to be added or updated.
 * * @description
 * @param __items 
 */
openDialog(id, __items) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '50%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.id = 'TRNS_Type'+id;
  dialogConfig.data = {
    flag : 'TRNS_Type'+id,
    id: id,
    title: id == 0 ? 'Add Transaction Type' : 'Update Transaction Type',
    items: __items,
    product_id:this.data.product_id
  };
  try{
    const dialogref = this.__dialog.open(TrnstypeModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
           this.updateRow(dt.data);
      }
      else{
        // this.addRow(dt.data);
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
      flag:'TRNS_Type'+id
    });
  }
}
/**
 * * * This function is used to toggle the full-screen mode of the dialog.
 * * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
 * * * The dialog position is updated to the top of the screen, and the visibility state is toggled.
 * * * @returns void
 * * @memberof TrnstyperptComponent
 * * @description
 * * This function is responsible for toggling the full-screen mode of the dialog.
 * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
 * * The dialog position is updated to the top of the screen, and the visibility state is toggled.
 */
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
/**
 * * * This function is used to minimize the dialog by removing the 'mat_dialog' and 'full_screen' panel classes.
 * * * It updates the dialog size to 40% width and 55px height, and sets the position to the bottom right corner of the screen.
 * * * @returns void
 * * @memberof TrnstyperptComponent 
 */
minimize(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.updateSize("40%",'55px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
/**
 * * * This function is used to maximize the dialog by removing the 'full_screen' panel class and adding the 'mat_dialog' panel class.
 * * * It updates the dialog position to the top of the screen and toggles the visibility state.
 * * * @returns void
 * * @memberof TrnstyperptComponent
 */
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

/**
 * * * This function is used to export the transaction type report as a PDF file. 
 *  * * It calls the downloadReport method of the RPTService with the specified parameters.
 * * * @returns void
 * * @memberof TrnstyperptComponent
 * * @description
 * * This function is responsible for exporting the transaction type report as a PDF file.
 * * It calls the downloadReport method of the RPTService with the specified parameters.
 * * The report is titled "Transaction type" and includes the current date in the title.
 */
exportPdf(){
  this.__Rpt.downloadReport('#trxn_type',
  {
    title: 'Transaction type - ' + new Date().toLocaleDateString()
  }, 'Transaction type','portrait')
}
/**
 * * * This function is used to submit the form values and fetch the transaction type master data.
 * * * It assigns the form values to the formValue variable and calls the gettransTypeMst() method to retrieve the data.
 * * * @returns void
 * * @memberof TrnstyperptComponent
 */
submit(){
  this.formValue = this.__trnsType.value;
  this.gettransTypeMst();
}
/**
 *  * * This function is used to update a specific row in the transaction type data.
 *  * * It filters the data in both __selecttrnsType and __export based on the provided row object.
 *  * * If a row with the same ID is found, it updates the trns_type property of that row with the value from the row_obj.
 *  * * @memberof TrnstyperptComponent
 *  * @description
 * @param row_obj - The object representing the row to be updated.
 * * * @returns void
 */
private updateRow(row_obj: any) {
  this.__selecttrnsType.data = this.__selecttrnsType.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: any, key) => {
      if (value.id == row_obj.id) {
        value.trns_type = row_obj.trns_type
      }
      return true;
    }
  );
}
/**
 *  * * This function is used to add a new row to the transaction type data.
 *  * * It adds the provided row_obj to both __selecttrnsType and __export data arrays.
 *  * * The _updateChangeSubscription() method is called on both data sources to update the change subscription.
 *  * * @memberof TrnstyperptComponent
 *  * @description  
 * @param row_obj 
 */
addRow(row_obj){
  this.__selecttrnsType.data.unshift(row_obj);
  this.__export.data.unshift(row_obj);
  this.__export._updateChangeSubscription();
  this.__selecttrnsType._updateChangeSubscription();
}
/**
 *  * * This function is used to sort the transaction type data based on the provided sort parameter.
 *  * * It assigns the sort parameter to the __sortColumnsAscOrDsc variable 
 * @param sort 
 */
sortData(sort){
  this.__sortColumnsAscOrDsc =sort;
  this.submit();
}
/**
 * 
 * @param __el  - The element to be deleted from the transaction type data.
 * * @param index - The index of the element to be deleted in the data array.
 * * * @returns void
 * @param index 
 * * * @description
 * * This function is used to delete a specific transaction type from the data.
 * * It opens a confirmation dialog and, upon confirmation, removes the element from both __selecttrnsType and __export data arrays.
 */
delete(__el,index){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'TT',
      id: __el.id,
      title: 'Delete '  + __el.trns_type,
      api_name:'/trnsTypeDelete'
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
 *  * This function is used to handle the custom sorting of the transaction type data.
 *  * It checks if the sort field is not 'edit' or 'delete', and if so, it updates the sort object with the sort field and order.
 *  * It then calls the gettransTypeMst() method to retrieve the sorted data.
 *  * @memberof TrnstyperptComponent
 * @param ev 
 */
customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField != 'delete'){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  // this.submit();
  this.gettransTypeMst();
  }
}
/**
 * 
 * @param ev - The event triggered when an item is selected from the dropdown.
 * * @description
 * * This function is used to handle the selection of an item from the dropdown.
 */
onselectItem(ev){
  // this.__pageNumber.setValue(ev.option.value);
  // this.submit();
  this.gettransTypeMst();
}
}
