import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  __columns: string[] = ['sl_no', 'subcat_name', 'edit', 'delete'];
  __selectSubCategory = new MatTableDataSource<subcat>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private __dbIntr: DbIntrService,private __utility: UtiliService,private route: ActivatedRoute) { }
  ngOnInit(): void { 
    this.getSubCategorymaster(this.route.snapshot.queryParamMap.get('id') == null ? this.route.snapshot.queryParamMap.get('id') : ('category_id='+atob(this.route.snapshot.queryParamMap.get('id'))));
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getSubCategorymaster(this.route.snapshot.queryParamMap.get('id') == null ? this.route.snapshot.queryParamMap.get('id') : ('category_id='+atob(this.route.snapshot.queryParamMap.get('id'))));
    }
  }
  populateDT(__items: subcat) {
    // this.openDialog(__items.id, __items);
    this.__utility.navigatewithqueryparams('/main/master/subcatModify',{queryParams:{id:btoa(__items.id.toString())}})
  }

  private getSubCategorymaster(params) {
    this.__dbIntr.api_call(0, '/subcategory', params).pipe(map((x: responseDT) => x.data)).subscribe((res:subcat[]) => {
      this.setPaginator(res);
    })
  }
  private setPaginator(__res){
    this.__selectSubCategory = new MatTableDataSource(__res);
    this.__selectSubCategory.paginator = this.paginator;
  }
  
}
