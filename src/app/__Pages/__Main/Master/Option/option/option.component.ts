import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { option } from 'src/app/__Model/option';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { OptionModificationComponent } from '../optionModification/optionModification.component';
import { OptrptComponent } from '../optRpt/optRpt.component';
import menu from '../../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css'],
})
export class OptionComponent implements OnInit {
  __menu = menu
  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) {}
  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('id')) {
      this.getParticularOption();
    }
  }

  /**
   * * This function is used to fetch a particular option based on the ID provided in the query parameters.
   * * It makes an API call to retrieve the option details and opens a dialog to display or modify the option.
   * * @return {void}
   */
  getParticularOption() {
    this.__dbIntr
      .api_call(
        0,
        '/option',
        'id=' + this.__utility.decrypt_dtls(this.route.snapshot.queryParamMap.get('id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: option[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }

  /**
   * * This function is used to open a dialog for adding or updating an option.
   * * It creates a MatDialogConfig object, sets various properties for the dialog,
   * * and opens the OptionModificationComponent dialog with the provided configuration.
   */
  openDialog(__opt: option | null = null, __optId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'O',
      id: __optId,
      items: __opt,
      title: __optId == 0 ? 'Add Option' : 'Update Option',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __optId > 0 ? __optId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        OptionModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'O',
      });
    }
  }

  /**
   * * This function is used to handle the click event on the menu items.
   * * It checks the flag of the clicked item and opens the corresponding dialog.
   * * @param {any} __menu - The clicked menu item.
   */
  getItems = (__menu) => {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate('/main/master/productwisemenu/option/uploadOption');
        break;
        case 'R':
          this.openDialogForReports('1');
          break;
      default:
        break;
    }
  }
  /**
   * * This function is used to open a dialog for reports related to options.
   * * It creates a MatDialogConfig object, sets various properties for the dialog,
   * * and opens the OptrptComponent dialog with the provided configuration.
   * * @param {string} __prdId - The product ID for which reports are to be generated.
   * * @return {void}
   */
  openDialogForReports(__prdId){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "O",
    dialogConfig.data = {
      flag:'O',
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        OptrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prdId,
        flag:'O',
        id:__prdId
      });
    }
  }
}
