import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { IMFTrax } from '../../mftrax.component';
import { column } from 'src/app/__Model/tblClmns';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { MftraxModificationComponent } from '../mftrax-modification/mftrax-modification.component';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-mf-trax-report',
  templateUrl: './mf-trax-report.component.html',
  styleUrls: ['./mf-trax-report.component.css']
})
export class MfTraxReportComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

  /***** Holding Column */
  __mfTrx:IMFTrax[] = [];
  /********END */

  /***** Holding Column */
  __mfTraxColumn:column[] = MFTraxColumn.column;
  /******End */

  __isVisible: boolean = true;

  constructor(
    private dbIntr:DbIntrService,
    public dialogRef: MatDialogRef<MfTraxReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {mf_trax_id:number,right:string},
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
    ) { }

  ngOnInit(): void {this.fetchMFTrax()}

  fetchMFTrax = () =>{
      this.dbIntr.api_call(0,'/MFTraxShowDetails',null)
      .pipe(pluck('data'))
      .subscribe((res:IMFTrax[]) =>{
            this.__mfTrx = res;
      })
  }

 
  /**
   *    * This function is used to get the columns for the MFTrax table.
   *   * @returns {column[]} An array of column objects for the MFTrax table.
   *  *   * @memberof MfTraxReportComponent
   *  *   * @description
   *  * This function retrieves the columns for the MFTrax table from the utility service.
   *  * It uses the `getColumns` method of the utility service to get the columns defined in the `MFTraxColumn` class.
   *  * The columns are used to display the MFTrax data in a tabular format.
   */
  getColumns = () =>{
    return this.__utility.getColumns(this.__mfTraxColumn);
  }

  /**
   * * This function is used to toggle the visibility of the dialog.
   * * @returns void
   * * @memberof MfTraxReportComponent
   */
  fullScreen() {
    this.dialogRef.updateSize("80%");
    this.__isVisible = !this.__isVisible;
  }
  /**
   * * This function is used to toggle the visibility of the dialog.
   * * @returns void
   * * @memberof MfTraxReportComponent
   */
  minimize() {
    this.dialogRef.updateSize("30%",'47px');
    this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
  }
  /**
   * * * This function is used to maximize the dialog.
   * * * @returns void
   * * * @memberof MfTraxReportComponent
   * * * @description
   */
  maximize() {
    this.fullScreen();
  }

  /**
   *  * This function is used to populate the DataTable with MFTrax data.
   *  * It opens the dialog for creating or updating MFTrax based on the provided
   * @param mf_trax 
   */
  populateDT = (mf_trax:IMFTrax) =>{
      this.openDialogForCreateMFTrax(mf_trax,mf_trax.id)
  }
  /**
   *  * This function is used to open a dialog for creating or updating MFTrax.
   *  * It takes an optional MFTrax object and an ID as parameters.
   * @param mfTrax 
   * @param id 
   */
  openDialogForCreateMFTrax = (mfTrax: IMFTrax | null = null,id:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'MFTRAX',
      id: id,
      exchange: mfTrax,
      title: id == 0 ? 'Add MFTrax' : 'Update MFTrax',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        MftraxModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if(dt){
          this.updateRow(dt);
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'MFTRAX',
      });
    }
  }

  /**
   *  * This function is used to update a row in the MFTrax table.
   *  * It takes an MFTrax item as a parameter and updates the corresponding row in the table.
   *  * @memberof MfTraxReportComponent
   * * @description
   * * This function is responsible for updating a row in the MFTrax table.
   * * It takes an MFTrax item as a parameter and updates the corresponding row in the table.
   *  * @param {IMFTrax} item - The MFTrax item to be updated.
   * @param item 
   */
  updateRow = (item:IMFTrax) =>{
    this.__mfTrx = this.__mfTrx.map(el =>
        el.id == item.id ? item : el
      );
}

/**
 *  * This function is used to delete a MFTrax item from the table.
 *  * It opens a confirmation dialog and, if confirmed, removes the item from the table.
 *  * @memberof MfTraxReportComponent
 * @param mf_trax - The MFTrax item to be deleted.
 * @description
 * This function is responsible for deleting a MFTrax item from the table.
 * It opens a confirmation dialog and, if confirmed, removes the item from the table.
 * @param index - The index of the MFTrax item in the table.
 * @returns {void}
 */
  delete = (mf_trax:IMFTrax,index:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'MTX',
      id: mf_trax.id,
      title: 'Delete '  + mf_trax.mf_trax,
      api_name:'/mfTraxDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__mfTrx.splice(index,1);
        }
      }

    })
  }

  /**
   * 
   * @param ev - The event triggered by the global filter input.
   * @description
   * This function is used to filter the global data in the MFTrax table.
   * It retrieves the value from the event target and applies a global filter to the table.
   * @returns {void}
   */
  filterGlobal = (ev) => {
    let value = ev.target.value;
    this.primeTbl.filterGlobal(value, 'contains');

  }

}

export class MFTraxColumn{
  public static column:column[] = [
    {
      field:'sl_no',
      header:'Sl No.',
      width:'10rem'
    },
    {
      field:'mf_trax',
      header:'MFTrax',
      width:'83rem'
    },
    {
      field:'edit',
      header:'Edit',
      width:'7rem'
    },
    {
      field:'delete',
      header:'Delete',
      width:'7rem'
    }
  ]
}
