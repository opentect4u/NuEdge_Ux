/**
 *
 *     parent_tab = 'T' (Transaction Report) || 'S' (Systamatic Report)
 *     Sub_tab = 'T' (Transaction Report) || 'F' (Frequency Report)
 *     rnt_tab_type = 1 (CAMS) || 2 (KFINTECH)
 *
 *
 */


import { Component, OnInit ,Inject, ElementRef, ViewChild} from '@angular/core';
// import menu from '../../../../../../assets/json/filehelp.json';
import { UtiliService } from 'src/app/__Services/utils.service';
import fileHelp from '../../../../../../assets/json/MailBack/file_help.json';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pluck } from 'rxjs/operators';
import { rnt } from 'src/app/__Model/Rnt';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { trxnTypeClmns } from 'src/app/__Utility/MailBack/trxnTypeClmns';
import { DOCUMENT } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, IFileHelpHome {


  fileType_tab:Partial<ISubmenu>[] = [];
  file_type_tab:string = 'T';  // for maintan parent tab
  rnt_type_tab:string; // for maintan third tab
  sub_tab:string; // for maintan second tab
  file_help: IFileHelpTab[] = fileHelp;
  rnt_mst_dt: Partial<ISubmenu>[] = [];
  trxnTypeMst:rntTrxnType[] = [];
  columns: { field: string; header: string; isVisible: number[] }[] = [];

  @ViewChild('trxnType') trxnType:ElementRef<HTMLInputElement>;
  @ViewChild('pTableRef') pTableRef: Table;


  rntTrxnType = new FormGroup({
    rnt_id: new FormControl(''),
    id: new FormControl('0'),
    trans_type: new FormControl('', [Validators.required]),
    trans_sub_type: new FormControl('', [Validators.required]),
    c_trans_type_code: new FormControl(''),
    c_k_trans_type: new FormControl(''),
    c_k_trans_sub_type: new FormControl(''),
    k_divident_flag: new FormControl(''),
  });

  constructor(private utility: UtiliService, private dbIntr: DbIntrService,
    @Inject(DOCUMENT) private dom: Document) {}

  ngOnInit(): void {
    this.getRnt();
  }

  changeTabDtls(ev,flag): void {
    this.trxnTypeMst = [];
    this.rntTrxnType.get('rnt_id').setValue(ev.tabDtls.id);
    this.SetColumns(ev.tabDtls.id);
    this.populateTrxnTypeinForm(null);
    switch(flag){
      case 'P':
      this.file_type_tab = this.file_help.filter(item => item.id == ev.tabDtls.id)[0].flag;
      this.fileType_tab = this.file_help.filter(item => item.id == ev.tabDtls.id)[0].sub_menu;
      if(this.file_type_tab == 'S'){
        this.sub_tab = this.fileType_tab[0].flag;
        this.getSystamaticTransactionType(this.rnt_type_tab,this.sub_tab);
      }
      else{
         //call api for Transaction Report
         this.getTransactionMst(this.rnt_type_tab);
      }
      this.setValidators();
      break;
      case 'R':
      this.rnt_type_tab = ev.tabDtls.id;
       this.getTransactionMst(this.rnt_type_tab);
      break;
      case 'S' :
      this.sub_tab = this.fileType_tab.filter(item => item.id == ev.tabDtls.id)[0].flag;
      this.getSystamaticTransactionType(this.rnt_type_tab,this.sub_tab);
      break;
    }

  }

  submitTransactionType(): void {
    const frmDt = Object.assign({}, this.rntTrxnType.value, {
      k_divident_flag:
        this.rntTrxnType.value.rnt_id == 2
          ? this.rntTrxnType.value.k_divident_flag
          : '',
      c_trans_type_code:
        this.rntTrxnType.value.rnt_id == 1
          ? this.rntTrxnType.value.c_trans_type_code
          : '',
    });
    this.dbIntr
      .api_call(
        1,
        '/rntTransTypeSubtypeAddEdit',
        this.utility.convertFormData(this.rntTrxnType.value)
      )
      .subscribe((res: any) => {
        this.utility.showSnackbar(
          res.suc == 1 ? 'Transaction Type'+ (this.rntTrxnType.value.id > 0 ? ' Updated ' : ' Saved ') +  'Successfully' : res.msg,
          res.suc
        );
        if (res.suc == 1) {
          /**
           * check if id > 0 then make update operation on array  otherwise make add operation and
           * reset table as well for add operation only
           */
          if (this.rntTrxnType.value.id > 0) {
            this.updateRow(res.data);
          } else {
            this.trxnTypeMst.unshift(res.data);
            this.pTableRef.reset();
          }
          this.populateTrxnTypeinForm(null);
          // this.rntTrxnType.
        }
      });
  }


  setValidators = () =>{
    if(this.file_type_tab == 'T'){
          this.rntTrxnType.get('c_trans_type_code').removeValidators([Validators.required]);
          this.rntTrxnType.get('trans_sub_type').setValidators([Validators.required]);
    }
    else{
      this.rntTrxnType.get('trans_sub_type').removeValidators([Validators.required]);
      if(this.sub_tab == 'T'){
        this.rntTrxnType.get('c_trans_type_code').setValidators([Validators.required]);
      }
      else{
        this.rntTrxnType.get('c_trans_type_code').removeValidators([Validators.required]);
      }
    }
    this.rntTrxnType.get('c_trans_type_code').updateValueAndValidity();
    this.rntTrxnType.get('trans_sub_type').updateValueAndValidity();
  }

  /**
   * For Update Row of Transaction Table
   * @param row_obj
   */
  updateRow = (row_obj: rntTrxnType) => {
    this.trxnTypeMst = this.trxnTypeMst.filter(
      (items: rntTrxnType, key: number) => {
        if (items.id == row_obj.id) {
          items.trans_type = row_obj.trans_type;
          items.trans_sub_type = row_obj.trans_sub_type;
          items.c_trans_type_code =
            row_obj.rnt_id == 2 ? '' : row_obj.c_trans_type_code;
          items.c_k_trans_type = row_obj.c_k_trans_type;
          items.c_k_trans_sub_type = row_obj.c_k_trans_sub_type;
          items.k_divident_flag =
            row_obj.rnt_id == 2 ? row_obj.k_divident_flag : '';
        }
        return true;
      }
    );
  };

  reset(): void {}

  getRnt(): void {
    this.dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        this.rnt_mst_dt = res
          .sort((a, b) => a.id - b.id)
          .filter((item) => item.id == 2 || item.id == 1)
          .map(({ id, rnt_name }) => ({ tab_name: rnt_name, img_src: '', id }));
      });
  }

  getTransactionMst(flag){
    if(flag){
      this.dbIntr.api_call(0,'/rntTransTypeSubtype','rnt_id=' + flag)
      .pipe(pluck('data'))
      .subscribe((res:rntTrxnType[]) =>{
        this.trxnTypeMst = res;
      })
    }
  }

  getSystamaticTransactionType(rnt_id:string,sub_tab_type:string){
      if(rnt_id && sub_tab_type){
        const api_name =  sub_tab_type == 'T' ? '/' : '/';
        this.dbIntr.api_call(0,api_name,'rnt_id=' + rnt_id)
          .pipe(pluck('data'))
          .subscribe((res:rntTrxnType[]) =>{
            this.trxnTypeMst = res;
          })
      }

  }

  filterGlobal = ($event) => {
    let value = $event.target.value;
    this.pTableRef.filterGlobal(value,'contains')
  }



   /**
   * Populate Transaction Type Data after click on edit button
   * @param trxnType
   */

   populateTrxnTypeinForm = (trxnType: rntTrxnType | null) => {
    if(trxnType){
      this.dom.documentElement.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(() => {
        this.trxnType.nativeElement.focus();
      }, 400);
    }
    /**
     * Either Populate data on form
     * Otherwise reset data
     */
    this.rntTrxnType.patchValue({
      id: trxnType ? trxnType.id : 0,
      trans_type: trxnType ? trxnType.trans_type : '',
      trans_sub_type: trxnType ? trxnType.trans_sub_type : '',
      c_trans_type_code: trxnType
        ? trxnType.rnt_id == 1
          ? trxnType.c_trans_type_code
          : ''
        : '',
      c_k_trans_type: trxnType ? trxnType.c_k_trans_type : '',
      c_k_trans_sub_type: trxnType ? trxnType.c_k_trans_sub_type : '',
      k_divident_flag: trxnType
        ? trxnType.rnt_id == 2
          ? trxnType.k_divident_flag
          : ''
        : '',
    });
  };


    /**
   * For setting columns for different R&T
   * @param rnt_id
   */
    SetColumns = (rnt_id) => {
      this.columns = trxnTypeClmns.columns.filter((item) =>
        item.isVisible.includes(rnt_id)
      );
    };


    getColumns = () =>{
      return this.utility.getColumns(this.columns);
    }

}

