import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { mutualFund } from 'src/app/__Model/__MutualFund';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { Cmn_dialogComponent } from '../common/cmn_dialog/cmn_dialog.component';

@Component({
  selector: 'mf-NFO',
  templateUrl: './NFO.component.html',
  styleUrls: ['./NFO.component.css']
})
export class NFOComponent implements OnInit {
  
  __nfoMst= new MatTableDataSource<mutualFund>([]);
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) {}

  ngOnInit() {
    this.getNFOMst()
  }
  getSearchItem(__ev){
    if(__ev.flag == 'A'){
      this.openDialog(null,'');
      }
      else if(__ev.flag == 'F'){
        this.__nfoMst = new MatTableDataSource([__ev.item]);
        }
        else{
            this.getNFOMst();
        }
  }
  openDialog(id: string | null = null,items){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '98%';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = {
      id: id,
      title: 'NFO Trax',
      data: items,
      trans_type: 'NF',
      parent_id:1
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(Cmn_dialogComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        if(dt.id){
          this.updateRow(dt.data);
        }
        else{
          this.addRow(dt.data);
        }
      }
    });
  }
  addRow(row_obj){
    this.__nfoMst.data.unshift(row_obj);
    this.__nfoMst._updateChangeSubscription();
  }
  getNFOMst(){
    this.__dbIntr.api_call(0,'/mfTraxShow?trans_type_id=4',null).pipe(map((x: responseDT) => x.data)).subscribe((res: mutualFund[]) =>{
      this.__nfoMst = new MatTableDataSource(res);
     })
  }
  getSelectedItemForUpdate(__ev: mutualFund) {
    this.openDialog(__ev.tin_no, __ev);
  }
  updateRow(row_obj){
    this.__nfoMst.data[this.__nfoMst.data.findIndex((x: any) => x.tin_no == row_obj.tin_no)] = row_obj;
    this.__nfoMst._updateChangeSubscription();
  }
}
