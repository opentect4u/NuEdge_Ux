import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, OnInit, ViewChild,Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { insComp } from 'src/app/__Model/insComp';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CmpCrudComponent } from '../cmp-crud/cmp-crud.component';

@Component({
  selector: 'app-cmp-rpt',
  templateUrl: './cmp-rpt.component.html',
  styleUrls: ['./cmp-rpt.component.css']
})
export class CmpRPTComponent implements OnInit {
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  toppings = new FormControl();
  toppingList: any = [
    { id: 'edit', text: 'Edit' },
    { id: 'delete', text: 'Delete' },
    { id: 'sl_no', text: 'Sl No' },
    { id: 'ins_type', text: 'Insurance Type'},
    { id: 'comp_full_name', text: 'Company Full name'},
    { id: 'comp_short_name', text: 'Company Short Name'},
    { id: 'website', text: 'Web Site' },
    { id: 'cus_care_whatsApp_no', text: 'Customer Care WhatsApp Number' },
    { id: 'cus_care_no', text: 'Customer Care Number' },
    { id: 'cus_care_email', text: 'Customer Care Email' },
    { id: 'head_ofc_contact_per', text: 'Head Office Contact Person' },
    {id: 'head_contact_per_mobile',text: 'Head Office Contact Person Mobile',},
    { id: 'head_contact_per_email', text: 'Head Office Contact Person Email' },
    { id: 'head_ofc_addr', text: 'Head Office Contact Person Address' },
    { id: 'local_ofc_contact_per', text: 'Local Office Contact Person' },
    {
      id: 'local_contact_per_mobile',
      text: 'Local Office Contact Person Mobile',
    },
    {
      id: 'local_contact_per_email',
      text: 'Local Office Contact Person Email',
    },
    {
      id: 'local_ofc_addr',
      text: 'Local Office Contact Person Address',
    },
    { id: 'login_url', text: 'Login URL'},
    { id: 'login_id', text: 'Login ID'},
    { id: 'login_pass', text: 'Login Password'},
  ];

