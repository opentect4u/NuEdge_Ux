import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { ScmModificationComponent } from './scmModification/scmModification.component';

@Component({
  selector: 'master-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent implements OnInit {
  __selectScheme:any=[];
  constructor(private __dialog: MatDialog,private __dbIntr:DbIntrService) { }
  ngOnInit(): void {this.getSchememaster();}
  getSearchItem(__ev) {
    this.__selectScheme.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectScheme.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '60%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Scheme' : 'Update Scheme',
      items: __items
    };
    const dialogref = this.__dialog.open(ScmModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectScheme[this.__selectScheme.findIndex(x => x.id == dt.id)].category_id = dt?.category_id;
        this.__selectScheme[this.__selectScheme.findIndex(x => x.id == dt.id)].subcategory_id = dt?.subcategory_id;
        this.__selectScheme[this.__selectScheme.findIndex(x => x.id == dt.id)].amc_id = dt?.amc_id;
        this.__selectScheme[this.__selectScheme.findIndex(x => x.id == dt.id)].scheme_name = dt?.scheme_name;
        this.__selectScheme[this.__selectScheme.findIndex(x => x.id == dt.id)].product_id = dt?.product_id;
      }
    });
  }
  getSchememaster(){
    this.__dbIntr.api_call(0,'/scheme',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectScheme = res;
    })
  }
}
