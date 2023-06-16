import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { Overlay } from '@angular/cdk/overlay';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { global } from 'src/app/__Utility/globalFunc';
import { CityEntryComponent } from '../Dialog/city-entry/city-entry.component';
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
    this.getCityAgainstId();
  }
  getCityAgainstId(){
    if(this.__rtDt.snapshot.queryParamMap.get('id')){
       this.__dbIntr.api_call(0,'/city','id='+atob(this.__rtDt.snapshot.queryParamMap.get('id')))
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
        this.__utility.navigate('/main/master/geographic/city/uploadcity');
      // this.__utility.navigatewithqueryparams(
      //   '/main/master/productwisemenu/scheme/uploadIsin',
      //   {queryParams:{product_id:this.__rtDt.snapshot.queryParamMap.get('product_id')}}
      // )
      break;
      case 'R':
        // this.opendialogForReport();break;
    }
  }
  opendialogForEntry(city){
    console.log(city)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '40%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'C',
      id: city ? city.id :  0,
      items: city,
      title: city ? 'Update City' : 'Add City',
      right: global.randomIntFromInterval(1, 60),
    };
    dialogConfig.id = city ? city.id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        CityEntryComponent,
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
        flag: 'C',
      });
    }
  }
  opendialogForReport(){

  }
}
