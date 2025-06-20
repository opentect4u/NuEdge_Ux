/**
 * Landing screen for category,
 * from where category can be added,
 * category can be viewed in list report 
 * and can be upload category in bulk
 */

import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';
import { CatrptComponent } from './catRpt/catRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
import { category } from 'src/app/__Model/__category';
@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  __menu  = menu;
  constructor(
    private __rtDt: ActivatedRoute,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}
  ngOnInit(): void {
    // this.getCategorymaster();

    /**
     * these  will be evaluated if thare is any id in query params
     */
    if (this.__rtDt.snapshot.queryParamMap.get('id')) {
      this.getParticularCategory();
    }
  }

  
  /**
   * Get Category by id from backend, these func will be called if thare is any id in query params
   */
  getParticularCategory() {
    this.__dbIntr
      .api_call(
        0,
        '/category',
        'id=' + this.__utility.decrypt_dtls(this.__rtDt.snapshot.queryParamMap.get('id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }
 
  /**
   * Open Dialog for add / modified Category
   * @param __category 
   * @param __catId 
   */
  openDialog(__category: category | null = null, __catId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'C',
      id: __catId,
      items: __category,
      title: __catId == 0 ? 'Add Category' : 'Update Category',
      product_id:'1',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CategoryModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'C',
      });
    }
  }

  /**
   * Func will be called when we click on particular tiles
   * @param __menu 
   */
  getItems = (__menu) => {
    switch (__menu.flag) {
      case 'M':
        /**
         * For Open Dialog box for add category
         */
        this.openDialog(null, 0);
        break;
      case 'U':
        /**
         * For Navigating tobulk upload of category screen
         */
        this.__utility.navigate('main/master/productwisemenu/category/uploadcategory');
        break;
        /**
         * For Open Dialog box for showing category list
         */
          case 'R':this.openDialogForReports(btoa('1'));break;
      default:
        break;
    }
  }


  /**
   * Open Dialog for showing Category List in report
   */
  openDialogForReports(__prodid: string | null = null){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "C",
    dialogConfig.data = {
      product_id:__prodid
    }
    try {
      const dialogref = this.__dialog.open(
        CatrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prodid
      });
    }

  }
}
