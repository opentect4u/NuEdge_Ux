import { Overlay } from '@angular/cdk/overlay';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  // MAT_DIALOG_DATA,

  MatDialogConfig,
  // MatDialogRef
} from '@angular/material/dialog';
import { Table } from 'primeng/table';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
// import { responseDT } from 'src/app/__Model/__responseDT';
import { scheme } from 'src/app/__Model/__schemeMst';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { deleteTrxnColumn } from 'src/app/__Utility/TransactionRPT/trnsClm';
import { DeletemstComponent } from 'src/app/shared/deleteMst/deleteMst.component';
@Component({
  selector: 'app-deletetrxn',
  templateUrl: './deletetrxn.component.html',
  styleUrls: ['./deletetrxn.component.css']
})
export class DeletetrxnComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl :Table

   /**
   * Hold those transaction which will come based on search
   */
   trxnDT:Partial<TrxnRpt[]> = [];


  /**
   * Hold column
   */
   TrxnClmns:column[] = deleteTrxnColumn.column;

   /**
    * row selection value for delete
    */
   selectedTrxn:Partial<TrxnRpt[]> = [];


  /**
   * Hold the visibility status of spinner while search
   */
  // __isscmspinvisible:boolean =false;

  /**
   * Hold the visibility status of search scheme
   */
  //  displayMode_scheme:string;

  /**
   * Hold the scheme data after search
   */
  schemeMst:scheme[] = [];

  /**
   * Form for search transaction
   */
  searchTrxn = new FormGroup({
    folio_no:new FormControl(''),
    scheme_name: new FormControl(''),
    scheme_id: new FormControl(''),
    trans_no:new FormControl('')
  })

  constructor(
    private dbIntr:DbIntrService,
    private utility:UtiliService,
    private overlay: Overlay,
    private __dialog:MatDialog
    ) { }

  ngOnInit(): void {}

  // ngAfterViewInit(){
  //   this.searchTrxn.controls['scheme_name'].valueChanges.pipe(
  //     tap(() => (this.__isscmspinvisible = true)),
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     switchMap((dt) =>
  //       dt?.length > 1 ? this.dbIntr.ReportTINSearch('/scheme', dt) : []
  //     ),
  //     map((x: responseDT) => x.data)
  //   )
  //   .subscribe({
  //     next: (value:scheme[]) => {
  //       this.schemeMst = value;
  //       this.searchResultVisibilityForScheme('block');
  //       this.__isscmspinvisible = false;
  //       this.searchTrxn.controls['scheme_id'].reset('');
  //     },
  //     complete: () => console.log(''),
  //     error: (err) => (this.__isscmspinvisible = false),
  //   });
  // }


  /**
   * get result after click on particular item from search list
   * @param ev
   */
  // getSelectedItemsFromParent = (ev) =>{
  //     // console.log(ev);
  //     this.getItems(ev.item,ev.flag);
  // }

  /**
   * function for hide search list after click on outside
   * & same function is used for  showing search list
   * @param mode = 'none' | 'block'
   */
  // searchResultVisibilityForScheme = (mode) =>{
  //   this.displayMode_scheme = mode;
  // }

  /**
   *
   * @param __items holds the search result
   * @param __mode  = 'S' (for scheme field populated)
   */
  // getItems = (__items:scheme, __mode:string) => {
  //   switch (__mode) {
  //     case 'C':
  //       this.searchTrxn.controls['scheme_name'].reset(__items.scheme_name, {
  //         emitEvent: false,
  //       });
  //       this.searchTrxn.controls['scheme_id'].reset(__items.id);
  //       this.searchResultVisibilityForScheme('none');
  //       break;
  //     default:break;
  //   }
  // }

  /**
   * Event Trigger after search button click
   *  this func will fetch transaction based on search
   */
  searchTransaction = () =>{
    if(!this.searchTrxn.value.folio_no){
       this.utility.showSnackbar('Please provide folio',2);
       return;
    }
     this.dbIntr.api_call(1,'/showDeleteTransDetails',this.utility.convertFormData(this.searchTrxn.value))
     .pipe(pluck("data")).subscribe((res:Partial<TrxnRpt[]>) =>{
          this.trxnDT = res;
     })

  }

  getColumns = () =>{
    return this.utility.getColumns(this.TrxnClmns);
  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  deleteSelectedRow = () =>{
     if(this.selectedTrxn.length == 0){
           this.utility.showSnackbar('Sorry!!No transactions are selected',2);
           return;
     }
     const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = '30%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      id:JSON.stringify(this.selectedTrxn.map(item => {return item['id']})),
      api_name:"/DeleteTransDetails",
      title:'Delete Transactions'
    };
    try {
      const dialogref = this.__dialog.open(DeletemstComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        if (dt) {
           if(JSON.parse(dt.id).length > 0){
             this.trxnDT = this.trxnDT.filter(item => !JSON.parse(dt.id).includes(item.id));
             this.selectedTrxn = []
           }
        }
      });
    } catch (ex) {}

  }

  // deleteTrxn = () =>{
  //   this.dbIntr.api_call()
  // }

}
