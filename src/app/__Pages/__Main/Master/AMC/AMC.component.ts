import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { AmcModificationComponent } from './amcModification/amcModification.component';
import { AmcrptComponent } from './amcRpt/amcRpt.component';

@Component({
  selector: 'app-AMC',
  templateUrl: './AMC.component.html',
  styleUrls: ['./AMC.component.css'],
})
export class AMCComponent implements OnInit {
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 16,
      flag: 'M',
    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: '/main/master/productwisemenu/amc/amcUpload',
      icon: '',
      id: 17,
      flag: 'U',
    },
    {
      parent_id: 4,
      menu_name: 'Reports',
      has_submenu: 'N',
      url: '/main/master/productwisemenu/amc/amcRpt',
      icon: '',
      id: 17,
      flag: 'R',
    },
  ];

  __columns: string[] = ['sl_no', 'amc_name', 'edit', 'delete'];
  __selectAMC = new MatTableDataSource<amc>([]);
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // if (this.route.snapshot.queryParamMap.get('amc_id')) {
    //   this.getParticularAMCMaster();
    // }
    // this.getAMCMaster(
    //   this.route.snapshot.queryParamMap.get('id') == null
    //     ? ''
    //     : '&rnt_id=' + atob(this.route.snapshot.queryParamMap.get('id'))
    // );
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    } else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    } else {
      this.getAMCMaster(
        this.route.snapshot.queryParamMap.get('id') == null
          ? ''
          : '&rnt_id=' + atob(this.route.snapshot.queryParamMap.get('id'))
      );
    }
  }

  getParticularAMCMaster() {
    this.__dbIntr
      .api_call(
        0,
        '/amc',
        'id=' + atob(this.route.snapshot.queryParamMap.get('amc_id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }

  populateDT(__items: amc) {
    // this.__utility.navigatewithqueryparams('/main/master/amcModify',{queryParams:{id: btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  private getAMCMaster(
    __params: string | null = null,
    __paginate: string | null = '10'
  ) {
    console.log(__params);

    this.__dbIntr
      .api_call(0, '/amc', 'paginate=' + __paginate + __params)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.__paginate = res.links;
        this.setPaginator(res.data);
      });
  }
  private setPaginator(__res) {
    this.__selectAMC = new MatTableDataSource(__res);
  }
  navigate(__items) {
    switch (__items.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate(__items.url);
        break;
      default: this.openDialogForReports(
        this.route.snapshot.queryParamMap.get('id'),
        this.route.snapshot.queryParamMap.get('amc_id')
      );
        break;
    }
  }
  openDialog(__amc: amc | null = null, __amcId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'A',
      id: __amcId,
      amc: __amc,
      title: __amcId == 0 ? 'Add AMC' : 'Update AMC',
      product_id:this.route.snapshot.queryParamMap.get('product_id') ? atob(this.route.snapshot.queryParamMap.get('product_id')) : '',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __amcId > 0 ? __amcId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        AmcModificationComponent,
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
        flag: 'A',
      });
    }
  }
  addRow(row_obj: amc) {
    this.__selectAMC.data.unshift(row_obj);
    this.__selectAMC._updateChangeSubscription();
  }
  updateRow(row_obj: amc) {
    this.__selectAMC.data = this.__selectAMC.data.filter((value: amc, key) => {
      if (value.id == row_obj.id) {
        value.amc_name = row_obj.amc_name;
        value.product_id = row_obj.product_id;
        value.rnt_id = row_obj.rnt_id;
        value.website = row_obj.website;
        value.sip_start_date = row_obj.sip_start_date;
        value.sip_end_date = row_obj.sip_end_date;

        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;

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
        value.gstin = row_obj.gstin;
        value.l5_name = row_obj.l5_name;
        value.l5_email = row_obj.l5_email;
        value.l5_contact_no = row_obj.l5_contact_no;

        value.l6_name = row_obj.l6_name;
        value.l6_email = row_obj.l6_email;
        value.l6_contact_no = row_obj.l6_contact_no;

        value.head_ofc_contact_per = row_obj.head_ofc_contact_per
        value.head_contact_per_mob = row_obj.head_contact_per_mob
        value.head_contact_per_email = row_obj.head_contact_per_email
        value.head_ofc_addr = row_obj.head_ofc_addr

        value.local_ofc_contact_per = row_obj.local_ofc_contact_per
        value.local_contact_per_mob = row_obj.local_contact_per_mob
        value.local_contact_per_email = row_obj.local_contact_per_email
        value.local_ofc_addr = row_obj.local_ofc_addr
      }
      return true;
    });
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate);
    this.getAMCMaster('', __paginate);
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
  openDialogForReports(__rnt_id: string | null = null,amc_id: string | null = null){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "R",
    dialogConfig.data = {
      amc_id:amc_id,
      rnt_id:__rnt_id
    }
    try {
      const dialogref = this.__dialog.open(
        AmcrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        amc_id:amc_id,
        rnt_id:__rnt_id
      });
    }

  }
}
