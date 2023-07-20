import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
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
@Component({
  selector: 'planRpt-component',
  templateUrl: './planRpt.component.html',
  styleUrls: ['./planRpt.component.css'],
})
export class PlanrptComponent implements OnInit {
   itemsPerPage=ItemsPerPage;
  __iscatspinner: boolean = false;
  __catForm = new FormGroup({
    plan_name: new FormControl(''),
    options: new FormControl('2'),
  });
  __export = new MatTableDataSource<plan>([]);
  __pageNumber = new FormControl(10);
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
  }
  setColumns(){
   const  clmToRemove:string[] = ['edit','delete'];
   this.__columns = planClms.COLUMN;
   this.__exportedClmns = planClms.COLUMN.filter(res => !clmToRemove.includes(res.field)).map(item => {return item['field']})
  }

  getPlanMst() {
    const __planExport = new FormData();
    __planExport.append('plan_name', this.__catForm.value.plan_name);
    __planExport.append('paginate', this.__pageNumber.value);
    __planExport.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __planExport.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : ''));
    this.__dbIntr
      .api_call(1, '/planDetailSearch', __planExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__planExport);
      });
  }

  tableExport(__planExport) {
    __planExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/planExport', __planExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: plan[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }

  private setPaginator(__res) {
    this.__selectPLN = new MatTableDataSource(__res);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&plan_name=' + this.__catForm.value.plan_name) +
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
  populateDT(__items: plan) {
    this.openDialog(__items, __items.id);
  }
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
      '#plan',
      {
        title: 'Plan - '+ new Date().toLocaleDateString(),
      },
      'Plan',
      'p'
    );
  }
  submit() {
    this.getPlanMst();
  }

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
  customSort(ev){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
    this.submit();
  }
  onselectItem(ev){
    this.__pageNumber.setValue(ev.option.value);
    this.submit();
  }
}
