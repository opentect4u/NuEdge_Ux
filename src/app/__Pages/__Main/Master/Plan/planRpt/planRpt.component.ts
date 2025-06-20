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
import { plan } from 'src/app/__Model/plan';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PlanModificationComponent } from '../planModification/planModification.component';
import { column } from 'src/app/__Model/tblClmns';
import { planClms } from 'src/app/__Utility/Master/planClms';
import ItemsPerPage from '../../../../../../assets/json/itemsPerPage.json';
import { sort } from 'src/app/__Model/sort';
import { Table } from 'primeng/table';
@Component({
  selector: 'planRpt-component',
  templateUrl: './planRpt.component.html',
  styleUrls: ['./planRpt.component.css'],
})
export class PlanrptComponent implements OnInit {
  /**
   * holding Form data after submit
   */
  formValue;
  @ViewChild('dt') primeTbl :Table;

   itemsPerPage=ItemsPerPage;
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    plan_name: new FormControl(''),
    options: new FormControl('2'),
  });
  __export = new MatTableDataSource<plan>([]);
  __pageNumber = new FormControl('10');
  sort=new sort();
    __columns:column[]=[];
  __exportedClmns:string[] =[];
  __paginate: any = [];
  __selectPLN = new MatTableDataSource<plan>([]);
  __isVisible: boolean = true;
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<PlanrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.setColumns();
    this.formValue = this.__catForm.value;
    this.getPlanMst();
  }
  /**
   * * This function is responsible for setting the columns for the plan report table.
   * * It initializes the `__columns` array with the column definitions from `planClms.COLUMN`,
   * * and filters out the columns that should not be included in the export.
   * * The columns to be removed from the export are defined in the `clmToRemove` array.
   * * The `__exportedClmns` array is populated with the fields of the remaining columns.
   */
  setColumns(){
   const  clmToRemove:string[] = ['edit','delete'];
   this.__columns = planClms.COLUMN;
   this.__exportedClmns = planClms.COLUMN.filter(res => !clmToRemove.includes(res.field)).map(item => {return item['field']})
  }

  /**
   * * This function is responsible for fetching the plan master data from the server.
   * * It creates a FormData object with the plan name and pagination details,
   */
  getPlanMst() {
    const __planExport = new FormData();
    __planExport.append('plan_name', this.formValue?.plan_name);
    __planExport.append('paginate', this.__pageNumber.value);
    __planExport.append('field', (global.getActualVal(this.sort.field) ? (this.sort.field != 'edit' && this.sort.field != 'delete'  ? this.sort.field : '') : ''));
    __planExport.append('order', (global.getActualVal(this.sort.order) ? (this.sort.field != 'edit' && this.sort.field != 'delete'? this.sort.order : '') : ''));
    this.__dbIntr
      .api_call(1, '/planDetailSearch', __planExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        // this.__paginate = res.links;
        // this.setPaginator(res.data);
        this.setPaginator(res);
        this.tableExport(__planExport);
      });
  }
  /**
   *  * This function is responsible for getting the columns for the plan report table.
   *  * It uses the `__utility` service to retrieve the columns based on the `__columns` array.
   *  * @returns {column[]} - An array of column definitions for the plan report table.
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__columns);
  }
  /**
   *  * This function is responsible for exporting the plan data to a table format.
   *  * It takes a FormData object as input, which contains the plan export parameters
   * @param __planExport 
   */
  tableExport(__planExport) {
    __planExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/planExport', __planExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: plan[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  /**
   *  * This function is responsible for filtering the global search input in the plan report table.
   *  * It retrieves the value from the input event and applies the filter to the PrimeNG table.
   *  * @param $event - The input event containing the search value.
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }

  /**
   *  * This function is responsible for setting the paginator for the plan report table.
   *  * It takes the response data as input and initializes the `__selectPLN` data source with it.
   *  * @param __res - The response data containing the plan details. 
   */
  private setPaginator(__res) {
    this.__selectPLN = new MatTableDataSource(__res);
  }
  /**
   * * This function is responsible for retrieving pagination data for the plan report table.
   * * It takes a pagination object as input and makes an API call to fetch the paginated data.
   * * The URL for the API call is constructed using the provided pagination URL, along with additional parameters such as page number, plan name, order, and field.
   * * The response data is then used to update the paginator and the `__paginate` object.
   * @param __paginate - The pagination object containing the URL for fetching paginated data.
   */
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&plan_name=' + this.formValue?.plan_name) +
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
   *  * This function is responsible for populating the plan report table with the provided items.
   *  * It opens a dialog for plan modification with the specified items and category ID.
   *  * If the category ID is 0, it indicates that a new plan is being added.
   *  * @param __items - The plan item to be populated in the table.
   */
  populateDT(__items: plan) {
    this.openDialog(__items, __items.id);
  }
  /**
   *  * This function is responsible for opening a dialog for plan modification.
   *  * It creates a MatDialogConfig object with various properties such as autoFocus, closeOnNavigation, disableClose, hasBackdrop, width, scrollStrategy, and data.
   *  * The dialog is opened with the PlanModificationComponent and the provided configuration.
   *  * After the dialog is closed, it updates the plan data in the table if a new plan is added or an existing plan is updated.
   * @param __category 
   * @param __catId 
   */
  openDialog(__category: plan | null = null, __catId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'P',
      id: __catId,
      items: __category,
      title: __catId == 0 ? 'Add Plan' : 'Update Plan',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        PlanModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectPLN.data.unshift(dt.data);
            this.__selectPLN._updateChangeSubscription();
            this.__export.data.unshift(dt.data);
            this.__export._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: __catId,
        isVisible: false,
        flag: 'P',
      });
    }
  }
  /**
   *  * This function is responsible for updating a row in the plan report table.
   *  * It filters the `__selectPLN.data` and `__export.data` arrays to find the row with the matching ID.
   *  * If a match is found, it updates the `plan_name` property of that row with the new value from `row_obj`.
   *  * @param {plan} row_obj - The plan object containing the updated data for the row.
   *  * @memberof PlanrptComponent
   * @param row_obj 
   */
  private updateRow(row_obj: plan) {
    this.__selectPLN.data = this.__selectPLN.data.filter((value: plan, key) => {
      if (value.id == row_obj.id) {
        value.plan_name = row_obj.plan_name;
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: plan, key) => {
      if (value.id == row_obj.id) {
        value.plan_name = row_obj.plan_name;
      }
      return true;
    });
  }
  /**
   * * This function is responsible for toggling the full-screen mode of the dialog.
   * * It removes the 'mat_dialog' panel class and adds the 'full_screen' panel class to the dialog reference.
   * * It also updates the position of the dialog to be at the top of the screen.
   * * The `__isVisible` property is toggled to indicate whether the dialog is currently visible in full-screen mode.
   * @memberof PlanrptComponent 
   */
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * This function is responsible for minimizing the dialog.
   * * It removes the 'mat_dialog' and 'full_screen' panel classes from the dialog reference.
   * * It updates the size of the dialog to '40%' width and '47px' height.
   * * The position of the dialog is updated to be at the bottom of the screen with a right offset based on the `data.right` value.
   * @memberof PlanrptComponent
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
   * * * This function is responsible for maximizing the dialog.
   * * * It removes the 'full_screen' panel class and adds the 'mat_dialog' panel class to the dialog reference.
   * * * It updates the position of the dialog to be at the top of the screen.
   * * * The `__isVisible` property is toggled to indicate whether the dialog is currently visible in maximized mode.
   * @memberof PlanrptComponent
   */
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  /**
   * * * This function is responsible for exporting the plan report as a PDF file.
   * * * It uses the `__Rpt` service to download the report with the specified parameters.
   * * * The report is generated from the HTML element with the ID 'plan', and the title of the report is set to 'Plan - ' followed by the current date.
   * * * The report is exported in PDF format with the file name 'Plan'.
   * @memberof PlanrptComponent
   */
  exportPdf() {
    this.__Rpt.downloadReport(
      '#plan',
      {
        title: 'Plan - '+ new Date().toLocaleDateString(),
      },
      'Plan',
      'p'
    );
  }
  /**
   * * * This function is responsible for submitting the form data for the plan report.
   * * * It retrieves the values from the `__catForm` and assigns them to the `formValue` property.
   * * * After that, it calls the `getPlanMst` function to fetch the plan master data based on the submitted form values.
   * @memberof PlanrptComponent
   */
  submit() {
    this.formValue = this.__catForm.value;
    this.getPlanMst();
  }

  /**
   *  * This function is responsible for deleting a plan from the plan report table.
   *  * It opens a confirmation dialog using the `DeletemstComponent` and passes the necessary data to it.
   *  * If the user confirms the deletion, it removes the plan from both the `__selectPLN` and `__export` data sources.
   *  * @param __el - The plan object to be deleted.
   *  * @param index - The index of the plan in the `__selectPLN` data source.
   *  * @memberof PlanrptComponent
   */
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.role = "alertdialog";
      dialogConfig.data = {
        flag: 'P',
        id: __el.id,
        title: 'Delete '  + __el.plan_name,
        api_name:'/planDelete'
      };
      const dialogref = this.__dialog.open(
        DeletemstComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          if(dt.suc == 1){
            this.__selectPLN.data.splice(index,1);
            this.__selectPLN._updateChangeSubscription();
            this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
            this.__export._updateChangeSubscription();
          }
        }

      })
  }
  /**
   *  * This function is responsible for handling the custom sorting of the plan report table.
   *  * It checks if the sort field is not 'edit' or 'delete',  
   *  *  * and if so, it updates the `sort` object with the new sort field and order.
   *  * It then calls the `getPlanMst` function to fetch the plan master data with the updated sorting parameters.
   *  * @param ev - The event object containing the sort field and order.
   */
  customSort(ev){
    if(ev.sortField != 'edit' && ev.sortField != 'delete'){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.getPlanMst();
  }
  }
  /**
   *    * This function is responsible for handling the selection of an item in the plan report table.
   *    * It retrieves the selected item's value and calls the `getPlanMst` function to fetch the plan master data based on the selected item.
   *    * @param ev - The event object containing the selected item.
   *    * @memberof PlanrptComponent
   */
  onselectItem(ev){
    // this.__pageNumber.setValue(ev.option.value);
    this.getPlanMst();
  }
}
