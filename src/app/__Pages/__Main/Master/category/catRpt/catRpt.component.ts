import { Overlay } from '@angular/cdk/overlay';
import { Component, OnInit,Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { category } from 'src/app/__Model/__category';
import { responseDT } from 'src/app/__Model/__responseDT';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { RPTService } from 'src/app/__Services/RPT.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { global } from 'src/app/__Utility/globalFunc';
import { CategoryModificationComponent } from '../categoryModification/categoryModification.component';


@Component({
selector: 'Category-catRpt',
templateUrl: './catRpt.component.html',
styleUrls: ['./catRpt.component.css']
})
export class CatrptComponent implements OnInit {

  toppings = new FormControl();
  toppingList: any = [{id:'edit',text:'Edit'},
                          {id:'sl_no',text:'SL No'},
                          {id:'rnt_name',text:'R&T'},
                          {id:'cus_care_no',text:'Customer Care Number'},
                          {id:'cus_care_email',text:'Customer Care Email'},
                          {id:'head_contact_per',text:'Head Office Contact Person'},
                          {id:'head_contact_per_mobile',text:'Head Office Contact Person Mobile'},
                          {id:'head_contact_per_email',text:'Head Office Contact Person Email'},
                          {id:'head_contact_per_addr',text:'Head Office Contact Person Address'},
                          {id:'local_contact_per',text:'Local Office Contact Person'},
                          {id:'local_contact_per_mobile',text:'Local Office Contact Person Mobile'},
                          {id:'local_contact_per_email',text:'Local Office Contact Person Email'},
                          {id:'local_contact_per_addr',text:'Local Office Contact Person Address'},
                          {id:'delete',text:'Delete'}];


  @ViewChild('searchcat') __searchCat : ElementRef;
  __iscatspinner: boolean = false;
  __catMst: category[] = [];
  __catForm = new FormGroup({
     cat_name: new FormControl(''),
     cat_id: new FormControl(''),
     options:new FormControl('2')
  })
  __export =  new MatTableDataSource<category>([]);
  __pageNumber = new FormControl(10);
  __columns: string[] = ['edit','sl_no', 'cat_name', 'delete'];
  __exportedClmns: string[] = ['sl_no', 'cat_name'];
  __paginate: any= [];
  __selectCategory = new MatTableDataSource<category>([]);
  __isVisible: boolean = true;
constructor(
  private __Rpt: RPTService,
  public dialogRef: MatDialogRef<CatrptComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private overlay: Overlay,
  private __dialog: MatDialog,
  private __dbIntr: DbIntrService,
  private __utility: UtiliService
) {
}

ngOnInit(){
  // this.getCategorymaster();
  // this.tableExport();
  this.submit();
}
// ngAfterViewInit(){
//   this.__catForm.controls['cat_name'].valueChanges
//       .pipe(
//         tap(() => this.__iscatspinner = true),
//         debounceTime(200),
//         distinctUntilChanged(),
//         switchMap((dt) =>
//           dt?.length > 1
//             ? this.__dbIntr.searchItems(
//               '/category',
//               dt)
//             : []
//         ),
//         map((x: responseDT) => x.data),
//       )
//       .subscribe({
//         next: (value) => {
//           this.__catMst = value;
//           this.searchResultVisibility('block','A')
//           this.__iscatspinner = false;
//         },
//         complete: () => console.log(''),
//         error: (err) => console.log(),
//       });
// }
tableExport(){
  const __catExport = new FormData();
  __catExport.append('cat_name',this.__catForm.value.cat_name ? this.__catForm.value.cat_name : '');
  // __catExport.append('cat_id',this.__catForm.value.cat_id ? this.__catForm.value.cat_id : '');

  this.__dbIntr.api_call(1,'/categoryExport',__catExport).pipe(map((x: any) => x.data)).subscribe((res: category[]) =>{
    this.__export = new MatTableDataSource(res);
  })
}
// searchResultVisibility(display_mode,__type){
//    this.__searchCat.nativeElement.style.display = display_mode;
// }
private getCategorymaster(__paginate: string | null = '10') {
  this.__dbIntr
    .api_call(0, '/category', 'paginate=' + __paginate)
    .pipe(map((x: responseDT) => x.data))
    .subscribe((res: any) => {
      this.setPaginator(res.data);
      this.__paginate = res.links;
    });
}
setPaginator(__res){
  this.__selectCategory = new MatTableDataSource(__res);
}
getPaginate(__paginate) {
  if (__paginate.url) {
    this.__dbIntr
      .getpaginationData(
        __paginate.url + ('&paginate=' + this.__pageNumber.value)
        +('&cat_name='+this.__catForm.value.cat_name)
      )
      .pipe(map((x: any) => x.data))
      .subscribe((res: any) => {
        this.setPaginator(res.data);
        this.__paginate = res.links;
      });
  }
}
getval(__paginate) {
  this.__pageNumber.setValue(__paginate.toString());
  // this.getCategorymaster(this.__pageNumber.value);
  this.submit();
}

populateDT(__items: category) {
  // this.__utility.navigatewithqueryparams('/main/master/catModify',{queryParams:{id:btoa(__items.id.toString())}})
  this.openDialog(__items, __items.id);
}
showCorrospondingAMC(__items) {
  this.__utility.navigatewithqueryparams(
    'main/master/productwisemenu/subcategory',
    {
      queryParams: { id: btoa(__items.id.toString()) },
    }
  );
}
openDialog(__category: category | null = null, __catId: number) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = false;
  dialogConfig.closeOnNavigation = false;
  dialogConfig.disableClose = true;
  dialogConfig.hasBackdrop = false;
  dialogConfig.width = '40%';
  dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
  dialogConfig.data = {
    flag: 'C',
    id: __catId,
    items: __category,
    title: __catId == 0 ? 'Add Category' : 'Update Category',
    product_id:this.data.product_id,
    right: global.randomIntFromInterval(1, 60),
  };
  dialogConfig.id = __catId > 0 ? __catId.toString() : '0';
  try {
    const dialogref = this.__dialog.open(
      CategoryModificationComponent,
      dialogConfig
    );
    dialogref.afterClosed().subscribe((dt) => {
      if (dt) {
        if (dt?.id > 0) {
          this.updateRow(dt.data);
        } else {
          this.__selectCategory.data.unshift(dt.data);
          this.__selectCategory._updateChangeSubscription();
        }
      }
    });
  } catch (ex) {
    const dialogRef = this.__dialog.getDialogById(dialogConfig.id);
    dialogRef.updateSize('40%');
    this.__utility.getmenuIconVisible({
      id: __catId,
      isVisible: false,
      flag: 'C',
    });
  }
}
private updateRow(row_obj: category) {
  this.__selectCategory.data = this.__selectCategory.data.filter(
    (value: category, key) => {
      if (value.id == row_obj.id) {
        value.cat_name = row_obj.cat_name;
        value.product_id = row_obj.product_id;
      }
      return true;
    }
  );
  this.__export.data = this.__export.data.filter(
    (value: category, key) => {
      if (value.id == row_obj.id) {
        value.cat_name = row_obj.cat_name;
        value.product_id = row_obj.product_id;
      }
      return true;
    }
  );
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

exportPdf(){
  this.__Rpt.downloadReport('#category',
  {
    title: 'Category '
  }, 'Category')
}
submit(){
  const __amcSearch = new FormData();
  __amcSearch.append('cat_name',this.__catForm.value.cat_name);
  __amcSearch.append('paginate',this.__pageNumber.value);
   this.__dbIntr.api_call(1,'/categoryDetailSearch',__amcSearch).pipe(map((x: any) => x.data)).subscribe(res => {
    this.__paginate =res.links;
    this.setPaginator(res.data);
    //  this.showColumns();
     this.tableExport();
   })
}
// outsideClick(__ev,mode){
//   if(__ev){
//     this.searchResultVisibility('none',mode)
//  }
// }
// getItems(__items,__type){
//   switch(__type){
//    case 'A':  break;
//    case 'C':   this.__catForm.controls['cat_id'].setValue(__items.id)
//                this.__catForm.controls['cat_name'].reset(__items.rnt_name,{ onlySelf: true,emitEvent: false})
//                this.searchResultVisibility('none','C');
//                break;
//    default: break;
//   }
// }
// showColumns(){

// }
}
