import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RntModificationComponent } from './rntModification/rntModification.component';
import { RntrptComponent } from './rntRpt/rntRpt.component';

@Component({
  selector: 'master-RNT',
  templateUrl: './RNT.component.html',
  styleUrls: ['./RNT.component.css'],
})
export class RNTComponent implements OnInit {
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '/main/master/rntmodify',
      icon: '',
      id: 3,
      flag: 'M',
    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: 'main/master/productwisemenu/rnt/rntUpload',
      icon: '',
      id: 15,
      flag: 'U',
    },
    {
      parent_id: 4,
      menu_name: 'Reports',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 0,
      flag: 'R',
    },
  ];
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __columns: string[] = ['sl_no', 'rnt_name', 'cus_care_no', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<rnt>([]);
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute
  ) {}
  ngOnInit() {
    // console.log(this.__rtDt.snapshot.queryParamMap.get('id'));
    if (this.__rtDt.snapshot.queryParamMap.get('id')) {
      this.getParticularRNt(atob(this.__rtDt.snapshot.queryParamMap.get('id')));
    }
    this.getRNTmaster();
  }

  getParticularRNt(__id) {
    this.__dbIntr
      .api_call(0, '/rnt', 'id=' + __id)
      .pipe(map((x: any) => x.data))
      .subscribe((res) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }

  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    } else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    } else {
      this.getRNTmaster();
    }
  }
  populateDT(__items: rnt) {
    console.log(__items);
    // this.__utility.navigatewithqueryparams('/main/master/rntmodify',{queryParams:{id:btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  private getRNTmaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/rnt', 'paginate=' + __paginate)
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  private setPaginator(__res) {
    this.__selectRNT = new MatTableDataSource(__res);
  }
  showCorrospondingAMC(__rntDtls) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/amc', {
      queryParams: { id: btoa(__rntDtls.id.toString()) },
    });
  }
  openDialog(__rnt: rnt | null = null, __rntId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    // dialogConfig.height = "100%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'R',
      id: __rntId,
      __rnt: __rnt,
      title: __rntId == 0 ? 'Add R&T' : 'Update R&T',
      product_id:this.__rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '',
      right: this.randomIntFromInterval(1, 60),
    };
     console.log(__rntId);

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
      console.log(ex);

      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'R',
      });
    }
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private updateRow(row_obj: rnt) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: rnt, key) => {
      if (value.id == row_obj.id) {
        value.rnt_name = row_obj.rnt_name;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email;
        value.id = row_obj.id;
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
  private addRow(row_obj: rnt) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
  }
  navigate(__menu) {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate(__menu.url);
        break;
        case 'R':
               this.openDialogForReport(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')))
          break;
      default:
        break;
    }
  }
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getRNTmaster(this.__pageNumber.value);
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
  openDialogForReport(__rnt_id: string | null = null,amc_id: string | null = null){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "A",
    dialogConfig.data = {
      rnt_id:__rnt_id,
      product_id:this.__rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '',
    }
    try {
      const dialogref = this.__dialog.open(
        RntrptComponent,
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
