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
import { ISystematicTransaction, ISystematiceFrequency, rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { systamaticFreqClmns, systamaticTransClmns, trxnTypeClmns } from 'src/app/__Utility/MailBack/trxnTypeClmns';
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
  trxnTypeMst:any = [];
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
    freq_name:new FormControl(''),
    freq_code: new FormControl('')
  });

  constructor(private utility: UtiliService, private dbIntr: DbIntrService,
    @Inject(DOCUMENT) private dom: Document) {
    }

  ngOnInit(): void {
    this.getRnt();
  }

  changeTabDtls(ev,flag): void {
    this.trxnTypeMst = [];
    this.populateTrxnTypeinForm(null);
    switch(flag){
      case 'P':
      this.file_type_tab = this.file_help.filter(item => item.id == ev.tabDtls.id)[0].flag;
      console.log(this.file_type_tab);
      this.fileType_tab = this.file_help.filter(item => item.id == ev.tabDtls.id)[0].sub_menu;
      if(this.file_type_tab == 'S'){
        this.sub_tab = this.fileType_tab[0].flag;
        this.getSystamaticTransactionType(this.rnt_type_tab,this.sub_tab);
      }
      else{
        this.sub_tab='';
         //call api for Transaction Report
         this.getTransactionMst(this.rnt_type_tab);
      }

      break;
      case 'R':
      this.rnt_type_tab = ev.tabDtls.id;
      if(this.file_type_tab == 'S'){
        this.sub_tab = this.fileType_tab[0].flag;
        this.getSystamaticTransactionType(this.rnt_type_tab,this.sub_tab);
      }
      else{
        this.sub_tab='';
         //call api for Transaction Report
         this.getTransactionMst(this.rnt_type_tab);
      }
      break;
      case 'S' :
      this.sub_tab = this.fileType_tab.filter(item => item.id == ev.tabDtls.id)[0].flag;
      this.getSystamaticTransactionType(this.rnt_type_tab,this.sub_tab);
      break;
    }
    this.setValidators();
    this.rntTrxnType.get('rnt_id').setValue(this.rnt_type_tab);
    this.SetColumns(this.rnt_type_tab);


  }

  submitTransactionType(): void {
  console.log(this.sub_tab);
    let api_name:string;
    let formdata = new FormData();
    if(this.file_type_tab == 'T'){
      api_name = '/rntTransTypeSubtypeAddEdit';
      const frmDt = Object.assign({}, this.rntTrxnType.value, {
        k_divident_flag:
          this.rntTrxnType.value.rnt_id == 2
            ? this.rntTrxnType.value.k_divident_flag
            : '',
        c_trans_type_code:
          this.rntTrxnType.value.rnt_id == 1
            ? this.rntTrxnType.value.c_trans_type_code
            : '',
        freq_name:'',
        freq_code:''
      });
    }
    else{
      formdata.append('rnt_id',this.rntTrxnType.value.rnt_id);
      formdata.append('id',this.rntTrxnType.value.id);
      if(this.sub_tab == 'F'){
             api_name = '/rntSystematicFrequencyAddEdit';
             formdata.append('freq_name',this.rntTrxnType.value.freq_name);
             formdata.append('freq_code',this.rntTrxnType.value.freq_code);
      }
      else{
        api_name = '/rntSystematicTransTypeAddEdit';
        formdata.append('trans_type',this.rntTrxnType.value.trans_type);
        formdata.append('trans_sub_type',this.rntTrxnType.value.trans_sub_type);
        formdata.append('trans_type_code',this.rntTrxnType.value.c_k_trans_type);
      }
    }
    this.dbIntr
      .api_call(
        1,
        api_name,
        this.file_type_tab == 'T' ?
        this.utility.convertFormData(this.rntTrxnType.value)
        : formdata

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
            // this.pTableRef.reset();
          }
          this.populateTrxnTypeinForm(null);
          // this.rntTrxnType.
        }
      });
  }


  setValidators = () =>{
    if(this.file_type_tab == 'T'){
          this.rntTrxnType.get('trans_type').setValidators([Validators.required]);
          this.rntTrxnType.get('c_k_trans_type').removeValidators([Validators.required]);
          this.rntTrxnType.get('trans_sub_type').setValidators([Validators.required]);
          this.rntTrxnType.get('freq_name').removeValidators([Validators.required]);
          this.rntTrxnType.get('freq_code').removeValidators([Validators.required]);
    }
    else{

      if(this.sub_tab == 'T'){
        this.rntTrxnType.get('trans_sub_type').setValidators([Validators.required]);
        this.rntTrxnType.get('trans_type').setValidators([Validators.required]);
        this.rntTrxnType.get('c_k_trans_type').setValidators([Validators.required]);
        this.rntTrxnType.get('freq_name').removeValidators([Validators.required]);
        this.rntTrxnType.get('freq_code').removeValidators([Validators.required]);
      }
      else{
        this.rntTrxnType.get('trans_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('c_k_trans_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('freq_name').setValidators([Validators.required]);
        this.rntTrxnType.get('freq_code').setValidators([Validators.required]);
        this.rntTrxnType.get('trans_sub_type').removeValidators([Validators.required]);

      }
    }
    this.rntTrxnType.get('trans_type').updateValueAndValidity();
    this.rntTrxnType.get('c_k_trans_type').updateValueAndValidity();
    this.rntTrxnType.get('trans_sub_type').updateValueAndValidity();
    this.rntTrxnType.get('freq_name').updateValueAndValidity();
    this.rntTrxnType.get('freq_code').updateValueAndValidity();
  }

  /**
   * For Update Row of Transaction Table
   * @param row_obj
   */
  updateRow = (row_obj) => {
     if(this.file_type_tab == 'T'){
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
    }
    else{

      if(this.sub_tab == 'T'){
      this.trxnTypeMst = this.trxnTypeMst.filter(
        (items: ISystematicTransaction, key: number) => {
          if (items.id == row_obj.id) {
            items.trans_type = row_obj.trans_type;
            items.trans_type_code = row_obj.trans_type_code;
            items.trans_sub_type = row_obj.trans_sub_type;
          }
          return true;
        }
      )
      }
      else{
        this.trxnTypeMst = this.trxnTypeMst.filter(
          (items: ISystematiceFrequency, key: number) => {
            if (items.id == row_obj.id) {
              items.freq_name = row_obj.freq_name;
              items.freq_code = row_obj.freq_code;
            }
            return true;
          }
        )
      }
      // this.trxnTypeMst = this.trxnTypeMst.filter(
      //   (items: rntTrxnType, key: number) => {
      //     if (items.id == row_obj.id) {
      //       items.trans_type = row_obj.trans_type;
      //       items.trans_sub_type = row_obj.trans_sub_type;
      //       items.c_trans_type_code =
      //         row_obj.rnt_id == 2 ? '' : row_obj.c_trans_type_code;
      //       items.c_k_trans_type = row_obj.c_k_trans_type;
      //       items.c_k_trans_sub_type = row_obj.c_k_trans_sub_type;
      //       items.k_divident_flag =
      //         row_obj.rnt_id == 2 ? row_obj.k_divident_flag : '';
      //     }
      //     return true;
      //   }
      // );
    }
  };

  reset(): void {
    this.rntTrxnType.reset();
    this.rntTrxnType.get('rnt_id').setValue(this.rnt_type_tab);
  }

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
        const api_name =  sub_tab_type == 'T' ? '/rntSystematicTransType' : '/rntSystematicFrequency';
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

   populateTrxnTypeinForm = (trxnType) => {
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
    this.rntTrxnType.reset();
    this.rntTrxnType.get('rnt_id').setValue(this.rnt_type_tab);
    if(this.rnt_type_tab == 'T')
    {
      this.rntTrxnType.patchValue({
      id: trxnType ? trxnType.id : 0,
      trans_type: trxnType ? trxnType.trans_type : '',
      trans_sub_type: trxnType ? trxnType?.trans_sub_type : '',
      c_trans_type_code: trxnType
        ? trxnType.rnt_id == 1
          ? trxnType?.c_trans_type_code
          : ''
        : '',
      c_k_trans_type: trxnType ? trxnType.c_k_trans_type : '',
      c_k_trans_sub_type: trxnType ? trxnType?.c_k_trans_sub_type : '',
      k_divident_flag: trxnType
        ? trxnType.rnt_id == 2
          ? trxnType?.k_divident_flag
          : ''
        : '',
    });
  }
  else{
    if(this.sub_tab == 'T'){
      this.rntTrxnType.patchValue({
        id: trxnType ? trxnType.id : 0,
        trans_type: trxnType ? trxnType.trans_type : '',
        c_k_trans_type: trxnType ? trxnType.trans_type_code : '',
        trans_sub_type: trxnType ? trxnType.trans_sub_type : '',
      })
    }
    else{
       this.rntTrxnType.patchValue({
        id: trxnType ? trxnType.id : 0,
        freq_name: trxnType ? trxnType.freq_name : '',
        freq_code: trxnType ? trxnType.freq_code : '',
      })
    }
  }
  };


    /**
   * For setting columns for different R&T
   * @param rnt_id
   */
    SetColumns = (rnt_id) => {
      if(this.file_type_tab == 'T'){
      this.columns = trxnTypeClmns.columns.filter((item) =>
        item.isVisible.includes(rnt_id)
      );
    }
    else{
        if(this.sub_tab == 'T'){
          this.columns = systamaticTransClmns.columns.filter((item) =>
          item.isVisible.includes(rnt_id)
        );
        }
        else{
          this.columns = systamaticFreqClmns.columns.filter((item) =>
          item.isVisible.includes(rnt_id)
        );
        }
    }
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
  trxnTypeMst:any;


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
