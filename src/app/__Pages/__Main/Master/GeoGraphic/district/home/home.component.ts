import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { global } from 'src/app/__Utility/globalFunc';
import { DistrictEntryComponent } from '../Dialog/district-entry/district-entry.component';
import { ActivatedRoute } from '@angular/router';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = menu.filter((x)=> x.flag!= 'R');
  constructor(
    private overlay: Overlay,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private __rtDt: ActivatedRoute,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    this.getCountryAgainstId();
  }
  getCountryAgainstId(){
    if(this.__rtDt.snapshot.queryParamMap.get('id')){
       this.__dbIntr.api_call(0,'/districts','id='+atob(this.__rtDt.snapshot.queryParamMap.get('id')))
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
        this.__utility.navigate('/main/master/geographic/district/uploaddistrict');
      break;
    }
  }
  opendialogForEntry(district){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'D',
      id: district ? district.id : 0,
      items: district,
      title: district ? 'Update District' : 'Add District',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = district ? district.id.toString() : '0';

    try {
      const dialogref = this.__dialog.open(
        DistrictEntryComponent,
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
        flag: 'D',
      });
    }
  }
  opendialogForReport(){

  }
}
