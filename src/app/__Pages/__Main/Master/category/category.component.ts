import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';

@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  __columns: string[] = ['sl_no','cat_name','edit','delete'];
  __selectCategory= new MatTableDataSource();
  constructor(private __dialog: MatDialog,private __dbIntr: DbIntrService) { }
  ngOnInit(): void {
    this.getCategorymaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id, '');
    }
    else if(__ev.flag == 'F') {
      // this.__selectCategory.push(__ev.item);
      this.__selectCategory = new MatTableDataSource([__ev.item]);
    }
    else{this.getCategorymaster();}

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
      if (dt) {
        if(dt?.id > 0){
        this.updateRow(dt.data);
        }
        else{
          this.addRow(dt.data);
        }
      }
    });
  }
  getCategorymaster(){
    this.__dbIntr.api_call(0,'/category',null).pipe(map((x:any) => x.data)).subscribe(res => {
      this.__selectCategory = new MatTableDataSource(res);
    })
  }
  updateRow(row_obj) {
    this.__selectCategory.data = this.__selectCategory.data.filter((value: any, key) => {
      if (value.id == row_obj.id) {
        value.cat_name = row_obj.cat_name;
        value.product_id = row_obj.product_id;
      }
      return true;
    });
  }
  addRow(row_obj) {
    this.__selectCategory.data.push(row_obj);
    this.__selectCategory._updateChangeSubscription();
  }
}
