import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  __selectSubCategory:any=[];
  constructor(private __dialog: MatDialog,private __dbIntr:DbIntrService) { }
  ngOnInit(): void {this.getCategorymaster();}
  getSearchItem(__ev) {
    this.__selectSubCategory.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectSubCategory.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '30%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Sub-Category' : 'Update Sub-Category',
      items: __items
    };
    const dialogref = this.__dialog.open(SubcateModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt?.id > 0) {
        this.__selectSubCategory[this.__selectSubCategory.findIndex(x => x.id == dt.id)].category_id = dt?.category_id;
        this.__selectSubCategory[this.__selectSubCategory.findIndex(x => x.id == dt.id)].subcategory_name = dt?.subcategory_name;
      }
    });
  }
  getCategorymaster(){
    this.__dbIntr.api_call(0,'/subcategory',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectSubCategory = res;
    })
  }
}
