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
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { rnt } from 'src/app/__Model/Rnt';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { RntModificationComponent } from '../rntModification/rntModification.component';

@Component({
  selector: 'Rnt-rntRpt',
  templateUrl: './rntRpt.component.html',
  styleUrls: ['./rntRpt.component.css'],
})
export class RntrptComponent implements OnInit {
  __sortAscOrDsc: any= {active:'',direction:'asc'};
  toppings = new FormControl();
  toppingList: any = [
    { id: 'edit', text: 'Edit' },
    { id: 'delete', text: 'Delete' },
    { id: 'sl_no', text: 'Sl No' },
    { id: 'rnt_name', text: 'R&T Short name'},
    { id: 'rnt_full_name', text: 'R&T Full Name'},
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
  __rntMst: rnt[] = [];
  @ViewChild('searchRnt') __searchRnt: ElementRef;

  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: string[] = [];
  __export = new MatTableDataSource<rnt>([]);
  __exportedClmns: string[] = [
    'sl_no',
    'rnt_name',
    'rnt_full_name',
    'website',
    'cus_care_whatsApp_no',
    'cus_care_no',
    'cus_care_email',
  ];
  __columnsForsummary: string[] = [
    'edit',
    'delete',
    'sl_no',
    'rnt_name',
    'rnt_full_name',
    'website',
    'cus_care_whatsApp_no',
    'cus_care_no',
    'cus_care_email',
  ];
  __columnsForDetails: string[] = [
    'edit',
    'delete',
    'sl_no',
    'rnt_name',
    'rnt_full_name',
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
    options: new FormControl('2'),
    rnt_name: new FormControl(''),
    rnt_id: new FormControl(''),
    contact_person: new FormControl(''),
  });
  __selectRNT = new MatTableDataSource<rnt>([]);
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<RntrptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.__columns = this.__columnsForsummary;
    this.toppings.setValue(this.__columns);
    this.getRntMst();
  }

  ngAfterViewInit() {
    this.__rntSearchForm.controls['rnt_name'].valueChanges
      .pipe(
        tap(() => (this.__isrntspinner = true)),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((dt) =>
          dt?.length > 1 ? this.__dbIntr.searchItems('/rnt', dt) : []
        ),
        map((x: responseDT) => x.data)
      )
      .subscribe({
        next: (value) => {
          this.__rntSearchForm.get('rnt_id').setValue('');
          this.__rntMst = value;
          this.searchResultVisibility('block', 'R');
          this.__isrntspinner = false;
        },
        error: (err) => this.__isrntspinner = false,
      });
    this.__rntSearchForm.controls['options'].valueChanges.subscribe((res) => {
      if (res == '1') {
        this.__columns = this.__columnsForDetails;
        this.toppings.setValue(this.__columns);

        this.__exportedClmns = [
          'sl_no',
          'rnt_name',
          'rnt_full_name',
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
          'rnt_name',
          'rnt_full_name',
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
  outsideClick(__ev, __mode) {
    if (__ev) {
      this.searchResultVisibility('none', __mode);
    }
  }
  searchResultVisibility(display_mode, __mode) {
    this.__searchRnt.nativeElement.style.display = display_mode;
  }

  getItems(__rnt, __type) {
        this.__rntSearchForm.controls['rnt_id'].setValue(__rnt.id);
        this.__rntSearchForm.controls['rnt_name'].reset(__rnt.rnt_name, {
          onlySelf: true,
          emitEvent: false,
        });
        this.searchResultVisibility('none', 'R');
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
          +  ('&rnt_id = ' + this.__rntSearchForm.value.rnt_id ? this.__rntSearchForm.value.rnt_id : '')
          +  ('&contact_person=' + this.__rntSearchForm.value.contact_person? this.__rntSearchForm.value.contact_person : '')
          +  ('&column_name=' + this.__sortAscOrDsc.active ? this.__sortAscOrDsc.active : '')
          +  ('&sort_by=' + this.__sortAscOrDsc.direction ? this.__sortAscOrDsc.direction : 'asc')

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
      'rnt_id',
      this.__rntSearchForm.value.rnt_id ? this.__rntSearchForm.value.rnt_id : ''
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
    this.__dbIntr
      .api_call(1, '/rntDetailSearch', __amcSearch)
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
      'rnt_id',
      this.__rntSearchForm.value.rnt_id ? this.__rntSearchForm.value.rnt_id : ''
    );
    __amcExport.append(
      'contact_person',
      this.__rntSearchForm.value.contact_person
    );
    __amcExport.append('column_name', (column_name ? column_name : ''));
    __amcExport.append('sort_by', (sort_by ? sort_by : 'asc'));

    this.__dbIntr
      .api_call(1, '/rntExport', __amcExport)
      .pipe(map((x: any) => x.data))
      .subscribe((res: rnt[]) => {
        this.__export = new MatTableDataSource(res);
      });
  }
  exportPdf() {
    this.__Rpt.downloadReport(
      '#rnt_rpt',
      {
        title: 'R&T ',
      },
      'R&T'
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
      rnt_name: '',
      rnt_id: '',
      contact_person: '',
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
}
