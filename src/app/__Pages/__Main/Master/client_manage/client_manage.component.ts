import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { client } from 'src/app/__Model/__clientMst';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { ClientRptComponent } from './clientRpt/clientRpt.component';
import { ClModifcationComponent } from './clModifcation/clModifcation.component';

@Component({
  selector: 'master-client_manage',
  templateUrl: './client_manage.component.html',
  styleUrls: ['./client_manage.component.css'],
})
export class Client_manageComponent implements OnInit {
  __brCembFrExisting = [
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operations',
      url: '/main/master/mstOperations',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Client Master',
      url: '/main/master/clntMstHome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Create Client Code',
      url: '/main/master/clOption',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label:
      atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'E' ? 'Existing'
      : atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'M' ? "Minor"
      : atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'P' ? 'Pan Holder' : 'Non Pan Holder',
      url: '/main/master/clientmaster',
      hasQueryParams: true,
      queryParams: {flag:this.__RtDT.snapshot.queryParamMap.get('flag')},
    }
  ]
  __brCembFrOthers = [
    {
      label: 'Home',
      url: '/main',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Master',
      url: '/main/master/products',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Operations',
      url: '/main/master/mstOperations',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Client Master',
      url: '/main/master/clntMstHome',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Create Client Code',
      url: '/main/master/clOption',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label: 'Add New',
      url: '/main/master/claddnew',
      hasQueryParams: false,
      queryParams: '',
    },
    {
      label:
      atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'E' ? 'Existing'
      : atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'M' ? "Minor"
      : atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'P' ? 'Pan Holder' : 'Non Pan Holder',
      url: '/main/master/clientmaster',
      hasQueryParams: true,
      queryParams: {flag:this.__RtDT.snapshot.queryParamMap.get('flag')},
    },
  ]
  __clType: string = atob(this.__RtDT.snapshot.queryParamMap.get('flag'));
  __paginate: any = [];
  __pageNumber = new FormControl(10);
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 36,
      flag: 'M',
      isvisible: atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'E' ? true : false
    },
    {
      parent_id: 4,
      menu_name: 'Reports',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 0,
      flag: 'R',
      isvisible: false

    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: 'main/master/clUploadCsv',
      icon: '',
      id: 35,
      flag: 'U',
      isvisible: atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'E' ? false : true
    },
    {
      parent_id: 4,
      menu_name: 'Auto Upload',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 35,
      flag: 'A',
      isvisible: false
    },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  __columns: string[] = [
    'sl_no',
    'cl_code',
    'cl_name',
    'cl_type',
    'pan',
    'mobile',
    'edit',
    'delete',
  ];
  __selectClients = new MatTableDataSource<client>([]);
  constructor(
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __RtDT: ActivatedRoute,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {
    console.log(atob(this.__RtDT.snapshot.queryParamMap.get('flag')));
  }
  ngOnInit() {
    // this.getClientMaster(atob(this.__RtDT.snapshot.queryParamMap.get('flag')));
    this.__utility.getBreadCrumb(atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'E' ? this.__brCembFrExisting : this.__brCembFrOthers);
    if (this.__RtDT.snapshot.queryParamMap.get('id')) {
      this.getClDetailsParticular();
    }
  }

  getClDetailsParticular() {
    this.__dbIntr
      .api_call(
        0,
        '/client',
        'flag=' +
          atob(this.__RtDT.snapshot.queryParamMap.get('flag')) +
          '&id=' +
          atob(this.__RtDT.snapshot.queryParamMap.get('id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: client[]) => {
        console.log(res);
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id, res[0].client_type);
        }
      });
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    } else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    } else {
      this.getClientMaster(
        atob(this.__RtDT.snapshot.queryParamMap.get('flag'))
      );
      this.updateDataTable();
    }
  }
  populateDT(__items: client) {
    this.openDialog(__items, __items.id, __items.client_type);
    //  this.__utility.navigatewithqueryparams('/main/master/clModify',{queryParams:{flag:btoa(__items.client_type),id:btoa(__items.id.toString())}})
  }

  private getClientMaster(__clType: string, __paginate: string | null = '10') {
    this.__dbIntr
      .api_call(
        0,
        '/client',
        'client_type=' + __clType + '&paginate=' + __paginate
      )
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        console.log(res);

        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  private setPaginator(__res) {
    this.__selectClients = new MatTableDataSource(__res);
    this.__selectClients.paginator = this.paginator;
  }
  private updateDataTable() {
    this.__selectClients._updateChangeSubscription();
  }
  navigate(__menu) {
    switch (__menu.flag) {
      case 'M':this.openDialog(null,0,atob(this.__RtDT.snapshot.queryParamMap.get('flag')));break;
      case 'U':
      // this.__utility.navigate(__menu.url);
      this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{flag: this.__RtDT.snapshot.queryParamMap.get('flag')}})
      break;
      case 'A':break;
      case 'R':this.openDialogForReports();break;
      default:break;
    }
  }

  openDialogForReports(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "CL";
    dialogConfig.data = {
      client_type:atob(this.__RtDT.snapshot.queryParamMap.get('flag'))
    };

    try {
      const dialogref = this.__dialog.open(
        ClientRptComponent,
        dialogConfig
      );
    } catch (ex) {
       console.log(ex);

      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }

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
              this.__selectClients.data.splice(
                this.__selectClients.data.findIndex(
                  (x: client) => x.id == dt.id
                ),
                1
              );
              this.__selectClients._updateChangeSubscription();
            } else {
              // this.updateRow(dt.data);
            }
          } else {
            this.__selectClients.data.unshift(dt.data);
            this.__selectClients._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      console.log(ex);

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
  updateRow(row_obj: client) {}
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate);
    //  this.getPLANMaster(__paginate);
    this.getClientMaster(
      atob(this.__RtDT.snapshot.queryParamMap.get('flag')),
      __paginate
    );
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url +
            ('&paginate=' + this.__pageNumber.value) +
            ('&client_type=' +
              atob(this.__RtDT.snapshot.queryParamMap.get('flag')))
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
}
