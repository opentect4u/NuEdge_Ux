import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { RntModificationComponent } from './rntModification/rntModification.component';

@Component({
  selector: 'master-RNT',
  templateUrl: './RNT.component.html',
  styleUrls: ['./RNT.component.css']
})
export class RNTComponent implements OnInit {
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "/main/master/rntmodify","icon":"","id":3,"flag":"M"},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/rntUpload","icon":"","id":15,"flag":"U"}
 ]
   __paginate: any=[];
  __pageNumber= new FormControl(10);
  __columns: string[] = ['sl_no', 'rnt_name','cus_care_no', 'edit', 'delete'];
  __selectRNT = new MatTableDataSource<rnt>([]);
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dbIntr: DbIntrService,
    private __dialog:MatDialog
    ) { }
  ngOnInit() {
    this.getRNTmaster()
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {}
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getRNTmaster();
    }
  }
  populateDT(__items: rnt) {
    console.log(__items)
    // this.__utility.navigatewithqueryparams('/main/master/rntmodify',{queryParams:{id:btoa(__items.id.toString())}})
    this.openDialog(__items,__items.id)
  }

  private getRNTmaster(__paginate: string | null = "10") {
    this.__dbIntr.api_call(0, '/rnt', 'paginate=' + __paginate).pipe(map((x: any) => x.data)).subscribe((res: any) => {
      console.log(res);
      this.setPaginator(res.data);
      this.__paginate = res.links;
    })
  }
  private setPaginator(__res){
    this.__selectRNT = new MatTableDataSource(__res);
  }
  showCorrospondingAMC(__rntDtls){
    this.__utility.navigatewithqueryparams('/main/master/amcmaster',{queryParams:{id:btoa(__rntDtls.id.toString())}})
  }
  openDialog(__rnt: rnt | null = null , __rntId: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "60%";
    // dialogConfig.height = "100%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:'R',
      id:__rntId,
      __rnt:__rnt,
      title: __rntId == 0 ? 'Add R&T' : 'Update R&T',
      right:this.randomIntFromInterval(1,60)
    }
    dialogConfig.id = __rntId > 0  ? __rntId.toString() : "0";
    try{
      const dialogref = this.__dialog.open(RntModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          }
          else {
            this.addRow(dt.data);
          }
        }
      });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      console.log(ex);
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"R"})
    }

  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  private updateRow(row_obj: rnt) {
    this.__selectRNT.data = this.__selectRNT.data.filter((value: rnt, key) => {
      if (value.id == row_obj.id) {
        value.rnt_name = row_obj.rnt_name;
        value.website = row_obj.website;
        value.ofc_addr = row_obj.ofc_addr;
        value.cus_care_no = row_obj.cus_care_no;
        value.cus_care_email = row_obj.cus_care_email
        value.id = row_obj.id
      }
      return true;
    });
  }
  private addRow(row_obj: rnt) {
    this.__selectRNT.data.unshift(row_obj);
    this.__selectRNT._updateChangeSubscription();
  }
  navigate(__menu){
    switch(__menu.flag){
      case 'M' :this.openDialog(null,0); break;
      case 'U' :this.__utility.navigate('/main/master/rntUpload'); break;
       default:break;
    }

  }
  getval(__paginate){
     console.log(__paginate);
     this.__pageNumber.setValue(__paginate.toString())
      this.getRNTmaster(this.__pageNumber.value);
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
