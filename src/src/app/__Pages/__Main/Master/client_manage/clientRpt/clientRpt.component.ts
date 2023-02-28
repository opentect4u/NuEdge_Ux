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
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ClModifcationComponent } from '../clModifcation/clModifcation.component';

@Component({
  selector: 'app-clientRpt',
  templateUrl: './clientRpt.component.html',
  styleUrls: ['./clientRpt.component.css'],
})
export class ClientRptComponent implements OnInit {
  __isVisible: boolean = false;
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __selectClient = new MatTableDataSource<client>([]);
  __export = new MatTableDataSource<client>([]);
  __exportedClmns: string[] = [
    'sl_no',
    'cl_code',
    'cl_name',
    'pan',
    'mobile',
    'email',
  ];
  __columns: string[] = [];

  __columnsForsummary: string[] = [
    'edit',
    'sl_no',
    'cl_code',
    'cl_name',
    'pan',
    'mobile',
    'email',
    'delete',
  ];
  __columnsForDetails: string[] = [
    'edit',
    'sl_no',
    'cl_code',
    'cl_name',
    'pan',
    'dob',
    'dob_actual',
    'guar_pan',
    'guar_name',
    'relation',
    'mobile',
    'alt_mobile',
    'email',
    'alt_email',
    'addr_1',
    'addr_2',
    'state',
    'dist',
    'city',
    'pincode',
    'delete',
  ];
  __clientForm = new FormGroup({
    pan: new FormControl(''),
    name: new FormControl(''),
    dob: new FormControl(''),
    mobile: new FormControl(''),
    state: new FormControl(''),
    dist: new FormControl(''),
    city: new FormControl(''),
    options: new FormControl('2'),
    advanceFlt: new FormControl(''),
  });
  constructor(
    private __Rpt: RPTService,
    public dialogRef: MatDialogRef<ClientRptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}

  ngOnInit() {
    this.getClientMaster();
    this.__columns = this.__columnsForsummary;
    this.tableExport();
  }
  tableExport() {
    const __client = new FormData();
    __client.append('pan', this.__clientForm.value.pan);
    __client.append('client_name', this.__clientForm.value.name);
    __client.append('dob', this.__clientForm.value.dob);
    __client.append('mobile', this.__clientForm.value.mobile);
    __client.append('state', this.__clientForm.value.state);
    __client.append('dist', this.__clientForm.value.dist);
    __client.append('city', this.__clientForm.value.city);
    __client.append('pincode', this.__clientForm.value.pincode);
    this.__dbIntr
      .api_call(1, '/clientExport', __client)
      .pipe(map((x: any) => x.data))
      .subscribe((res: client[]) => {
        console.log(res);
        this.__export = new MatTableDataSource(res);
      });
  }

  ngAfterViewInit() {
    this.__clientForm.controls['options'].valueChanges.subscribe((res) => {
      if (res == '1') {
        this.__columns = this.__columnsForDetails;
        this.__exportedClmns = [
          'sl_no',
          'cl_code',
          'cl_name',
          'pan',
          'dob',
          'dob_actual',
          'guar_pan',
          'guar_name',
          'relation',
          'mobile',
          'alt_mobile',
          'email',
          'alt_email',
          'addr_1',
          'addr_2',
          'state',
          'dist',
          'city',
          'pincode',
        ];
      } else {
        this.__columns = this.__columnsForsummary;
        this.__exportedClmns = [
          'sl_no',
          'cl_code',
          'cl_name',
          'pan',
          'mobile',
          'email',
        ];
      }
    });
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getClientMaster(this.__pageNumber.value);
  }
  getClientMaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(
        0,
        '/client',
        'client_type=' + this.data.client_type + '&paginate=' + __paginate
      )
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        console.log(res);

        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  setPaginator(__res) {
    this.__selectClient = new MatTableDataSource(__res);
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
      '#client',
      {
        title: 'Client',
      },
      'Client'
    );
  }
  submit() {}
  refreshOrAdvanceFlt() {
    this.getClientMaster();
    this.tableExport();
  }
  populateDT(__items) {
    this.openDialog(__items, __items.id, __items.client_type);
  }
  openDialog(__clDtls: client, __clid: number, __clType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'CL',
      id: __clid,
      items: __clDtls,
      title:
        (__clid == 0 ? 'Add ' : 'Update ') +
        (__clType == 'M'
          ? 'Minor'
          : __clType == 'P'
          ? 'PAN Holder'
          : __clType == 'N'
          ? 'Non Pan Holder'
          : 'Existing'),
      right: global.randomIntFromInterval(1, 60),
      cl_type: __clType,
    };
    dialogConfig.id = __clid > 0 ? __clid.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ClModifcationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            if (dt.cl_type == 'E') {
              this.__selectClient.data.splice(
                this.__selectClient.data.findIndex(
                  (x: client) => x.id == dt.id
                ),
                1
              );
              this.__export.data.splice(
                this.__export.data.findIndex((x: client) => x.id == dt.id),
                1
              );
              this.__selectClient._updateChangeSubscription();
              this.__export._updateChangeSubscription();
            } else {
              // this.updateRow(dt.data);
            }
          } else {
            this.__selectClient.data.unshift(dt.data);
            this.__selectClient._updateChangeSubscription();
            this.__export.data.unshift(dt.data);
            this.__export._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'CL',
      });
    }
  }
}
