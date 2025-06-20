/**
 * AMC Layout screen , 
 * all screens related to AMC will be rendered through it
 */

import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { amc } from 'src/app/__Model/amc';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { AmcModificationComponent } from './amcModification/amcModification.component';
import { AmcrptComponent } from './amcRpt/amcRpt.component';
import { AMCEntryComponent } from 'src/app/shared/amcentry/amcentry.component';

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
    }
  ];
  constructor(
    private __dialog: MatDialog,
    private __utility: UtiliService,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    /**
     * Check if any query params AMC_ID and ID available in the URL or not
     * if amc_id avalable then call api that get particular AMC by id
     * 
     */
    if (this.route.snapshot.queryParamMap.get('amc_id')) {
        this.getParticularAMCMaster();
    }
    else if(this.route.snapshot.queryParamMap.get('id')){
         this.navigate({flag:'R'});
    }
  }


  /**
   * Fetch Particular Amc by AMC ID
   */
  getParticularAMCMaster() {
    this.__dbIntr
      .api_call(
        0,
        '/amc',
        'id=' + this.__utility.decrypt_dtls(this.route.snapshot.queryParamMap.get('amc_id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: amc[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }

  /**
   * For Navigating or AMC modal Visibility
   * @param __items 
   */
  navigate(__items) {
    switch (__items.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
       this.__utility.navigate(__items.url);
      // this.__utility.navigatewithqueryparams(__items.url,{queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}})
        break;
      case 'RA':break;
      case 'MA':break;
      default: this.openDialogForReports(
        global.getActualVal(this.route.snapshot.queryParamMap.get('id'))
        ? this.__utility.decrypt_dtls(this.route.snapshot.queryParamMap.get('id')) : '',
        global.getActualVal(this.route.snapshot.queryParamMap.get('amc_id')) ?
        this.__utility.decrypt_dtls(this.route.snapshot.queryParamMap.get('amc_id')) : ''
      );
        break;
    }
  }

  /**
   * Open Modal for amc addition or AMC Modification
   * @param __amc 
   * @param __amcId 
   */
  openDialog(__amc: amc | null = null, __amcId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    // dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'A',
      id: __amcId,
      amc: __amc,
      title: __amcId == 0 ? 'Add AMC' : 'Update AMC',
      product_id:'1', /** For Mutual Fund */
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __amcId > 0 ? __amcId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        // AmcModificationComponent,
        AMCEntryComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
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
  
  /**
   * Open Modal for amc Reports
   * @param __amc 
   * @param __amcId 
   */
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
      rnt_id:__rnt_id,
      product_id:'1', /** For Mutual Fund */
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
