import { Overlay } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  map,
  pluck
} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { RntModificationComponent } from '../rntModification/rntModification.component';
import { rntClmns } from 'src/app/__Utility/Master/rntClmns';
import { sort } from 'src/app/__Model/sort';
import { LazyLoadEvent } from 'primeng/api';
import { environment } from 'src/environments/environment';
import itemsPerPage from '../../../../../../assets/json/itemsPerPage.json';

@Component({
  selector: 'Rnt-rntRpt',
  templateUrl: './rntRpt.component.html',
  styleUrls: ['./rntRpt.component.css'],
})
export class RntrptComponent implements OnInit {
  itemsPerPage=itemsPerPage;
  url = environment.commonURL + 'rnt-logo/';
  sort = new sort();
  isOpenMegaMenu: boolean = false;
  settingsforRNT = this.__utility.settingsfroMultiselectDropdown("id","rnt_name","Search R&T",4);
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  columnsMst = rntClmns.DETAILS;
  SelectedClms: any=[];
  __isrntspinner: boolean = false;
  __paginate: any = [];
  __pageNumber = new FormControl('10');
  __columns: any = [];
  __export = new MatTableDataSource<rnt>([]);
  __exportedClmns: string[] = [];
  __isVisible: boolean = true;
  __rntSearchForm = new FormGroup({
    options: new FormControl('2'),
    rnt_id: new FormControl([]),
    contact_person: new FormControl(''),
  });
  __selectRNT = new MatTableDataSource<rnt>([]);
  __rntMstForDrpDown: rnt[]=[];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RntrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.getRntMstForDrpDown();
    this.setColumnsforRNT(this.__rntSearchForm.value.options)
  }

  setColumnsforRNT(res){
         const clmsToRemove = ['edit','delete','logo'];
         const columns = res == '2' ? rntClmns.SUMMARY : rntClmns.DETAILS;
         this.__columns =columns;
         this.SelectedClms = this.__columns.map((x) => x.field);
         this.__exportedClmns = columns.map(({field,header}) =>field).filter(x => !clmsToRemove.includes(x));
  }

  getRntMstForDrpDown(){
    this.__dbIntr.api_call(0,'/rnt',null).pipe(pluck("data")).subscribe((res: rnt[]) =>{
      this.__rntMstForDrpDown = res;
    })
  }
  ngAfterViewInit() {
    this.__rntSearchForm.controls['options'].valueChanges.subscribe((res) => {
      this.setColumnsforRNT(res);
    });
  }
  setColumns(res){
    const clm = ['edit', 'delete','logo'];
    this.__columns = res;
    this.__exportedClmns = res.filter((item) => !clm.includes(item));
  }

  private setPaginator(__res) {
    this.__selectRNT = new MatTableDataSource(__res);
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
  onselectItem(ev){
    // this.__pageNumber.setValue(ev.option.id);
    this.getRntMst();
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          +  ('&rnt_id = ' + JSON.stringify(this.__rntSearchForm.value.rnt_id.map(item => {return item["id"]})))
          +  ('&contact_person=' + this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person : '')
          +  ('&field=' + global.getActualVal(this.sort.field) ? this.sort.field : '')
          +  ('&order=' + global.getActualVal(this.sort.order) ? this.sort.order : '1')
          )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  private updateRow(row_obj: rnt) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: rnt, key) => {
      if (value.id == row_obj.id) {
        value.rnt_name = row_obj.rnt_name;
        value.rnt_full_name = row_obj.rnt_full_name;
        value.login_url = row_obj.login_url;
        value.login_pass = row_obj.login_pass;
        value.login_id = row_obj.login_id;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;
        value.id = row_obj.id;
        value.head_ofc_contact_per = row_obj.head_ofc_contact_per;
        value.head_contact_per_mob = row_obj.head_contact_per_mob;
        value.head_contact_per_email = row_obj.head_contact_per_email;
        value.head_ofc_addr = row_obj.head_ofc_addr;
        value.local_ofc_contact_per = row_obj.local_ofc_contact_per;
        value.local_contact_per_mob = row_obj.local_contact_per_mob;
        value.local_contact_per_email = row_obj.local_contact_per_email;
        value.local_ofc_addr = row_obj.local_ofc_addr;
        value.security_qus_ans = row_obj.security_qus_ans;
        value.gstin = row_obj.gstin;
        value.cus_care_whatsapp_no = row_obj.cus_care_whatsapp_no;
        value.distributor_care_email = row_obj.distributor_care_email;
        value.distributor_care_no = row_obj.distributor_care_no;
        value.l1_name = row_obj.l1_name;
        value.l1_email = row_obj.l1_email;
        value.l1_contact_no = row_obj.l1_contact_no;
        value.l2_name = row_obj.l2_name;
        value.l2_email = row_obj.l2_email;
        value.l2_contact_no = row_obj.l2_contact_no;
        value.l3_name = row_obj.l3_name;
        value.l3_email = row_obj.l3_email;
        value.l3_contact_no = row_obj.l3_contact_no;
        value.l4_name = row_obj.l4_name;
        value.l4_email = row_obj.l3_email;
        value.l4_contact_no = row_obj.l4_contact_no;
        value.l5_name = row_obj.l5_name;
        value.l5_email = row_obj.l5_email;
        value.l5_contact_no = row_obj.l5_contact_no;
        value.l6_name = row_obj.l6_name;
        value.l6_email = row_obj.l6_email;
        value.l6_contact_no = row_obj.l6_contact_no;
        value.logo =  row_obj.logo
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: rnt, key) => {
      if (value.id == row_obj.id) {
        value.rnt_name = row_obj.rnt_name;
        value.rnt_full_name = row_obj.rnt_full_name;
        value.login_url = row_obj.login_url;
        value.login_pass = row_obj.login_pass;
        value.login_id = row_obj.login_id;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;
        value.id = row_obj.id;
        value.head_ofc_contact_per = row_obj.head_ofc_contact_per;
        value.head_contact_per_mob = row_obj.head_contact_per_mob;
        value.head_contact_per_email = row_obj.head_contact_per_email;
        value.head_ofc_addr = row_obj.head_ofc_addr;
        value.local_ofc_contact_per = row_obj.local_ofc_contact_per;
        value.local_contact_per_mob = row_obj.local_contact_per_mob;
        value.local_contact_per_email = row_obj.local_contact_per_email;
        value.local_ofc_addr = row_obj.local_ofc_addr;
        value.security_qus_ans = row_obj.security_qus_ans;
        value.gstin = row_obj.gstin;
        value.cus_care_whatsapp_no = row_obj.cus_care_whatsapp_no;
        value.distributor_care_email = row_obj.distributor_care_email;
        value.distributor_care_no = row_obj.distributor_care_no;
        value.l1_name = row_obj.l1_name;
        value.l1_email = row_obj.l1_email;
        value.l1_contact_no = row_obj.l1_contact_no;
        value.l2_name = row_obj.l2_name;
        value.l2_email = row_obj.l2_email;
        value.l2_contact_no = row_obj.l2_contact_no;
        value.l3_name = row_obj.l3_name;
        value.l3_email = row_obj.l3_email;
        value.l3_contact_no = row_obj.l3_contact_no;
        value.l4_name = row_obj.l4_name;
        value.l4_email = row_obj.l3_email;
        value.l4_contact_no = row_obj.l4_contact_no;
        value.l5_name = row_obj.l5_name;
        value.l5_email = row_obj.l5_email;
        value.l5_contact_no = row_obj.l5_contact_no;
        value.l6_name = row_obj.l6_name;
        value.l6_email = row_obj.l6_email;
        value.l6_contact_no = row_obj.l6_contact_no;
        value.logo = row_obj.logo
      }
      return true;
    });
  }
  submit() {this.getRntMst();}
  getRntMst() {
    const __rntSearch = new FormData();
    __rntSearch.append(
      'rnt_id',
      JSON.stringify(this.__rntSearchForm.value.rnt_id.map(item => {return item["id"]}))
    );
    __rntSearch.append('contact_person',this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person: '');
    __rntSearch.append('paginate', this.__pageNumber.value);
    __rntSearch.append('field', (global.getActualVal(this.sort.field) ? this.sort.field : ''));
    __rntSearch.append('order', (global.getActualVal(this.sort.order) ? this.sort.order : '1'));
    this.__dbIntr
      .api_call(1, '/rntDetailSearch', __rntSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(__rntSearch);
      });
  }

  tableExport(__rntExport: FormData) {
    __rntExport.delete('paginate');
    this.__dbIntr
      .api_call(1, '/rntExport', __rntExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: rnt[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  exportPdf() {
    this.__Rpt.downloadReport(
      '#rnt_rpt',
      {
        title: 'R&T -' + new Date().toLocaleDateString(),
      },
      'R&T',
      'l',
      this.__rntSearchForm.value.options == 1 ? [3000,792] : [],
      this.__exportedClmns.length
    );
  }
  populateDT(__items: rnt) {
    this.openDialog(__items, __items.id);
  }

  openDialog(__rnt: rnt | null = null, __rntId: number) {
    console.log(__rnt);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'R',
      id: __rntId,
      __rnt: __rnt,
      title: __rntId == 0 ? 'Add R&T' : 'Update R&T',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __rntId > 0 ? __rntId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        RntModificationComponent,
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
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'R',
      });
    }
  }
  private addRow(row_obj: rnt) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
    this.__export.data.unshift(row_obj);
    this.__export._updateChangeSubscription();
  }
  reset() {
    this.__rntSearchForm.patchValue({
      options: '2',
      rnt_id: [],
      contact_person: '',
    });
    this.sort = new sort();
    this.getRntMst();

  }
  delete(__el,index){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      flag: 'R',
      id: __el.id,
      title: 'Delete '  + __el.rnt_name,
      api_name:'/rntDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectRNT.data.splice(index,1);
          this.__selectRNT._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
          this.__export._updateChangeSubscription();
        }
      }

    })
  }
  openAmc(__rnt){
    this.dialogRef.close();
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/amc',{queryParams:{product_id:btoa(this.data.product_id),id:btoa(__rnt.id)}});
  }
  getSelectedColumns(columns){
    const clm = ['edit', 'delete'];
    this.__columns = columns.map(({ field, header }) => ({field, header}));
    this.__columns.filter((x: any) => !clm.includes(x.field)).map((x: any) => x.field);
  }
  customSort(ev:LazyLoadEvent){
    this.sort.field = ev.sortField;
    this.sort.order = ev.sortOrder;
     this.getRntMst();
  }
  openURL(url){
    window.open('//' + url,'__blank');
  }
}
