import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {map} from 'rxjs/operators';
import { docType } from 'src/app/__Model/__docTypeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { DocsModificationComponent } from '../docsModification/docsModification.component';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { column } from 'src/app/__Model/tblClmns';
import { docTypeClmns } from 'src/app/__Utility/Master/docTypeClmns';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { Table } from 'primeng/table';

@Component({
selector: 'docTypeRpt-component',
templateUrl: './docTypeRpt.component.html',
styleUrls: ['./docTypeRpt.component.css']
})
export class DoctyperptComponent implements OnInit {
  formValue;
  itemsPerPage=ItemsPerPage;
  @ViewChild('dt') primeTbl :Table;

  sort=new sort();
  __catForm = new FormGroup({
    doc_type: new FormControl(''),
     options:new FormControl('2')
  })
  __export =  new MatTableDataSource<docType>([]);
  __pageNumber = new FormControl('10');
  __columns: column[] = docTypeClmns.COLUMN;
  __exportedClmns: string[] = ['sl_no', 'doc_type'];
  __paginate: any= [];
  __selectdocType = new MatTableDataSource<docType>([]);
  __isVisible: boolean = true;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<DoctyperptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  this.formValue = this.__catForm.value;
  this.getDocumnetTypeMst();
}

/**
 * * This function is used to fetch the document type master data from the server.
 * * @returns void
 * * @memberof DoctyperptComponent  
 * * * @description
 * * This function is responsible for making an API call to retrieve the document type master data.
 * * It constructs a FormData object with the necessary parameters, including the document type and pagination details.
 * * The API call is made using the DbIntrService, and the response is processed to set the paginator and update the table data.
 * * @example
 * * // Usage: Call this function when the component is initialized or when the user submits the form.
 */
 getDocumnetTypeMst(){
  const __docTypeSearch = new FormData();
  __docTypeSearch.append('doc_type',this.formValue?.doc_type ? this.__catForm.value.doc_type : '');
  __docTypeSearch.append('paginate',this.__pageNumber.value);
  __docTypeSearch.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
  __docTypeSearch.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : '1'));
   this.__dbIntr.api_call(1,'/documenttypeDetailSearch',__docTypeSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    // this.__paginate =res.links;
    // this.setPaginator(res.data);
    this.setPaginator(res);

     this.tableExport(__docTypeSearch);
   })
 }

 /**
  *   * This function is used to export the document type data to a file.
  *   * @param __docTypeExport - The FormData object containing the document type data to be exported.
  *   * @returns void
  *  * @memberof DoctyperptComponent
  *   * @description
  *   * This function makes an API call to export the document type data. It removes the 'paginate' property from the FormData object,
  */
tableExport(__docTypeExport){
  __docTypeExport.delete('paginate');
  this.__dbIntr.api_call(1,'/documenttypeExport',__docTypeExport).pipe(map((x: any) => x.data)).subscribe((res: docType[]) =>{
     console.log(res);
    this.__export = new MatTableDataSource(res);
  })
}

/**
 * * * This function is used to filter the global search input in the document type table.
 * * * @param $event - The event object containing the input value.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 */
filterGlobal = ($event) => {
  let value = $event.target.value;
  this.primeTbl.filterGlobal(value,'contains')
}
/**
 * 
 * @returns Array<column>
 * * * This function is used to get the columns for the document type table.
 * * * It retrieves the columns from the utility service and returns them.
 */
getColumns = () =>{
  return this.__utility.getColumns(this.__columns);
}
/**
 * 
 * @param __res - The response data containing the document types.
 * * * This function is used to set the paginator for the document type table.
 * * * It takes the response data as a parameter and updates the MatTableDataSource with the document types.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 */
private setPaginator(__res) {
  this.__selectdocType = new MatTableDataSource(__res);
}
/**
 *  * * This function is used to get the pagination data for the document type table.
 *  * * It takes the pagination object as a parameter and makes an API call to fetch the paginated data.
 *  * * The API call includes the pagination URL, page number, document type, sort order, and sort field.
 *  * * The response data is then processed to update the paginator and the table data.
 * *  * @param __paginate - The pagination object containing the URL and other pagination details.
 * *  * @returns void
 */
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        + ('&doc_type=' + this.formValue?.doc_type)
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
 * * * This function is used to populate the document type table with the selected item.
 * * * It takes the selected document type item as a parameter and opens a dialog for modification.
 * * * @param __items - The selected document type item.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 * * This function is responsible for opening a dialog to modify the selected document type item.
 * * It passes the document type and ID to the dialog component for further processing.
 */
