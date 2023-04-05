import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { plan } from 'src/app/__Model/plan';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PlanModificationComponent } from '../planModification/planModification.component';
import { PlanrptComponent } from '../planRpt/planRpt.component';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
})
export class PlanComponent implements OnInit {
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
      label:"Plan",
      url:'/main/master/productwisemenu/plan',
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

  __columns: string[] = ['sl_no', 'plan_name', 'edit', 'delete'];
  __selectPLN = new MatTableDataSource<plan>([]);

  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private route: ActivatedRoute,
    private __dialog: MatDialog
  ) {}
  ngOnInit(): void {
   this.__utility.getBreadCrumb(this.__brdCrmbs);
    // this.getPLANMaster();
    if (this.route.snapshot.queryParamMap.get('id')) {this.getParticularPlan();}
  }

  getParticularPlan() {
    this.__dbIntr
      .api_call(
        0,
        '/plan',
        'id=' + atob(this.route.snapshot.queryParamMap.get('id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: plan[]) => {
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
      this.getPLANMaster();
    }
  }
  populateDT(__items: plan) {
    // this.__utility.navigatewithqueryparams('/main/master/plnModify',{queryParams:{id: btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  private getPLANMaster(
    __params: string | null = '',
    __paginate: string | null = '10'
  ) {
    console.log(__params);

    this.__dbIntr
      .api_call(0, '/plan', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
  private setPaginator(__res) {
    this.__selectPLN = new MatTableDataSource(__res);
    // this.__selectPLN.paginator = this.paginator;
  }

  openDialog(__pln: plan | null = null, __plnId: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'P',
      id: __plnId,
      items: __pln,
      title: __plnId == 0 ? 'Add Plan' : 'Update Plan',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __plnId > 0 ? __plnId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        PlanModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectPLN.data.unshift(dt.data);
            this.__selectPLN._updateChangeSubscription();
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
        flag: 'P',
      });
    }
  }
  updateRow(row_obj) {
    this.__selectPLN.data = this.__selectPLN.data.filter((value: plan, key) => {
      if (value.id == row_obj.id) {
        (value.id = row_obj.id), (value.plan_name = row_obj.plan_name);
      }
      return true;
    });
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
    dialogConfig.id = "P",
    dialogConfig.data = {
      product_id:__prdId
    }
    try {
      const dialogref = this.__dialog.open(
        PlanrptComponent,
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
  getval(__paginate) {
   console.log(__paginate);

    this.__pageNumber.setValue(__paginate);
    this.getPLANMaster('',__paginate);
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