  __isrntspinner: boolean = false;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __export = new MatTableDataSource<insComp>([]);
  __exportedClmns: string[] = [
    'sl_no',
    'ins_type',
    'comp_full_name',
    'comp_short_name',
    'website',
    'cus_care_whatsApp_no',
    'cus_care_no',
    'cus_care_email',
  ];
  __columnsForsummary: string[] = [
    'edit',
    'delete',
    'sl_no',
    'ins_type',
    'comp_full_name',
    'comp_short_name',
    'website',
    'cus_care_whatsApp_no',
    'cus_care_no',
    'cus_care_email',
  ];
  __columnsForDetails: string[] = [
    'edit',
    'delete',
    'sl_no',
    'ins_type',
    'comp_full_name',
    'comp_short_name',
    'website',
    'cus_care_whatsApp_no',
    'cus_care_no',
    'cus_care_email',
    'head_ofc_contact_per',
    'head_contact_per_mobile',
    'head_contact_per_email',
    'head_ofc_addr',
    'local_ofc_contact_per',
    'local_contact_per_mobile',
    'local_contact_per_email',
    'local_ofc_addr',
    'login_url',
    'login_id',
    'login_pass',
  ];
  __isVisible: boolean = true;
  __rntSearchForm = new FormGroup({
    ins_type: new FormControl(''),
    options: new FormControl('2'),
    comp_name: new FormControl(''),
    contact_person: new FormControl(''),
  });
  __selectRNT = new MatTableDataSource<insComp>([]);
  instTypeMst: any=[];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<CmpRPTComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.__columns = this.__columnsForsummary;
    this.toppings.setValue(this.__columns);
    this.getRntMst();
    this.getInstTypeMSt();

  }
  getInstTypeMSt(){
    this.__dbIntr.api_call(0,'/ins/type',null).pipe(pluck("data")).subscribe(res =>{
      this.instTypeMst = res;
   })
  }

  ngAfterViewInit() {
    this.__rntSearchForm.controls['options'].valueChanges.subscribe((res) => {
      if (res == '1') {
        this.__columns = this.__columnsForDetails;
        this.toppings.setValue(this.__columns);

        this.__exportedClmns = [
          'sl_no',
          'ins_type',
          'comp_short_name',
          'comp_full_name',
          'website',
         'cus_care_whatsApp_no',
          'cus_care_no',
          'cus_care_email',
          'head_ofc_contact_per',
          'head_contact_per_mobile',
          'head_contact_per_email',
          'head_ofc_addr',
          'local_ofc_contact_per',
          'local_contact_per_mobile',
          'local_contact_per_email',
          'local_ofc_addr',
          'login_url',
          'login_id',
          'login_pass',
        ];
      } else {
        this.__columns = this.__columnsForsummary;
        this.toppings.setValue(this.__columns);
        this.__exportedClmns = [
          'sl_no',
          'ins_type',
          'comp_short_name',
          'comp_full_name',
          'website',
          'cus_care_whatsApp_no',
          'cus_care_no',
          'cus_care_email',
        ];
      }
    });

    this.toppings.valueChanges.subscribe((res) => {
      const clm = ['edit', 'delete'];
      this.__columns = res;
      this.__exportedClmns = res.filter((item) => !clm.includes(item));
    });
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
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getRntMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url
          + ('&paginate=' + this.__pageNumber.value)
          +  ('&comp_name = ' + this.__rntSearchForm.value.comp_name ? this.__rntSearchForm.value.comp_name : '')
          +  ('&contact_person=' + this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person : '')
          +  ('&column_name=' + this.__sortAscOrDsc.active ? this.__sortAscOrDsc.active : '')
          +  ('&sort_by=' + this.__sortAscOrDsc.direction ? this.__sortAscOrDsc.direction : 'asc')
          +  ('&ins_type_id=' + this.__rntSearchForm.value.ins_type? this.__rntSearchForm.value.ins_type : '')
          )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  private updateRow(row_obj: insComp) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: insComp, key) => {
      if (value.id == row_obj.id) {
        value.comp_short_name = row_obj.comp_short_name;
        value.comp_full_name = row_obj.comp_full_name;
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
      }
      return true;
    });
    this.__export.data = this.__export.data.filter((value: insComp, key) => {
      if (value.id == row_obj.id) {
        value.comp_full_name = row_obj.comp_full_name;
        value.comp_short_name = row_obj.comp_short_name;
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
      }
      return true;
    });
    // console.log( this.__export.data);

  }
  submit() {this.getRntMst();}
  getRntMst(column_name: string | null = null, sort_by: string | null = null) {
    console.log(sort_by);

    const __amcSearch = new FormData();
    __amcSearch.append(
      'comp_name',
      this.__rntSearchForm.value.comp_name ? this.__rntSearchForm.value.comp_name : ''
    );
    __amcSearch.append(
      'contact_person',
      this.__rntSearchForm.value.contact_person
        ? this.__rntSearchForm.value.contact_person
        : ''
    );
    __amcSearch.append('paginate', this.__pageNumber.value);
    __amcSearch.append('column_name', (column_name ? column_name : ''));
    __amcSearch.append('sort_by', (sort_by ? sort_by : 'asc'));
    __amcSearch.append('ins_type_id', this.__rntSearchForm.value.ins_type
                        ? this.__rntSearchForm.value.ins_type
                        : '');

    this.__dbIntr
      .api_call(1, '/ins/companyDetailSearch', __amcSearch)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
        this.tableExport(column_name, sort_by);
      });
  }

  tableExport(
    column_name: string | null = null,
    sort_by: string | null = null
  ) {
    console.log(column_name);
    console.log(sort_by);
    const __amcExport = new FormData();
    __amcExport.append(
      'comp_name',
      this.__rntSearchForm.value.comp_name ? this.__rntSearchForm.value.comp_name : ''
    );
    __amcExport.append(
      'contact_person',
      this.__rntSearchForm.value.contact_person
    );
    __amcExport.append('column_name', (column_name ? column_name : ''));
    __amcExport.append('sort_by', (sort_by ? sort_by : 'asc'));
    __amcExport.append('ins_type_id', this.__rntSearchForm.value.ins_type
                        ? this.__rntSearchForm.value.ins_type
                        : '');
    this.__dbIntr
      .api_call(1, '/ins/companyExport', __amcExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: insComp[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  exportPdf() {
    this.__Rpt.downloadReport(
      '#comp_rpt',
      {
        title: 'Company',
      },
      'Company'
    );
  }
  populateDT(__items: insComp) {
    this.openDialog(__items, __items.id);
  }

  openDialog(__cmp: insComp | null = null, __id: number) {
    console.log(__cmp);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'CMP',
      id: __id,
      cmp: __cmp,
      title: __id == 0 ? 'Add Company' : 'Update Company',
      product_id: this.data.product_id,
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CmpCrudComponent,
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
  private addRow(row_obj: insComp) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
    this.__export.data.unshift(row_obj);
    this.__export._updateChangeSubscription();
  }
  reset() {
    this.__rntSearchForm.patchValue({
      options: '2',
      comp_name: '',
      comp_id: '',
      contact_person: '',
      ins_type:''
    });
    this.getRntMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);

  }
  sortData(sort: any) {
    console.log(sort);

    this.__sortAscOrDsc  = sort;
    this.getRntMst(sort.active, sort.direction == '' ? 'asc' : sort.direction);
  }
  delete(__el,index){
    console.log(__el);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      flag: 'CMP',
      id: __el.id,
      title: 'Delete '  + __el.com_short_name,
      api_name:'/ins/companyDelete'
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
}
