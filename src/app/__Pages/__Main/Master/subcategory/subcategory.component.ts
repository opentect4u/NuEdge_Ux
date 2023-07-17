import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { pluck } from 'rxjs/operators';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';
import { SubcatrptComponent } from './subcatRpt/subcatRpt.component';
import menu from '../../../../../assets/json/Master/commonMenuMst.json';
@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css'],
})
export class SubcategoryComponent implements OnInit {

  __menu =menu

  constructor(
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    if(this.route.snapshot.queryParamMap.get('id')){
       this.getItems({flag:'R'});//Showing Reports of sub category for the corrosponding category
    }
    else if(this.route.snapshot.queryParamMap.get('sub_cat_id')){
         this.getParticularSubcategory();
    }
  }

  getParticularSubcategory() {
    this.__dbIntr
      .api_call(
        0,
        '/subcategory',
        'id=' + atob(this.route.snapshot.queryParamMap.get('sub_cat_id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: subcat[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }

  openDialog(__subcategory: subcat | null = null, __subcatId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'S',
      id: __subcatId,
      items: __subcategory,
      title: __subcatId == 0 ? 'Add Sub Category' : 'Update Sub Category',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __subcatId > 0 ? __subcatId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        SubcateModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'S',
      });
    }
  }
  getItems = (__menu) => {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate('main/master/productwisemenu/subcategory/uploadSubcat');
        // this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}});
        break;
        case 'R':
          this.openDialogForReports(
            '1',
            global.getActualVal(this.route.snapshot.queryParamMap.get('id')) ?atob(this.route.snapshot.queryParamMap.get('id')) : '',
            global.getActualVal(this.route.snapshot.queryParamMap.get('sub_cat_id')) ?atob(this.route.snapshot.queryParamMap.get('sub_cat_id')) : ''
            )
          break;
      default:
        break;
    }
  }
  openDialogForReports(__prodid: string | null = null,__catId: string | null = null,__subcatId:string | null = null){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "S",
    dialogConfig.data = {
      product_id:__prodid,
      cat_id:__catId,
      sub_cat_id:__subcatId
    }
    try {
      const dialogref = this.__dialog.open(
        SubcatrptComponent,
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
