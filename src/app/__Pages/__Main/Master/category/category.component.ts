import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';

@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  __selectCategory:any=[];
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit(): void {
    this.getCategorymaster();
  }
  getSearchItem(__ev) {
    this.__selectCategory.length = 0;
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else {
      this.__selectCategory.push(__ev.item);
    }
  }
  populateDT(__items) {
    this.openDialog(__items.id, __items);
  }
  openDialog(id, __items) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Category' : 'Update Category',
      items: __items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(CategoryModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
      if (dt?.id > 0) {
        this.__selectCategory[this.__selectCategory.findIndex(x => x.id == dt.id)].cat_name = dt?.cat_name;
        this.__selectCategory[this.__selectCategory.findIndex(x => x.id == dt.id)].product_id = dt?.product_id;
      }
    });
  }
  getCategorymaster(){
    this.__dbIntr.api_call(0,'/category',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectCategory = res;
    })
  }

}
