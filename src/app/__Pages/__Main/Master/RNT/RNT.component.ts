import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RntModificationComponent } from './rntModification/rntModification.component';
import { RntrptComponent } from './rntRpt/rntRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'master-RNT',
  templateUrl: './RNT.component.html',
  styleUrls: ['./RNT.component.css'],
})
export class RNTComponent implements OnInit {
  // __menu = [
  //   {
  //     parent_id: 4,
  //     menu_name: 'Manual Entry',
  //     has_submenu: 'N',
  //     url: '/main/master/rntmodify',
  //     icon: '',
  //     id: 3,
  //     flag: 'M',
  //   },
  //   {
  //     parent_id: 4,
  //     menu_name: 'Upload CSV',
  //     has_submenu: 'N',
  //     url: 'main/master/productwisemenu/rnt/rntUpload',
  //     icon: '',
  //     id: 15,
  //     flag: 'U',
  //   },
  //   {
  //     parent_id: 4,
  //     menu_name: 'Reports',
  //     has_submenu: 'N',
  //     url: '',
  //     icon: '',
  //     id: 0,
  //     flag: 'R',
  //   },
  // ];
  __menu = menu;
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute
  ) {}
  ngOnInit() {
    console.log(this.__rtDt.snapshot.queryParamMap.get('id'));
    if (this.__rtDt.snapshot.queryParamMap.get('id')) {
      this.getParticularRNt(atob(this.__rtDt.snapshot.queryParamMap.get('id')));
    }
  }

  /****** For Preview Selected RNT Details from Upload RNT Page inside Dialog Box*/
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
  /*** End */



   /**** Navigate with rnt id to AMC Page and  preview that AMC inside AMC Report */
  showCorrospondingAMC(__rntDtls) {
    this.__utility.navigatewithqueryparams('/main/master/productwisemenu/amc', {
      queryParams: { id: btoa(__rntDtls.id.toString()) },
    });
  }
  /** End */

  /*** Open R&T Modification Modal  for modifying and addition*/
  openDialog(__rnt: rnt | null = null, __rntId: number) {
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
      product_id:'1',
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
  /*** End */


  /***
   * generating random number from 1 to 60; based on it
   * dialog box will be positioned after minimized or
   * maximized
   * */
  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  /*** End */


  /*** after click on each card this function will trigger;
   * this function is responsible for opening modal for modification or report
   * and Navigating to Upload R&T Page
   * */
  getItems = (__menu) => {
    switch (__menu.flag) {
      case 'M':this.openDialog(null, 0);break;
      case 'U':this.__utility.navigate('main/master/productwisemenu/rnt/rntUpload');break;
      case 'R':this.openDialogForReport();break;
      default:break;
    }
  }
  /**** End */

    /*** Open R&T Report*/
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
      product_id: '1' ,/** For Mutual Fund */
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
  /*** End ***/

}
