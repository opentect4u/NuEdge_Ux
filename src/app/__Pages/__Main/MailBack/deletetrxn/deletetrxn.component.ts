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
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UnlockTrxnComponent } from './dialog/unlock-trxn/unlock-trxn.component';
import TRXN_TYPE from '../../../../../assets/json/MailBack/mailbackMismatchTab.json';
import { IFileHelpTab } from '../file-help/home/home.component';
@Component({
  selector: 'app-deletetrxn',
  templateUrl: './deletetrxn.component.html',
  styleUrls: ['./deletetrxn.component.css'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('formbodyExpansion', [
      state('collapsed, void', style({ height: '0px', padding: '0px 20px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', padding: '10px 20px', visibility: 'visible', })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('230ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class DeletetrxnComponent implements OnInit {

  @ViewChild('primeTbl') primeTbl: Table;

  state: string | undefined = 'expanded';

  /**
   * FOR TAB HOLDER
   */
   tab:IFileHelpTab[] = TRXN_TYPE.map(({ id, tab_name, flag, img_src, sub_menu }) => ({ tab_name: tab_name, img_src: '', id, flag, sub_menu }));


   index:number = 0;


  __is_check_all_locked:boolean = false;

  /**
   * For Holding the count of Locked Transaction Count
   */
  __lock_trxn_count:number = 0;

  /**
   * For Holding the count of UnLocked Transaction Count
   */
  __unlock_trxn_count:number = 0;



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
    trans_no:new FormControl(''),
    file_type:new FormControl(TRXN_TYPE[0].flag)
  })

  constructor(
    private dbIntr:DbIntrService,
    private utility:UtiliService,
    private overlay: Overlay,
    private __dialog:MatDialog

    ) { }

  ngOnInit(): void {
    console.log(this.searchTrxn);
  }

  /**
   * Event Trigger after search button click
   *  this func will fetch transaction based on search
   */
  searchTransaction = () =>{

     if(this.searchTrxn.value.folio_no == '' && this.searchTrxn.value.trans_no == ''){
       this.utility.showSnackbar('Please provide atleast one filter criteria',2);
       return;
     }

    this.selectedTrxn= [];
    this.trxnDT = [];
    // if(!this.searchTrxn.value.folio_no){
    //    this.utility.showSnackbar('Please provide folio',2);
    //    return;
    // }
     this.dbIntr.api_call(1,'/showDeleteTransDetails',this.utility.convertFormData(this.searchTrxn.value))
       .pipe(pluck("data")).subscribe((res: Partial<TrxnRpt[]>) => {
         this.trxnDT = res;
        this.checkCount_hide_selectAll(res);
         if (res.length > 0) {
           this.toggle();
         }
     })
  }

  checkCount_hide_selectAll = (res: Partial<TrxnRpt[]>) =>{
    this.__is_check_all_locked = res.every(item => item.divi_lock_flag == 'L');
    this.__lock_trxn_count =  this.arrayCount(res, x => x.divi_lock_flag == 'L');
     this.__unlock_trxn_count = this.arrayCount(res, x => x.divi_lock_flag == 'N');
  }

  changeTabDtls = (ev) =>{
    this.searchTrxn.get('file_type').setValue(ev.tabDtls.flag);
    this.reset();
    this.trxnDT = [];
    this.selectedTrxn = [];
    this.__is_check_all_locked = false;
    this.__lock_trxn_count = 0;
    this.__unlock_trxn_count = 0;
    if(this.state === 'collapsed' ){
        this.state = 'expanded';
    }
  }

  /**
   * For Counting Number of locked and unlocked transactions
   * @param arr
   * @param predicate
   * @returns
   */
  arrayCount<T>(arr: T[], predicate: (elem: T, idx: number) => boolean) {
    return arr.reduce((prev, curr, idx) => prev + (predicate(curr, idx) ? 1 : 0), 0)
    }

 /**
  *  return columns for filtering
  * @returns
  */
  getColumns = () =>{
    return this.utility.getColumns(this.TrxnClmns);
  }
  /**
   * datatable search
   * @param $event
   */
  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.primeTbl.filterGlobal(value,'contains')
  }
  /**
   * Delete Selected Transactions
   * @returns
   */
  deleteSelectedRow = () =>{
     if((this.selectedTrxn.filter(item => item.divi_lock_flag != 'L').map(item => {return item['id']}).length) == 0){
           this.utility.showSnackbar('Please select one or more transactions to delete',2);
           return;
     }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = '30%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.data = {
      id:JSON.stringify(this.selectedTrxn.filter(item => item.divi_lock_flag != 'L').map(item => {return item['id']})),
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
             this.checkCount_hide_selectAll(this.trxnDT);
           }
        }
      });
    } catch (ex) {}

  }
  /**
   * for show/hide Search Transaction Card
   */
  toggle = () => {
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }

  /**
   * for unlocking transaction
   * @param trxn
   * @param index
   */
  unlockedTrxn = (trxn,index:number) =>{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = false;
    dialogConfig.width = '30%';
    dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();
    dialogConfig.role = "alertdialog";
    dialogConfig.disableClose=false;
    dialogConfig.data = {
      id:trxn.id,
      api_name:"/unlockTransDetails",
      title:`Unlock Transaction`,
      trans_no:trxn.trans_no,
      file_type:this.searchTrxn.value.file_type
    };
    try {
      const dialogref = this.__dialog.open(UnlockTrxnComponent, dialogConfig);
      dialogref.afterClosed().subscribe((dt) => {
        console.log(dt);
        if(dt){
          if(dt == 1){
            this.trxnDT = this.trxnDT.filter((item,index) => {
              if(item.id == trxn.id){
                item.divi_lock_flag = 'N';
                item.bu_type_lock_flag = 'N'
              }
              return true;
          });
          this.checkCount_hide_selectAll(this.trxnDT);
          }
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  reset = () =>{
    this.searchTrxn.patchValue({
      folio_no:'',
      trans_no:''
    })
  }

}
