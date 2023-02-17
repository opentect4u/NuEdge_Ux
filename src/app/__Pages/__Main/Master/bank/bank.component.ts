import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, pluck } from 'rxjs/operators';
import { bank } from 'src/app/__Model/__bank';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { BnkrptComponent } from './bankRpt/bnkRpt.component';
import { BnkModificationComponent } from './bnkModification/bnkModification.component';

@Component({
  selector: 'master-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  __pageNumber= new FormControl(10);
  __paginate:any=[];
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":26,"flag":"M"},
             {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadbnk","icon":"","id":27,"flag":"U"},
             {"parent_id": 4,"menu_name": "Reports","has_submenu": "N","url": "","icon":"","id":27,"flag":"R"}]

  __columns: string[] = ['sl_no', 'bank_name', 'edit', 'delete'];
  __selectbnk = new MatTableDataSource<bank>([]);
  constructor(
    private overlay:Overlay,
    private __dialog:MatDialog,
    private __dbIntr: DbIntrService,
    private __rtDt: ActivatedRoute,
    private __utility: UtiliService) { }
  ngOnInit(): void {
    this.getBankMaster();
    if(this.__rtDt.snapshot.queryParamMap.get('id')){
      this.getParticularBank();
     }

  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getBankMaster();
    }
  }
  getParticularBank(){
    this.__dbIntr.api_call(0,'/depositbank','id='+atob(this.__rtDt.snapshot.queryParamMap.get('id'))).pipe(pluck("data")).subscribe((res: bank[]) =>{
      if(res.length > 0){
        this.openDialog(res[0],res[0].id);
      }
    })
  }
  populateDT(__items: bank) {
    // this.__utility.navigatewithqueryparams('/main/master/bnkModify',{queryParams:{id:btoa(__items.id.toString())}})
    this.openDialog(__items,__items.id);
  }
  private getBankMaster(__paginate: string | null = "10") {
    this.__dbIntr.api_call(0, '/depositbank','paginate=' + __paginate).pipe((map((x: responseDT) => x.data))).subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate =res.links;
    })
  }
  private setPaginator(__res) {
    this.__selectbnk = new MatTableDataSource(__res);
  }
  openDialog(__bank: bank | null = null , __bnkId: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "40%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:'B',
      id:__bnkId,
      items:__bank,
      title: __bnkId == 0 ? 'Add Bank' : 'Update Bank',
      right:global.randomIntFromInterval(1,60)
    }
    dialogConfig.id = __bnkId > 0  ? __bnkId.toString() : "0";
    try{
      const dialogref = this.__dialog.open(BnkModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          }
          else {
            this.__selectbnk.data.unshift(dt.data);
            this.__selectbnk._updateChangeSubscription();
          }
        }
      });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("40%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"B"})
    }

  }
  private updateRow(row_obj: bank) {
    this.__selectbnk.data = this.__selectbnk.data.filter((value: bank, key) => {
      if (value.id == row_obj.id) {
        value.bank_name = row_obj.bank_name;
        value.ifs_code = row_obj.ifs_code;
        value.branch_name=row_obj.branch_name;
        value.micr_code=row_obj.micr_code;
        value.branch_addr=row_obj.branch_addr;
      }
      return true;
    });
  }
  navigate(__menu){
    switch(__menu.flag){
      case 'M' :this.openDialog(null,0); break;
      case 'U' :this.__utility.navigate(__menu.url); break;
      case 'R' :this.openDialogForReports(atob(this.__rtDt.snapshot.queryParamMap.get('product_id'))); break;
       default:break;
    }
  }
  getval(__paginate){
    this.__pageNumber.setValue(__paginate);
     this.getBankMaster(__paginate);
 }
 getPaginate(__paginate){
  if(__paginate.url){
   this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber.value)).pipe(map((x: any) => x.data)).subscribe((res: any) => {
     this.setPaginator(res.data);
     this.__paginate = res.links;
   })
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
  dialogConfig.id = "B",
  dialogConfig.data = {
    product_id:__prdId
  }
  try {
    const dialogref = this.__dialog.open(
      BnkrptComponent,
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
