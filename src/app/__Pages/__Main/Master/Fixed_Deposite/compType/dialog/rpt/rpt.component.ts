import { Overlay } from '@angular/cdk/overlay';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map, pluck } from 'rxjs/operators';
import { RPTService } from 'src/app/__Services/RPT.service';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ComptypeCrudComponent } from '../comptype-crud/comptype-crud.component';

@Component({
  selector: 'app-rpt',
  templateUrl: './rpt.component.html',
  styleUrls: ['./rpt.component.css']
})
export class RptComponent implements OnInit {
  __paginate: any = [];
  __cmp_settings = this.__utility.settingsfroMultiselectDropdown('id','comp_type','Search Company Type');

  __searchForm = new FormGroup({
      company_type:new FormControl([])
  })
  __sortAscOrDsc: any = { active: '', direction: 'asc' };
  __pageNumber = new FormControl(10);
  __cmpTypeMst: any = [];
  __CmpType = new MatTableDataSource<any>([]);
  __CmpTypeExport = new MatTableDataSource<any>([]);
  __columns = ['sl_no','comp_type','edit'];
  __exportedClmns = ['sl_no','comp_type'];
   __isVisible: boolean = true;
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getCompanyTypeMst(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
    this.getCompanyTypeMasterForDropdown();
  }

  getCompanyTypeMasterForDropdown(){
    this.__dbIntr.api_call(0,'/fd/companyType',null).pipe(pluck("data")).subscribe((res) =>{
      this.__cmpTypeMst = res;
    })
  }

  getCompanyTypeMst(
    column_name: string | null = null,
    sort_by: string | null = null
  ){
    const __fd = new FormData();
    __fd.append('comp_type',this.__searchForm.value.comapny_type ? JSON.stringify(this.__searchForm.value.comapny_type) : "[]");
    __fd.append('paginate',this.__pageNumber.value);
    __fd.append('sort_by',sort_by);
    __fd.append('column_name',column_name);

    this.__dbIntr.api_call(1,'/fd/companyTypeDetailSearch',__fd).pipe(pluck("data")).subscribe((res: any) =>{
      this.__paginate = res.links;
      this.setPaginator(res.data);
      this.tableExport(__fd);
    })
  }
  tableExport(__fd: FormData){
    __fd.delete('paginate');
    this.__dbIntr.api_call(1,'/fd/companyTypeExport',null).pipe(pluck("data"))
    .subscribe((res: any) => {
      this.__CmpTypeExport = new MatTableDataSource(res);
    });

  }
  setPaginator(__dt){
    this.__CmpType = new MatTableDataSource(__dt);
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
  fullScreen() {
    this.dialogRef.removePanelClass('mat_dialog');
    this.dialogRef.addPanelClass('full_screen');
    this.dialogRef.updatePosition({ top: '0px' });
    this.__isVisible = !this.__isVisible;
  }
  populateDT(__el){
    this.openDialog(__el, __el.id);

  }

  openDialog(cmpType: any, __id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'Fixed_CMP',
      id: __id,
      items: cmpType,
      title: __id == 0 ? 'Add Company Type' : 'Update Company Type',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(ComptypeCrudComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            console.log(dt.id);

            this.updateRow(dt.data);
          } else {
            this.__CmpType.data.unshift(dt.data);
            this.__CmpType._updateChangeSubscription();
            this.__CmpTypeExport.data.unshift(dt.data);
            this.__CmpTypeExport._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'Fixed_CMP',
      });
    }
  }
  updateRow(row_obj){
    this.__CmpType.data = this.__CmpType.data.filter(
      (value: any, key) => {
        if (value.id == row_obj.id) {
          value.id = row_obj.id;
          value.comp_type = row_obj.comp_type;
        }
        return true;
      }
    );
    this.__CmpTypeExport.data = this.__CmpTypeExport.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.id = row_obj.id;
        value.comp_type = row_obj.comp_type;
      }
      return true;
    });
  }
  getval(__paginate) {
     this.__pageNumber.setValue(__paginate.toString());
    this.getCompanyTypeMst(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&com_type=' + this.__searchForm.value.company_type ? JSON.stringify(this.__searchForm.value.company_type) : "[]") +
            ('&column_name=' + this.__sortAscOrDsc.active) +
            ('&sort_by=' + this.__sortAscOrDsc.sort_by)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  exportPdf(){

  }
  searchCompanyType(){
    this.getCompanyTypeMst(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
  }
  sortData(sort) {
    this.__sortAscOrDsc = sort;
    this.getCompanyTypeMst(
      sort.active,
      sort.direction != '' ? sort.direction : 'asc'
    );
  }
  refreshOrAdvanceFlt(){
     this.__searchForm.patchValue({
      company_type:[]
     });
     this.__sortAscOrDsc = {active:'',direction:'asc'};
     this.getCompanyTypeMst(
      this.__sortAscOrDsc.active,
      this.__sortAscOrDsc.direction
    );
  }
}
