import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { SubcateModificationComponent } from './subcateModification/subcateModification.component';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  __pageNumber= new FormControl(10);
  __paginate:any=[];
  __menu = [{"parent_id": 4,"menu_name": "Manual Entry","has_submenu": "N","url": "","icon":"","id":23,"flag":"M"},
            {"parent_id": 4,"menu_name": "Upload CSV","has_submenu": "N","url": "main/master/uploadSubcat","icon":"","id":24,"flag":"U"}
          ]
  __columns: string[] = ['sl_no', 'subcat_name', 'edit', 'delete'];
  __selectSubCategory = new MatTableDataSource<subcat>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private __dialog:MatDialog,
    private overlay:Overlay,
    private __dbIntr: DbIntrService,
    private __utility: UtiliService,
    private route: ActivatedRoute) { }
  ngOnInit(): void { 
    this.getSubCategorymaster(this.route.snapshot.queryParamMap.get('id') == null ? '' : ('&category_id='+atob(this.route.snapshot.queryParamMap.get('id'))));
  }
  getSearchItem(__ev) {
    if (__ev.flag == 'A') {
    }
    else if (__ev.flag == 'F') {
      this.setPaginator([__ev.item]);
    }
    else {
      this.getSubCategorymaster(this.route.snapshot.queryParamMap.get('id') == null ? '' : ('&category_id='+atob(this.route.snapshot.queryParamMap.get('id'))));
    }
  }
  populateDT(__items: subcat) {
    this.openDialog(__items,__items.id);
    // this.__utility.navigatewithqueryparams('/main/master/subcatModify',{queryParams:{id:btoa(__items.id.toString())}})
  }

  private getSubCategorymaster(params:string | null = null,__paginate:string | null = "10") {
    this.__dbIntr.api_call(0, '/subcategory', 'paginate='+__paginate+params).pipe(map((x: responseDT) => x.data)).subscribe((res:any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;

    })
  }
  private setPaginator(__res){
    this.__selectSubCategory = new MatTableDataSource(__res);
    this.__selectSubCategory.paginator = this.paginator;
  }
  openDialog(__subcategory: subcat | null = null , __subcatId: number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = "40%";
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data ={
      flag:'S',
      id:__subcatId,
      items:__subcategory,
      title: __subcatId == 0 ? 'Add SubCategory' : 'Update SubCategory',
      right:global.randomIntFromInterval(1,60)
    }
    dialogConfig.id = __subcatId > 0  ? __subcatId.toString() : "0";
    try{
      const dialogref = this.__dialog.open(SubcateModificationComponent, dialogConfig);
      dialogref.afterClosed().subscribe(dt => {
        if (dt) {
          if (dt?.id > 0) {
            this.updateRow(dt.data);
          }
          else {
            this.__selectSubCategory.data.unshift(dt.data);
            this.__selectSubCategory._updateChangeSubscription();
          }
        }
      });
    }
    catch(ex){
      const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
      dialogRef.updateSize("40%");
      this.__utility.getmenuIconVisible({id:Number(dialogConfig.id),isVisible:false,flag:"S"})
    }
  }
  updateRow(row_obj: subcat){
    this.__selectSubCategory.data = this.__selectSubCategory.data.filter((value: subcat, key) => {
      if (value.id == row_obj.id) {
        value.subcategory_name = row_obj.subcategory_name;
        value.category_id = row_obj.category_id
      }
      return true;
    });
  }
  navigate(__menu){
    switch(__menu.flag){
      case 'M' :this.openDialog(null,0); break;
      case 'U' :this.__utility.navigate(__menu.url); break;
       default:break;
    }
  }
  getval(__paginate){
    console.log(__paginate);
    this.__pageNumber.setValue(__paginate.toString())
     this.getSubCategorymaster('',this.__pageNumber.value);
 }
 getPaginate(__paginate){
    if(__paginate.url){
     this.__dbIntr.getpaginationData(__paginate.url + ('&paginate='+this.__pageNumber.value)).pipe(map((x: any) => x.data)).subscribe((res: any) => {
       this.setPaginator(res.data);
       this.__paginate = res.links;
     })
    }
 }
}
