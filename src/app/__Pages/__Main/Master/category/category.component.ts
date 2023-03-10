import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';

@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  __selectCategory:any=[];
  constructor(private __dialog: MatDialog) { }
  ngOnInit(): void {
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
    const disalogConfig = new MatDialogConfig();
    disalogConfig.width = '30%';
    disalogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Category' : 'Update Category',
      items: __items
    };
    const dialogref = this.__dialog.open(CategoryModificationComponent, disalogConfig);
    dialogref.afterClosed().subscribe(dt => {
      console.log(dt);
      if (dt?.id > 0) {
        this.__selectCategory[this.__selectCategory.findIndex(x => x.id == dt.id)].cat_name = dt?.cat_name;
        this.__selectCategory[this.__selectCategory.findIndex(x => x.id == dt.id)].product_id = dt?.product_id;
      }
    });
  }

}
