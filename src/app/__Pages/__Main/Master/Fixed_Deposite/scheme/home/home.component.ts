import { Component, OnInit } from '@angular/core';
import menu from '../../../../../../../assets/json/Master/commonMenuMst.json';
import { ActivatedRoute } from '@angular/router';
import { UtiliService } from 'src/app/__Services/utils.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ScmRptComponent } from '../Dialog/scm-rpt/scm-rpt.component';
import { ScmCrudComponent } from '../Dialog/scm-crud/scm-crud.component';
import { global } from 'src/app/__Utility/globalFunc';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menu = menu;
  constructor(
    private rtDt:ActivatedRoute,
    private __utility: UtiliService,
    private __dialog: MatDialog,
    private overlay: Overlay,
    private __dbIntr: DbIntrService
  ) { }

  ngOnInit(): void {
    if(this.rtDt.snapshot.queryParamMap.get('id')){
      this.previewParticularcompany(atob(this.rtDt.snapshot.queryParamMap.get('id')))
    }
  }
  previewParticularcompany(id){
    this.__dbIntr.api_call(0,'/fd/scheme','id='+id).pipe(pluck("data")).subscribe(res =>{
     this.openDialog(res[0],res[0].id)
   })
  }

  getItems(__el){
    switch (__el.flag) {
      case 'M':
        this.openDialog(null, 0);
        break;
      case 'U':
        this.__utility.navigate('/main/master/fixedeposit/scheme/uploadscheme');
        break;
        case 'R':
          this.openDialogForReport();
          break;
      default:
        break;
    }
  }
  openDialog(__scheme ,__id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      flag: 'SCM',
      id: __id,
      scheme: __scheme,
      title: __id == 0 ? 'Add Scheme' : 'Update Scheme',
      right: global.randomIntFromInterval(1,60),
    };

    dialogConfig.id = __id > 0 ? __id.toString() : '0';
    try {
      const dialogref = this.__dialog.open(
        ScmCrudComponent,
        dialogConfig
      );
      dialogref.afterClosed().subscribe((dt) => {});
    } catch (ex) {
      console.log(ex);
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize('60%');
      this.__utility.getmenuIconVisible({
        id: Number(dialogConfig.id),
        isVisible: false,
        flag: 'SCM',
      });
    }

  }

  openDialogForReport(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '100%';
    dialogConfig.height = '100%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.panelClass = "fullscreen-dialog"
    dialogConfig.id = "FDSCM",
    dialogConfig.data = {
      flag: 'FDSCM',
    }
    try {
      const dialogref = this.__dialog.open(
        ScmRptComponent,
        dialogConfig
      );
    } catch (ex) {
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.addPanelClass('mat_dialog');
      this.__utility.getmenuIconVisible({
        flag:'FDSCM',
        id:dialogConfig.id
      });
    }

  }
}