populateDT(__items: docType) {
  this.openDialog(__items.doc_type, __items.id);
}
/**
 *  * * This function is used to open a dialog for adding or updating a document type.
 *  * * It takes the category and category ID as parameters and configures the dialog settings.
 *  * * The dialog is opened with the DocsModificationComponent, and after it is closed, the data is updated accordingly.
 * * * @param __category - The category of the document type (optional).
 * * * @param __catId - The ID of the document type (0 for adding a new document type).
 * * * @returns void
 * * * @memberof DoctyperptComponent
 */
openDialog(__category: string | null = null, __catId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'D',
    id: __catId,
    doc_type: __category,
    title: __catId == 0 ? 'Add Document Type' : 'Update Document Type',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      DocsModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectdocType.data.unshift(dt.data);
          this.__selectdocType._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'D',
    });
  }
}
/**
 * 
 * @param row_obj - The document type object to be updated.
 * * * This function is used to update a specific row in the document type table.
 * * * It filters the existing data in the MatTableDataSource and updates the document type field of the matching row.
 * * * The function also updates the export data to reflect the changes made to the document type.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 */
private updateRow(row_obj: docType) {
  this.__selectdocType.data = this.__selectdocType.data.filter(
    (value: docType, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: docType, key) => {
      if (value.id == row_obj.id) {
        value.doc_type = row_obj.doc_type
      }
      return true;
    }
  );
}
/**
 * * * This function is used to toggle the full-screen mode of the dialog.
 * * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
 * * * The dialog position is updated to the top of the screen, and the visibility state is toggled.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 */
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
/**
 * * * This function is used to minimize the dialog.
 * * * It removes the 'mat_dialog' and 'full_screen' panel classes, updates the dialog size to 40% width and 47px height,
 * * * and sets the position of the dialog to the bottom right corner of the screen.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 * * * This function is responsible for minimizing the dialog by updating its size and position.
 */
minimize(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.updateSize("40%",'47px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
/**
 * * * This function is used to maximize the dialog.
 * * * It removes the 'full_screen' panel class, adds the 'mat_dialog' panel class, and updates the dialog position to the top of the screen.
 * * * The visibility state is toggled to show or hide the dialog.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 * * * This function is responsible for maximizing the dialog by updating its size and toggling the visibility state.
 */
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}

/**
 * * * This function is used to export the document type data as a PDF file.
 * * * It calls the downloadReport method of the RPTService with the document type selector, report options, and report name.
 * * * @returns void  
 * * * @memberof DoctyperptComponent
 * * * @description
 * * * This function is responsible for exporting the document type data as a PDF file.
 * * * It uses the RPTService to generate the report and download it.
 */
exportPdf(){
  this.__Rpt.downloadReport('#DocumentType',
  {
    title: 'DocumentType '
  }, 'DocumentType')
}
/**
 * * * This function is used to submit the document type form data.
 * * * It retrieves the form values and calls the getDocumnetTypeMst method to fetch the updated document type data.
 * * * @returns void
 */
submit(){
 this.formValue = this.__catForm.value;
 this.getDocumnetTypeMst();
}

/**
 * 
 * @param ev - The event object containing the sort field and order.
 * * * This function is used to handle custom sorting of the document type table.
 */
customSort(ev){
  if(ev.sortField != 'edit' && ev.sortField != 'delete'){
  this.sort.field = ev.sortField;
  this.sort.order = ev.sortOrder;
  this.getDocumnetTypeMst();
  }
}
/**
 * 
 * @param ev - The event object containing the selected item.
 * * * This function is used to handle the selection of an item in the document type table.
 * * * It calls the getDocumnetTypeMst method to fetch the updated document type data based on the selected item.
 * * * @returns void
 * * * @memberof DoctyperptComponent
 * * * @description
 */
onselectItem(ev){
  this.getDocumnetTypeMst();
}
/**
 *  * * This function is used to delete a document type from the table.
 * * * It opens a confirmation dialog to confirm the deletion and removes the document type from both the selectdocType and export data sources if confirmed.
 * * * @param docType - The document type object to be deleted.
 * @param docType - The document type object to be deleted.
 * * * This function is used to delete a document type from the table.
 * @param index 
 */
delete(docType,index){
  const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'DT',
        id: docType.id,
        title: 'Delete '  + docType.doc_type,
        api_name:'/documenttypeDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selectdocType.data.splice(index,1);
            this.__selectdocType._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == docType.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
}
}
