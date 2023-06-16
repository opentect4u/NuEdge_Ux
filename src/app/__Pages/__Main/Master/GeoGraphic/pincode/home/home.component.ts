import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { global } from 'src/app/__Utility/globalFunc';
import { PincodeEntryComponent } from '../Dialog/pincode-entry/pincode-entry.component';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu =  menu.filter((x)=> x.flag!= 'R');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    this.getPincodeAgainstId();
  }
  getPincodeAgainstId(){
    if(this.__rtDt.snapshot.queryParamMap.get('id')){
       this.__dbIntr.api_call(0,'/pincode','id='+atob(this.__rtDt.snapshot.queryParamMap.get('id')))
       .pipe(pluck("data")).subscribe(res =>{
              this.opendialogForEntry(res[0]);
       })
    }
  }

  getItems(items){
    switch(items.flag){
      case 'M':
      this.opendialogForEntry(null);
                break;
      case 'U':
        this.__utility.navigate('/main/master/geographic/pincode/uploadpincode');
      break;
    }
  }
  opendialogForEntry(pincode){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'P',
      id: pincode ? pincode.id : 0,
      items: pincode,
      title: pincode ? 'Update Pincode' : 'Add Pincode',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = pincode ? pincode.id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        PincodeEntryComponent,
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
        flag: 'P',
      });
    }
  }
  opendialogForReport(){

  }

}
