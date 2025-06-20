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
import { ClientRptComponent } from '../Operations/cl-mst/client/addNew/client_manage/home/clientRpt/clientRpt.component';
import { ClModifcationComponent } from '../Operations/cl-mst/client/addNew/client_manage/home/clModifcation/clModifcation.component';

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
      isvisible: false

      // isvisible: atob(this.__RtDT.snapshot.queryParamMap.get('flag')) == 'E' ? false : true
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

  /**
   * @description This function is used to get the client master data based on the client type.
   * It fetches the data from the database using the DbIntrService and updates the MatTableDataSource with the fetched data.
   * @param __clType - The type of client (e.g., 'E' for Existing, 'M' for Minor, 'P' for PAN Holder, 'N' for Non PAN Holder).
   */
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
  /**
   * @description This function is used to get the client master data based on the client type.
   * It fetches the data from the database using the DbIntrService and updates the MatTableDataSource with the fetched data.
   * @param __clType - The type of client (e.g., 'E' for Existing, 'M' for Minor, 'P' for PAN Holder, 'N' for Non PAN Holder).
   */
  populateDT(__items: client) {
    this.openDialog(__items, __items.id, __items.client_type);
    //  this.__utility.navigatewithqueryparams('/main/master/clModify',{queryParams:{flag:btoa(__items.client_type),id:btoa(__items.id.toString())}})
  }

  /**
   * 
   * @param __menu This function is used to navigate to different pages based on the flag provided in the __menu object.
   * It uses the utility service to navigate with or without query parameters.
   */
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

  /**
   * @description This function is used to open a dialog for generating reports.
   * It configures the dialog with various properties such as autoFocus, closeOnNavigation, disableClose, hasBackdrop, width, height, scrollStrategy, panelClass, and id.
   * The data passed to the dialog includes the client type decoded from the query parameters.
   * If an error occurs while opening the dialog, it logs the error and updates the dialog's panel class.
   */
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


  /**
   * 
   * @param __clDtls - The details of the client to be modified or added.
   * @param __clid - The ID of the client to be modified or added. If it is 0, a new client will be added.
   * @param __clType - The type of client (e.g., 'M' for Minor, 'P' for PAN Holder, 'N' for Non PAN Holder, 'E' for Existing).
   * @description This function is used to open a dialog for modifying or adding a client.
   * It configures the dialog with various properties such as autoFocus, closeOnNavigation, disableClose, hasBackdrop, width, scrollStrategy, and data.
   * The data passed to the dialog includes the client details, ID, title (based on whether it is an update or add operation), right position, and client type.
   * If an error occurs while opening the dialog, it logs the error and updates the dialog's size and visibility.
   */
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
    dialogConfig.id = (__clid > 0 ? __clid.toString() : '0') + '_' + __clType;
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
}
