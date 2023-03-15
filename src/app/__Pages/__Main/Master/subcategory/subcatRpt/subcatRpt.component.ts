import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit ,Inject, ElementRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { subcat } from 'src/app/__Model/__subcategory';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { SubcateModificationComponent } from '../subcateModification/subcateModification.component';

@Component({
selector: 'subcatRpt-component',
templateUrl: './subcatRpt.component.html',
styleUrls: ['./subcatRpt.component.css']
})
export class SubcatrptComponent implements OnInit {

  __sortAscOrDsc: any= {active:'',direction:'asc'};
  @ViewChild('searchcat') __searchCat : ElementRef;
  @ViewChild('searchsubcat') searchsubcat : ElementRef;
  __export =  new MatTableDataSource<subcat>([]);
  __catMst: category[] =[];
  __subcatMst: subcat[]=[];
  __iscatspinner: boolean = false;
  __issubcatspinner: boolean = false;
 __isVisible: boolean =true;
 __subcatForm = new FormGroup({
  subcat_name: new FormControl(''),
  subcat_id: new FormControl(this.data.sub_cat_id ? this.data.sub_cat_id : ''),
  cat_name: new FormControl(''),
  cat_id: new FormControl(this.data.cat_id ? this.data.cat_id : ''),
  options:new FormControl('2')
});
__selectSubCategory = new MatTableDataSource<subcat>([]);
__pageNumber = new FormControl(10);
__paginate: any = [];
__exportedClmns:string[] = ['sl_no', 'cat_name','subcategory_name'];
__columns: string[] = [ 'edit','delete','sl_no', 'cat_name','subcategory_name'];
constructor(
  private __Rpt: RPTService,
  private __dialog: MatDialog,
  private __utility: UtiliService,
  public dialogRef: MatDialogRef<SubcatrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
   private __dbIntr: DbIntrService
) {
}
exportPdf(){
  this.__Rpt.downloadReport('#subcategory',
  {
    title: 'SubCategory '
  }, 'SubCategory')
}

ngOnInit(){
  this.getSubcatMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}

 getSubcatMst(column_name: string | null = null,sort_by: string | null= null){
  const __amcSearch = new FormData();
  __amcSearch.append('cat_id',global.getActualVal(this.__subcatForm.value.cat_id));
  __amcSearch.append('subcat_id',global.getActualVal(this.__subcatForm.value.subcat_id));
  __amcSearch.append('paginate',this.__pageNumber.value);
  __amcSearch.append('column_name',column_name ? column_name : '');
  __amcSearch.append('sort_by',sort_by ? sort_by : '');
   this.__dbIntr.api_call(1,'/subcategoryDetailSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
     this.tableExport(column_name,sort_by);
   })


 }
getSubCategorymaster(
  params: string | null = null,
  __paginate: string | null = '10'
){
  this.__dbIntr
  .api_call(0, '/subcategory', 'paginate=' + __paginate)
  .pipe(map((x: responseDT) => x.data))
  .subscribe((res: any) => {
    this.setPaginator(res.data);
    this.__paginate = res.links;
  });
}
private setPaginator(__res) {
  this.__selectSubCategory = new MatTableDataSource(__res);
}
 ngAfterViewInit(){
  this.__subcatForm.controls['cat_name'].valueChanges
  .pipe(
    tap(() => this.__iscatspinner = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1
        ? this.__dbIntr.searchItems(
          '/category',
          dt)
        : []
    ),
    map((x: responseDT) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__subcatForm.controls['cat_id'].setValue('')
      this.__catMst = value;
      this.searchResultVisibility('block','C')
      this.__iscatspinner = false;
    },
    complete: () => console.log(''),
    error: (err) => console.log(),
  });


  this.__subcatForm.controls['subcat_name'].valueChanges
  .pipe(
    tap(() => this.__issubcatspinner = true),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((dt) =>
      dt?.length > 1
        ? this.__dbIntr.searchItems(
          '/subcategory',
          dt)
        : []
    ),
    map((x: responseDT) => x.data),
  )
  .subscribe({
    next: (value) => {
      this.__subcatForm.controls['subcat_id'].setValue('');
      this.__subcatMst = value;
      this.searchResultVisibility('block','S')
      this.__issubcatspinner = false;
    },
    complete: () => console.log(''),
    error: (err) => console.log(),
  });
 }
