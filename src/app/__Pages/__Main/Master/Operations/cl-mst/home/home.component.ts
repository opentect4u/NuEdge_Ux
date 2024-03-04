import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/clientMstDashMenu.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { client } from 'src/app/__Model/__clientMst';
import { global } from 'src/app/__Utility/globalFunc';
import { ClModifcationComponent } from '../client/addNew/client_manage/home/clModifcation/clModifcation.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  __menu = menu;
  constructor(
    private utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    ) { }

  ngOnInit(): void {}
  getItems(event){
    //  this.utility.navigate(event.url)
    console.log(event.flag);
    switch(event.flag){

      case 'C':this.openDialog(null,0,null);
      break;
      case 'U': break;
      case 'A': break;
      case 'D':
      case 'R': this.utility.navigate(event.url);break;

    }
  }

  /******************************************ADDITION ***********************/
  openDialog(__clDtls: client, __clid: number, __clType: string) {
    console.log(__clDtls);
    console.log(__clid);
    console.log(__clType);

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = false;
    // dialogConfig.closeOnNavigation = false;
    // dialogConfig.disableClose = true;
    // dialogConfig.hasBackdrop = false;
    // dialogConfig.width = '60%';
    // dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    // dialogConfig.data = {
    //   flag: 'CL',
    //   id: __clid,
    //   items: __clDtls,
    //   title:
    //     (__clid == 0 ? 'Add ' : 'Update ') +
    //     (__clType == 'M'
    //       ? 'Minor'
    //       : __clType == 'P'
    //       ? 'PAN Holder'
    //       : __clType == 'N'
    //       ? 'Non Pan Holder'
    //       : 'Existing'),
    //   right: global.randomIntFromInterval(1, 60),
    //   cl_type: __clType,
    // };
    // dialogConfig.id = (__clid > 0 ? __clid.toString() : '0') + '_' + __clType;
    // try {
    //   const dialogref = this.__dialog.open(
    //     ClModifcationComponent,
    //     dialogConfig
    //   );
    //   dialogref.afterClosed().subscribe((dt) => {
    //   });
    // } catch (ex) {
    //   console.log(ex);
    //   const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    //   dialogRef.updateSize('60%');
    //   console.log(ex);
    //   this.utility.getmenuIconVisible({
    //     id: Number(dialogConfig.id),
    //     isVisible: false,
    //     flag: 'CL',
    //   });
    // }

  }


  /****************************************    END **************************/

}
