import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'master-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  __columns: string[] = ['sl_no', 'cat_name', 'edit', 'delete'];
  __selectCategory = new MatTableDataSource<category>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dbIntr: DbIntrService,  private __utility: UtiliService) { }
  ngOnInit(): void {
    this.getCategorymaster();
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else { this.getCategorymaster(); }

  }
  populateDT(__items: category) {
    this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  }

  private getCategorymaster() {
    this.__dbIntr.api_call(0, '/category', null).pipe(map((x: responseDT) => x.data)).subscribe((res: category[]) => {
      this.setPaginator(res);
    })
  }

  private setPaginator(__res) {
    this.__selectCategory = new MatTableDataSource(__res);
    this.__selectCategory.paginator = this.paginator;
  }
}

