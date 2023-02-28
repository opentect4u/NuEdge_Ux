import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { option } from 'src/app/__Model/option';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { OptionModificationComponent } from '../optionModification/optionModification.component';
import { OptrptComponent } from '../optRpt/optRpt.component';
@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css'],
})
export class OptionComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Master",
      url:'/main/master/products',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.route.snapshot.queryParamMap.get('product_id')) == '1' ?  "Mutual Fund" : "Others",
      url:'/main/master/productwisemenu/home',
      hasQueryParams:true,
      queryParams:{id:this.route.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Option",
      url:'/main/master/productwisemenu/option',
      hasQueryParams:true,
      queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}
    }
]
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 40,
      flag: 'M',
    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: '/main/master/productwisemenu/option/uploadOption',
      icon: '',
      id: 39,
      flag: 'U',
    },
    {
      parent_id: 4,
      menu_name: 'Reports',
      has_submenu: 'N',
      url: '/main/master/productwisemenu/option/uploadOption',
      icon: '',
      id: 0,
      flag: 'R',
    },
  ];

  __columns: string[] = ['sl_no', 'opt_name', 'edit', 'delete'];
  __selectOPT = new MatTableDataSource<option>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute,
    private __dialog: MatDialog,
    private overlay: Overlay
  ) {}
  ngOnInit(): void {
    // this.getOptionMaster();
    this.__utility.getBreadCrumb(this.__brdCrmbs);
    if (this.route.snapshot.queryParamMap.get('id')) {
      this.getParticularOption();
    }
  }

  getParticularOption() {
    this.__dbIntr
      .api_call(
        0,
        '/option',
        'id=' + atob(this.route.snapshot.queryParamMap.get('id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: option[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    } else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    } else {
      this.getOptionMaster();
    }
  }
  populateDT(__items: option) {
    // this.__utility.navigatewithqueryparams('/main/master/optionModify',{queryParams:{id: btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  private getOptionMaster(
    __params: string | null = null,
    __paginate: string | null = '10'
  ) {
    this.__dbIntr
      .api_call(0, '/option', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        console.log(res);

        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  private setPaginator(__res) {
    this.__selectOPT = new MatTableDataSource(__res);
    this.__selectOPT.paginator = this.paginator;
  }
  openDialog(__opt: option | null = null, __optId: number) {
    console.log(__opt);
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
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectOPT.data.unshift(dt.data);
            this.__selectOPT._updateChangeSubscription();
          }
        }
      });
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
  updateRow(row_obj: option) {
    console.log(row_obj);

    this.__selectOPT.data = this.__selectOPT.data.filter(
      (value: option, key) => {
        if (value.id == row_obj.id) {
          (value.id = row_obj.id), (value.opt_name = row_obj.opt_name);
        }
        return true;
      }
    );
  }
  navigate(__menu) {
    switch (__menu.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        // this.__utility.navigate(__menu.url);
        this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{product_id:this.route.snapshot.queryParamMap.get('product_id')}})
        break;
        case 'R':
          this.openDialogForReports(atob(this.route.snapshot.queryParamMap.get('product_id')));
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
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate);
    this.getOptionMaster('',__paginate);
  }
  getPaginate(__paginate) {
    if (__paginate.url) {
      this.__dbIntr
        .getpaginationData(
          __paginate.url + ('&paginate=' + this.__pageNumber.value)
        )
        .pipe(map((x: any) => x.data))
        .subscribe((res: any) => {
          this.setPaginator(res.data);
          this.__paginate = res.links;
        });
    }
  }
}
