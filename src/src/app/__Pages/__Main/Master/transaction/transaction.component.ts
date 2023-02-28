import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TrnsModificationComponent } from './trnsModification/trnsModification.component';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { Overlay } from '@angular/cdk/overlay';
import { TrnsrptComponent } from './trnsRpt/trnsRpt.component';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
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
  __selectTrns:any=[];
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
    this.__selectTrns.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectTrns.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '50%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Transaction' : 'Update Transaction',
      items: __items
    };
    const dialogref = this.__dialog.open(TrnsModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      // if (dt?.id > 0) {
      //   this.__selectTrns[this.__selectTrns.findIndex(x => x.id == dt.id)].trans_id= dt?.trans_id;
      //   this.__selectTrns[this.__selectTrns.findIndex(x => x.id == dt.id)]. trns_name = dt?. trns_name;
      // }
    });
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
    dialogConfig.id = "TRNS",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        TrnsrptComponent,
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
