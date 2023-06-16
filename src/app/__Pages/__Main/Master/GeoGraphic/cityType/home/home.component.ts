import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { breadCrumb } from 'src/app/__Model/brdCrmb';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { global } from 'src/app/__Utility/globalFunc';
import { CityTypeEntryComponent } from '../Dialog/city-type-entry/city-type-entry.component';
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
    this.getcityTypeAgainstId();
  }
  getcityTypeAgainstId(){
    if(this.__rtDt.snapshot.queryParamMap.get('id')){
       this.__dbIntr.api_call(0,'/cityType','id='+atob(this.__rtDt.snapshot.queryParamMap.get('id')))
       .pipe(pluck("data")).subscribe(res =>{
              this.opendialogForEntry(res[0]);
       })
    }
  }

  getItems(items){
    switch(items.flag){
      case 'M':this.opendialogForEntry(null);break;
      case 'U':this.__utility.navigate('/main/master/geographic/cityType/uploadcityType');break;
    }
  }
  opendialogForEntry(cityType){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'CT',
      id: cityType ? cityType.id : 0,
      items: cityType,
      title: cityType ? 'Update City Type' : 'Add City Type',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = cityType ? cityType.id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CityTypeEntryComponent,
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
        flag: 'CT',
      });
    }
  }
  opendialogForReport(){

  }
}
