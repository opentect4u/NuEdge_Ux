import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { plan } from 'src/app/__Model/plan';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { PlanModificationComponent } from '../planModification/planModification.component';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  __pageNumber= new FormControl(10);
  __paginate:any=[];
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":36,"flag":"M"},
             {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadPln","icon":"","id":35,"flag":"U"}]
  
  __columns: string[] = ['sl_no', 'plan_name', 'edit', 'delete'];
  __selectPLN= new MatTableDataSource<plan>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(  private overlay : Overlay,private __utility: UtiliService,private __dbIntr: DbIntrService,private route :ActivatedRoute,private __dialog: MatDialog) { }
  ngOnInit(): void {
    this.getPLANMaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getPLANMaster();
    }
  }
  populateDT(__items: plan) {
    // this.__utility.navigatewithqueryparams('/main/master/plnModify',{queryParams:{id: btoa(__items.id.toString())}})
    this.openDialog(__items,__items.id);
  }

  private getPLANMaster(__params: string | null = '',__paginate:string | null = "10") {
    console.log(__params);
    
    this.__dbIntr.api_call(0, '/plan', "paginate="+__paginate).pipe(map((x: responseDT) => x.data)).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
  }
  private setPaginator(__res) {
    this.__selectPLN= new MatTableDataSource(__res);
    this.__selectPLN.paginator = this.paginator;
  }

  openDialog(__pln: plan | null = null , __plnId: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "40%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:'P',
      id:__plnId,
      items:__pln,
      title:  __plnId == 0 ? 'Add R&T' : 'Update R&T',
      right:global.randomIntFromInterval(1,60)
    }
    dialogConfig.id = __plnId > 0  ? __plnId.toString() : "0";
    try{
      const dialogref = this.__dialog.open(PlanModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          }
          else {
            this.__selectPLN.data.unshift(dt.data);
            this.__selectPLN._updateChangeSubscription();
          }
        }
      });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('40%')
      console.log(ex);
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"P"})
    }
  
  }
  updateRow(row_obj){
    this.__selectPLN.data = this.__selectPLN.data.filter((value: plan, key) => {
      if (value.id == row_obj.id) {
       value.id = row_obj.id,
       value.plan_name = row_obj.plan_name
      }
      return true;
    });

  }
  navigate(__menu){
    switch(__menu.flag){
      case 'M' :this.openDialog(null,0); break;
      case 'U' :this.__utility.navigate(__menu.url); break;
       default:break;
    }
  }
  getval(__paginate){
    this.__pageNumber.setValue(__paginate);
     this.getPLANMaster(__paginate);
  }
  getPaginate(__paginate){
  if(__paginate.url){
   this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber.value)).pipe(map((x: any) => x.data)).subscribe((res: any) => {
     this.setPaginator(res.data);
     this.__paginate = res.links;
   })
  }
  }
}
