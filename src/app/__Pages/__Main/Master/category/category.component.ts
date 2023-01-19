import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { CategoryModificationComponent } from './categoryModification/categoryModification.component';

@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  __columns: string[] = ['sl_no', 'cat_name', 'edit', 'delete'];
  __selectCategory = new MatTableDataSource<category>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dialog: MatDialog, private __dbIntr: DbIntrService) { }
  ngOnInit(): void {
    this.getCategorymaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
      this.openDialog(__ev.id);
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else { this.getCategorymaster(); }

  }
  populateDT(__items: category) {
    this.openDialog(__items.id, __items);
  }
  private openDialog(id: number, __items: category | null = null) {
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
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        }
        else {
          this.addRow(dt.data);
        }
      }
    });
  }
  private getCategorymaster() {
    this.__dbIntr.api_call(0, '/category', null).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.setPaginator(res);
    })
  }
  private updateRow(row_obj: category) {
    this.__selectCategory.data = this.__selectCategory.data.filter((value: category, key) => {
      if (value.id == row_obj.id) {
        value.cat_name = row_obj.cat_name;
        value.product_id = row_obj.product_id;
      }
      return true;
    });
  }
  private addRow(row_obj: category) {
    this.__selectCategory.data.unshift(row_obj);
    this.__selectCategory._updateChangeSubscription();
  }
  private setPaginator(__res) {
    this.__selectCategory = new MatTableDataSource(__res);
    this.__selectCategory.paginator = this.paginator;
  }
}