fullScreen(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.addPanelClass('full_screen');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
minimize(){
  this.dialogRef.removePanelClass('mat_dialog');
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.updateSize("40%",'55px');
  this.dialogRef.updatePosition({bottom: "0px" ,right: this.data.right+'px' });
}
maximize(){
  this.dialogRef.removePanelClass('full_screen');
  this.dialogRef.addPanelClass('mat_dialog');
  this.dialogRef.updatePosition({top:'0px'});
  this.__isVisible = !this.__isVisible;
}
submit(){
  this.getSubcatMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
outsideClick(__ev,mode){
  if(__ev){
    this.searchResultVisibility('none',mode)
 }
}
getItems(__items,__type){
  console.log(__type);

  switch(__type){
   case 'S': this.__subcatForm.controls['subcat_id'].setValue(__items.id)
              this.__subcatForm.controls['subcat_name'].reset(__items.subcategory_name,{ onlySelf: true,emitEvent: false})
              this.searchResultVisibility('none','S');
              break;
   case 'C':   this.__subcatForm.controls['cat_id'].setValue(__items.id)
               this.__subcatForm.controls['cat_name'].reset(__items.cat_name,{ onlySelf: true,emitEvent: false})
               this.searchResultVisibility('none','C');
               break;
   default: break;
  }
}
tableExport(column_name: string | null = null,sort_by: string | null= null){
  const __catExport = new FormData();
  __catExport.append('cat_id',this.__subcatForm.value.cat_id ? this.__subcatForm.value.cat_id : '');
  __catExport.append('subcat_id',this.__subcatForm.value.subcat_id ? this.__subcatForm.value.subcat_id : '');
  __catExport.append('column_name',column_name ? column_name : '');
  __catExport.append('sort_by',sort_by ? sort_by : '');
  this.__dbIntr.api_call(1,'/subcategoryExport',__catExport).pipe(map((x: any) => x.data)).subscribe((res: subcat[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}
searchResultVisibility(display_mode,__type){
  console.log(__type);
  console.log(display_mode);


  switch(__type){
    case 'S' : this.searchsubcat.nativeElement.style.display = display_mode;break;
    case 'C' :this.__searchCat.nativeElement.style.display = display_mode;break;
    default: break;
  }

}
getval(__paginate) {
  this.__pageNumber.setValue(__paginate.toString());
  this.getSubcatMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url
        + ('&paginate=' + this.__pageNumber.value)
        +('&cat_id=' + this.__subcatForm.value.cat_id)
        +('&subcat_id=' + this.__subcatForm.value.subcat_id)
        + ('&column_name='+ this.__sortAscOrDsc.active)
        + ('&sort_by='+ this.__sortAscOrDsc.sort_by)
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}
openDialog(__subcategory: subcat | null = null, __subcatId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'S',
    id: __subcatId,
    items: __subcategory,
    title: __subcatId == 0 ? 'Add SubCategory' : 'Update SubCategory',
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __subcatId > 0 ? __subcatId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      SubcateModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectSubCategory.data.unshift(dt.data);
          this.__selectSubCategory._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: Number(dialogConfig.id),
      isVisible: false,
      flag: 'S',
    });
  }
}
populateDT(__items){
  this.openDialog(__items,__items.id);
}
updateRow(row_obj: subcat) {
  this.__selectSubCategory.data = this.__selectSubCategory.data.filter(
    (value: subcat, key) => {
      if (value.id == row_obj.id) {
        value.subcategory_name = row_obj.subcategory_name;
        value.category_id = row_obj.category_id;
        value.cat_name = row_obj.cat_name
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: subcat, key) => {
      if (value.id == row_obj.id) {
        value.subcategory_name = row_obj.subcategory_name;
        value.category_id = row_obj.category_id;
        value.cat_name = row_obj.cat_name
      }
      return true;
    }
  );
}
refreshOrAdvanceFlt(){
  this.__subcatForm.reset();
  this.__subcatForm.patchValue({
    options:'2'
  });
  this.getSubcatMst(this.__sortAscOrDsc.active,this.__sortAscOrDsc.direction);
}
sortData(sort){
  this.__sortAscOrDsc = sort;
  this.getSubcatMst(sort.active,sort.direction!='' ? sort.direction : 'asc');
}
delete(__el,index){
  const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.role = "alertdialog";
    dialogConfig.data = {
      flag: 'S',
      id: __el.id,
      title: 'Delete '  + __el.subcategory_name,
      api_name:'/subcatDelete'
    };
    const dialogref = this.__dialog.open(
      DeletemstComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if(dt){
        if(dt.suc == 1){
          this.__selectSubCategory.data.splice(index,1);
          this.__selectSubCategory._updateChangeSubscription();
          this.__export.data.splice(this.__export.data.findIndex((x: any) => x.id == __el.id),1);
          this.__export._updateChangeSubscription();
        }
      }

    })
}
}
