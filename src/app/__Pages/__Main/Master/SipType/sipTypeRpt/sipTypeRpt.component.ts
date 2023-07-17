import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
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
@Component({
  selector: 'sipTypeRpt-component',
  templateUrl: './sipTypeRpt.component.html',
  styleUrls: ['./sipTypeRpt.component.css'],
})
export class SiptyperptComponent implements OnInit {
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
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<SiptyperptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {}

  getSIPTypeMst() {
    const __SIPTypeSearch = new FormData();
    __SIPTypeSearch.append('sip_type_name',this.__trnsType.value.sip_type_name);
    __SIPTypeSearch.append('paginate', this.__pageNumber.value);
    __SIPTypeSearch.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __SIPTypeSearch.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
    this.__dbIntr
      .api_call(1, '/sipTypeSearch', __SIPTypeSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__SIPTypeSearch);
      });
  }

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
  getTrnsTypeMst(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/sipType', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }

  private setPaginator(__res) {
    this.__selecttrnsType = new MatTableDataSource(__res);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&sip_type_name=' + this.__trnsType.value.sip_type_name) +
            ('&order=' + (global.getActualVal(this.sort.order) ? this.sort.order : '')) +
            ('&field=' + (global.getActualVal(this.sort.field) ? this.sort.field : ''))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  populateDT(__items: any) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    console.log(__items);

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
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SIP',
      });
    }
  }
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  minimize() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.updateSize('40%', '55px');
    this.dialogRef.updatePosition({
      bottom: '0px',
      right: this.data.right + 'px',
    });
  }
  maximize() {
    this.dialogRef.removePanelClass('full_screen');
    this.dialogRef.addPanelClass('mat_dialog');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }

  exportPdf() {
    this.__Rpt.downloadReport(
      '#SipType',
      {
        title: 'SIP type ',
      },
      'SIP type'
    );
  }
  submit() {
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
  addRow(row_obj) {
    this.__selecttrnsType.data.unshift(row_obj);
    this.__export.data.unshift(row_obj);
    this.__export._updateChangeSubscription();
    this.__selecttrnsType._updateChangeSubscription();
  }
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
  customSort(ev){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.submit();
  }
  onselectItem(ev){
    this.submit();
  }
}
