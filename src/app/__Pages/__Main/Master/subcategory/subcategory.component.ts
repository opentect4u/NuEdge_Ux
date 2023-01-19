import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  __columns: string[] = ['sl_no', 'subcat_name', 'edit', 'delete'];
  __selectSubCategory = new MatTableDataSource<subcat>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) { }
  ngOnInit(): void { this.getSubCategorymaster(); }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getSubCategorymaster();
    }
  }
  populateDT(__items: subcat) {
    this.openDialog(__items.id, __items);
  }
  private openDialog(id:number, __items: subcat | null = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: id,
      title: id == 0 ? 'Add Sub-Category' : 'Update Sub-Category',
      items: __items
    };
    dialogConfig.autoFocus = false;
    const dialogref = this.__dialog.open(SubcateModificationComponent, dialogConfig);
    dialogref.afterClosed().subscribe(dt => {
      if (dt) {
        if (dt.id > 0) {
          this.updateRow(dt.data);
        }
        else {
          this.addRow(dt.data);
        }
      }
    });
  }
  private getSubCategorymaster() {
    this.__dbIntr.api_call(0, '/subcategory', null).pipe(map((x: responseDT) => x.data)).subscribe((res:subcat[]) => {
      this.setPaginator(res);
    })
  }
  private updateRow(row_obj: subcat) {
    this.__selectSubCategory.data = this.__selectSubCategory.data.filter((value: subcat, key) => {
      if (value.id == row_obj.id) {
        value.subcategory_name = row_obj.subcategory_name;
        value.category_id = row_obj.category_id
      }
      return true;
    });
  }
  private addRow(row_obj: subcat) {
    this.__selectSubCategory.data.unshift(row_obj);
    this.__selectSubCategory._updateChangeSubscription();
  }
  private setPaginator(__res){
    this.__selectSubCategory = new MatTableDataSource(__res);
    this.__selectSubCategory.paginator = this.paginator;
  }
  
}