export interface IFileHelpHome {


  file_type_tab:string;
  rnt_type_tab:string;



  columns: { field: string; header: string; isVisible: number[] }[];

  /***
   *  holding transaction files data
   */
  trxnTypeMst:rntTrxnType[];


  fileType_tab:Partial<ISubmenu>[];

  /**
   * Holding parent Tab Data
   */
  file_help: IFileHelpTab[];

  /**
   * Holding R&T Master Data Comming from backend
   */
  rnt_mst_dt: Partial<ISubmenu>[];

  /**
   * Event Fired after tab changing
   * @params ev,flag
   */
  changeTabDtls(ev,flag): void;

  /**
   * Event Fired after submitting form and either add or update file
   */
  submitTransactionType(): void;

  /**
   * Resetting form
   */
  reset(): void;

  /**
   *  get R&T master data from backend
   */
  getRnt(): void;

  /**
   * Event For Getting Transaction Reports Data
   * @params Flag : for differentiate api
   */
  getTransactionMst(flag:string):void;

  /**
   * Event For get clicked row data and populate in the form
   * @param trxn
   */
  populateTrxnTypeinForm(trxn):void

 /**
  * Event For getting column for filter
  */
  getColumns():string[];

  /**
   * Event for set columns
   * @param id
   */
  SetColumns(id):void;

  /**
   *
   * @param ev Event for searching in datatable
   */
  filterGlobal(ev):void
}

export interface IFileHelpTab {
  id: number;
  tab_name: string;
  flag: string;
  img_src:string;
  sub_menu: ISubmenu[];
}

export interface ISubmenu {
  id: number;
  tab_name: string;
  flag: string;
  img_src:string;
}
