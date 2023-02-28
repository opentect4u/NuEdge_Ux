import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { KycrptComponent } from './KycRpt/kycRPT.component';
import { KyModificationComponent } from './kyModification/kyModification.component';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  __brdCrmbs: breadCrumb[] = [{
    label:"Home",
    url:'/main',
    hasQueryParams:false,
    queryParams:''
    },
    {
      label:"Operation",
      url:'/main/operations/ophome',
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:atob(this.__rtDt.snapshot.queryParamMap.get('product_id')) == '1' ? "Mutual Fund" : "others",
      url:'/main/operations/mfdashboard' + '/' + this.__rtDt.snapshot.queryParamMap.get('product_id'),
      hasQueryParams:false,
      queryParams:''
    },
    {
      label:"Manual Entry",
      url:'/main/operations/manualEntr',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    },
    {
      label:"Kyc Trax",
      url:'/main/kyc',
      hasQueryParams:true,
      queryParams:{product_id: this.__rtDt.snapshot.queryParamMap.get('product_id')}
    }
]
  __menu = [
    {"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":16,"flag":"M"},
    {"parent_id": 4,"menu_name": "Reports","has_submenu": "N","url": "","icon":"","id":0,"flag":"R"}
  ];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  __columns: string[] = ['sl_no', 'tin_no', 'entry_dt', 'pan', 'edit', 'delete'];
  __selectClients = new MatTableDataSource();
  constructor(
    private __dbIntr: DbIntrService,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute,
    private __utility:UtiliService,
    private overlay: Overlay) { }

  ngOnInit() {
    // this.checkKycExistOrNot('');
    this.__utility.getBreadCrumb(this.__brdCrmbs);
  }

  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog('', '');
    }
    else if (__ev.flag == 'F') {
      this.checkKycExistOrNot(__ev.item.client_code);
    }
    else {
      this.checkKycExistOrNot('');
    }
  }

  populateDT(__items) {
    this.openDialog(__items.pan_no, __items);
  }
  checkKycExistOrNot(client_code,__paginate: string | null = "10") {
    this.__dbIntr.api_call(0, '/kyc','paginate='+ __paginate + (client_code == '' ? '' : 'search=' + client_code)).pipe(map((x: any) => x.data)).subscribe(res => {
      this.__selectClients = new MatTableDataSource(res);
      this.__selectClients.paginator = this.paginator;
    })
  }


  openDialog(id: string | null = null, __items) {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '98%';
    // dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    // dialogConfig.height = "100%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    try{
      if (id) {
        this.__dbIntr.api_call(0, '/kycshowadd', 'search=' + __items.client_code).pipe(map((x: any) => x.data)).subscribe(res => {
          console.log(res);
          dialogConfig.data = {
            id: id,
            title: 'Update Kyc Status',
            items: res[0],
            kyc_data: __items
          };
          const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
          dialogref.afterClosed().subscribe(dt => {
          });

        })
      }
      else {
        dialogConfig.data = {
          id: 0,
          title: 'Add Kyc',
          items: __items
        };
        const dialogref = this.__dialog.open(KyModificationComponent, dialogConfig);
        dialogref.afterClosed().subscribe(dt => {
        });
      }
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
    }

  }
  navigate(__items){
    switch(__items.flag){
      case 'M':this.openDialog('','');break;
      case 'R': this.openDialogRPT();break;
      default: break;
    }
  }
  openDialogRPT(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "KYC_RPT";
    try {
      const dialogref = this.__dialog.open(
        KycrptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      // this.__utility.getmenuIconVisible({
      //   amc_id:amc_id,
      //   rnt_id:__rnt_id
      // });
    }

  }
}
