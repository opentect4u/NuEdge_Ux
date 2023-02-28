import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { TrnstypeModificationComponent } from './trnstypeModification/trnstypeModification.component';
import { Overlay } from '@angular/cdk/overlay';
import { TrnstyperptComponent } from './trnsTypeRpt/trnsTypeRpt.component';

@Component({
  selector: 'app-transType',
  templateUrl: './transType.component.html',
  styleUrls: ['./transType.component.css']
})
export class TransTypeComponent implements OnInit {
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 36,
      flag: 'M',
    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: '/main/master/productwisemenu/plan/uploadPln',
      icon: '',
      id: 35,
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
  __selectTrnstype:any=[];
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute,
    private __dialog: MatDialog
    ) { }
  ngOnInit(): void {
  }
  getSearchItem(__ev) {
    this.__selectTrnstype.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectTrnstype.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    // const disalogConfig = new MatDialogConfig();
    // disalogConfig.width = '50%';
    // disalogConfig.data = {
    //   id: id,
    //   title: id == 0 ? 'Add Transaction Type' : 'Update Transaction Type',
    //   items: __items
    // };
    // const dialogref = this.__dialog.open(TrnstypeModificationComponent, disalogConfig);
    // dialogref.afterClosed().subscribe(dt => {
    //   if (dt?.id > 0) {
    //     this.__selectTrnstype[this.__selectTrnstype.findIndex(x => x.id == dt.id)].trns_type = dt?.trns_type;
    //     this.__selectTrnstype[this.__selectTrnstype.findIndex(x => x.id == dt.id)].product_id = dt?.product_id;
    //   }
    // });


    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'TRNSTYPE',
       id: id,
       title: id == 0 ? 'Add Transaction Type' : 'Update Transaction Type',
      items: __items,
      product_id: atob(this.route.snapshot.queryParamMap.get('prodcut_id'))
    };
    dialogConfig.id = id > 0 ? id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        TrnstypeModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            // this.updateRow(dt.data);
          } else {
            // this.__selectPLN.data.unshift(dt.data);
            // this.__selectPLN._updateChangeSubscription();
          }
        }
      });
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%');
      console.log(ex);
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'TRNSTYPE',
      });
    }
  }
  navigate(__menu) {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(0,null);
        break;
      case 'U':
        this.__utility.navigate(__menu.url);
        break;
      case 'R':
        this.openDialogForReports(atob(this.route.snapshot.queryParamMap.get('product_id')))
        break;
      default:
        break;
    }
  }
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
    dialogConfig.id = "TT",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        TrnstyperptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        product_id:__prdId
      });
    }
  }
}
