import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';
import { CatrptComponent } from './catRpt/catRpt.component';

@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  __pageNumber = new FormControl(10);
  __paginate: any = [];
  __menu = [
    {
      parent_id: 4,
      menu_name: 'Manual Entry',
      has_submenu: 'N',
      url: '',
      icon: '',
      id: 20,
      flag: 'M',
    },
    {
      parent_id: 4,
      menu_name: 'Upload CSV',
      has_submenu: 'N',
      url: 'main/master/productwisemenu/category/uploadcategory',
      icon: '',
      id: 21,
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
  __columns: string[] = ['sl_no', 'cat_name', 'edit', 'delete'];
  __selectCategory = new MatTableDataSource<category>([]);
  constructor(
    private __rtDt: ActivatedRoute,
    private overlay: Overlay,
    private __dialog: MatDialog,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService
  ) {}
  ngOnInit(): void {
    // this.getCategorymaster();
    if (this.__rtDt.snapshot.queryParamMap.get('id')) {
      this.getParticularCategory();
    }
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    } else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    } else {
      this.getCategorymaster();
    }
  }
  populateDT(__items: category) {
    // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
    this.openDialog(__items, __items.id);
  }

  getParticularCategory() {
    this.__dbIntr
      .api_call(
        0,
        '/category',
        'id=' + atob(this.__rtDt.snapshot.queryParamMap.get('id'))
      )
      .pipe(pluck('data'))
      .subscribe((res: category[]) => {
        if (res.length > 0) {
          this.openDialog(res[0], res[0].id);
        }
      });
  }

  private getCategorymaster(__paginate: string | null = '10') {
    this.__dbIntr
      .api_call(0, '/category', 'paginate=' + __paginate)
      .pipe(map((x: responseDT) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }

  private setPaginator(__res) {
    this.__selectCategory = new MatTableDataSource(__res);
  }
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
      product_id:this.__rtDt.snapshot.queryParamMap.get('product_id') ? atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) : '',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CategoryModificationComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          } else {
            this.__selectCategory.data.unshift(dt.data);
            this.__selectCategory._updateChangeSubscription();
          }
        }
      });
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
  private updateRow(row_obj: category) {
    this.__selectCategory.data = this.__selectCategory.data.filter(
      (value: category, key) => {
        if (value.id == row_obj.id) {
          value.cat_name = row_obj.cat_name;
          value.product_id = row_obj.product_id;
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
        this.__utility.navigatewithqueryparams(__menu.url,{queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}});
        break;
      case 'R':this.openDialogForReports(this.__rtDt.snapshot.queryParamMap.get('product_id'));break;
      default:
        break;
    }
  }
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
  getval(__paginate) {
    this.__pageNumber.setValue(__paginate.toString());
    this.getCategorymaster(this.__pageNumber.value);
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
  showCorrospondingAMC(__items) {
    this.__utility.navigatewithqueryparams(
      'main/master/productwisemenu/subcategory',
      {
        queryParams: { id: btoa(__items.id.toString()) },
      }
    );
  }
}
