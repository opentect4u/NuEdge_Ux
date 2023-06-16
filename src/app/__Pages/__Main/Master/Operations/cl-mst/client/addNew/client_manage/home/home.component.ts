import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { ClientRptComponent } from './clientRpt/clientRpt.component';
import { client } from 'src/app/__Model/__clientMst';
import { global } from 'src/app/__Utility/globalFunc';
import { ClModifcationComponent } from './clModifcation/clModifcation.component';
import { Overlay } from '@angular/cdk/overlay';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 36,
      flag: 'M',
      isvisible: atob(this.__RtDT.snapshot.paramMap.get("id")) == 'E' ? true : false
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
      url: (atob(this.__RtDT.snapshot.paramMap.get('id')) =='E' ? '/main/master/mstOperations/clntMst/clOption/clientmaster/' : '/main/master/mstOperations/clntMst/clOption/addnew/clientmaster/')+this.__RtDT.snapshot.paramMap.get('id') +'/clUploadCsv',
      icon: '',
      id: 35,
      flag: 'U',
      isvisible: false
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
  constructor(
    private __RtDT:ActivatedRoute,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
    ) { }

  ngOnInit(): void {
     if (this.__RtDT.snapshot.queryParamMap.get('cl_id')) {
       this.getClDetailsParticular();
     }
  }

  getClDetailsParticular() {
    this.__dbIntr
      .api_call(
        0,
        '/client',
        'flag=' +
          atob(this.__RtDT.snapshot.paramMap.get('flag')) +
          '&id=' +
          atob(this.__RtDT.snapshot.queryParamMap.get('cl_id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: client[]) => {
        console.log(res);
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id, res[0].client_type);
        }
      });
  }


  navigate(__menu) {
    switch (__menu.flag) {
      case 'M':this.openDialog(null,0,atob(this.__RtDT.snapshot.paramMap.get('id')));break;
      case 'U':
      this.__utility.navigate(__menu.url,this.__RtDT.snapshot.paramMap.get('id'));
      // this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{flag: this.__RtDT.snapshot.queryParamMap.get('flag')}})
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
      client_type:atob(this.__RtDT.snapshot.paramMap.get('id'))
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
    dialogConfig.id = (__clid > 0 ? __clid.toString() : '0') + '_' + __clType;
    try {
      const dialogref = this.__dialog.open(
        ClModifcationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
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
