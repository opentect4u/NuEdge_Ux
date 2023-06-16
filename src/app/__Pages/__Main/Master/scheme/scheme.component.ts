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
      label:"Mutual Fund",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:''
    },
    {
      label:"Scheme",
      url:'/main/master/productwisemenu/scheme',
      hasQueryParams:true,
      queryParams:''
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
      menu_name: 'Upload CSV',
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
    {
      parent_id: 4,
      menu_name: 'ISIN',
      has_submenu: 'N',
      url: 'main/master/productwisemenu/scheme/isin',
      icon: '',
      id: 0,
      flag: 'I',
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
        // this.__utility.getBreadCrumb(this.__brdCrmbs);

    // this.getSchememaster();
    if (
      this.__rtDt.snapshot.queryParamMap.get('id') &&
      this.__rtDt.snapshot.queryParamMap.get('flag')
    ) {
      this.getParticularScheme();
    }
    if(this.__rtDt.snapshot.queryParamMap.get('amc_id')){
      this.opendialogForReports(
        '1',/**For Mutual Fund */
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
      product_id:'1',
      scheme_type: __scmType,
    };
    dialogConfig.id = __scmType + (__scmId > 0 ? '_'+__scmId.toString() : '_0');
    try {
      const dialogref = this.__dialog.open(
        ScmModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
      });
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SC',
      });
    }
  }

  navigate(__menu) {
    console.log(__menu.url);

    switch (__menu.flag) {
      case 'I':
      case 'U':
        this.__utility.navigate(__menu.url);
        // this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}});
        break;
        case 'R':
          this.opendialogForReports('1');
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
}
