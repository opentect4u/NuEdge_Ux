import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ScmModificationComponent } from './scmModification/scmModification.component';
import { ScmRptComponent } from './scmRpt/scmRpt.component';
import { breadCrumb } from 'src/app/__Model/brdCrmb';

@Component({
  selector: 'master-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css'],
})
export class SchemeComponent implements OnInit {
   __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Master",
      url:'/main/master/products',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1' ?  "Mutual Fund" : "Others",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:{id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Scheme",
      url:'/main/master/productwisemenu/scheme',
      hasQueryParams:true,
      queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
  __paginate: any = [];
  __pageNumber = new FormControl(10);

  __menu = [
    {
      parent_id: 4,
      menu_name: 'Ongoing Scheme',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 32,
      flag: 'O',
    },
    {
      parent_id: 4,
      menu_name: 'NFO',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 21,
      flag: 'N',
    },
    {
      parent_id: 4,
      menu_name: 'Upload Csv',
      has_submenu: 'N',
      url: 'main/master/productwisemenu/scheme/uploadScm',
      icon: '',
      id: 21,
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

  __columns: string[] = ['sl_no', 'scm_name', 'scm_type', 'edit', 'delete'];
  __selectScheme = new MatTableDataSource<scheme>([]);
  constructor(
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute,
    private overlay: Overlay
  ) {}
  ngOnInit(): void {
        this.__utility.getBreadCrumb(this.__brdCrmbs);

    // this.getSchememaster();
    // if (
    //   this.__rtDt.snapshot.queryParamMap.get('id') &&
    //   this.__rtDt.snapshot.queryParamMap.get('flag')
    // ) {
    //   this.getParticularScheme();
    // }
    if(this.__rtDt.snapshot.queryParamMap.get('amc_id')){
      this.opendialogForReports(
        atob(this.__rtDt.snapshot.queryParamMap.get('product_id')),
        atob(this.__rtDt.snapshot.queryParamMap.get('amc_id'))
        )
    }
  }
  getParticularScheme() {
    this.__dbIntr
      .api_call(
        0,
        '/scheme',
        'id=' +
          atob(this.__rtDt.snapshot.queryParamMap.get('id')) +
          '&flag=' +
          atob(this.__rtDt.snapshot.queryParamMap.get('flag'))
      )
      .pipe(pluck('data'))
      .subscribe((res: scheme[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id, res[0].scheme_type);
        }
      });
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    } else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    } else {
      this.getSchememaster();
    }
  }
  populateDT(__items: scheme) {
    this.openDialog(__items, __items.id, __items.scheme_type);
    // this.__utility.navigatewithqueryparams('/main/master/scmModify',{queryParams:{id:btoa(__items.id.toString()),flag:btoa(__items.scheme_type)}});
  }
  getSchememaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/scheme', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }

  setPaginator(__res) {
    this.__selectScheme = new MatTableDataSource(__res);
  }
  openDialog(
    __scheme: scheme | null = null,
    __scmId: number,
    __scmType: string
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SC',
      id: __scmId,
      items: __scheme,
      title: __scmId == 0 ? 'Add Scheme' : 'Update Scheme',
      right: global.randomIntFromInterval(1, 60),
      product_id:this.__rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '',
      scheme_type: __scmType,
    };
    dialogConfig.id = __scmType + (__scmId > 0 ? '_'+__scmId.toString() : '_0');
    try {
      const dialogref = this.__dialog.open(
        ScmModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectScheme.data.unshift(dt.data);
            this.__selectScheme._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SC',
      });
    }
  }
  updateRow(row_obj: scheme) {
    this.__selectScheme.data = this.__selectScheme.data.filter(
      (value: scheme, key) => {
        if (value.id == row_obj.id) {
          (value.product_id = row_obj.product_id),
            (value.amc_id = row_obj.amc_id),
            (value.category_id = row_obj.category_id),
            (value.subcategory_id = row_obj.subcategory_id),
            (value.scheme_name = row_obj.scheme_name),
            (value.id = row_obj.id),
            (value.scheme_type = row_obj.scheme_type),
            (value.nfo_start_dt = row_obj.nfo_start_dt),
            (value.nfo_end_dt = row_obj.nfo_end_dt),
            (value.nfo_reopen_dt = row_obj.nfo_reopen_dt),
            (value.pip_fresh_min_amt = row_obj.pip_fresh_min_amt),
            (value.sip_fresh_min_amt = row_obj.sip_fresh_min_amt),
            (value.pip_add_min_amt = row_obj.pip_add_min_amt),
            (value.sip_add_min_amt = row_obj.sip_add_min_amt),
            (value.sip_date = row_obj.sip_date),
            (value.sip_freq_wise_amt = row_obj.sip_freq_wise_amt),
            (value.gstin_no = row_obj.gstin_no);
            (value.stp_date = row_obj.stp_date);
            (value.swp_date = row_obj.swp_date);
            (value.swp_freq_wise_amt = row_obj.swp_freq_wise_amt);
            (value.stp_freq_wise_amt = row_obj.stp_freq_wise_amt);
        }
        return true;
      }
    );
  }
  navigate(__menu) {
    switch (__menu.flag) {
      case 'U':
        // this.__utility.navigate(__menu.url);
        this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}});
        break;
        case 'R':
          this.opendialogForReports(atob(this.__rtDt.snapshot.queryParamMap.get('product_id')));
          break;
      default:
        this.openDialog(null, 0, __menu.flag);
        break;
    }
  }


   opendialogForReports(__prdId,amc_id: string | null = null){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "SC",
    dialogConfig.data = {
      flag:"SC",
      product_id:__prdId,
      amc_id: amc_id
    }
    try {
      const dialogref = this.__dialog.open(
        ScmRptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prdId,
        flag:"SC"
      });
    }
   }



  getval(__paginate) {
    this.__pageNumber.setValue(__paginate);
    this.getSchememaster(__paginate);
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
}
