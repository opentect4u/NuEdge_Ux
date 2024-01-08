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
import { IFolioTaxStatus, ISystematicTransaction, ISystematiceFrequency, ISystematiceUnregisteredRemarks, rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { FolioTaxStatus, systamaticFreqClmns, systamaticTransClmns, systamaticUnregisteredRemarksClmns, trxnTypeClmns } from 'src/app/__Utility/MailBack/trxnTypeClmns';
import { DOCUMENT } from '@angular/common';
import { Table } from 'primeng/table';
import {SystamaticfileHelp} from '../../../../../Enum/displayMode'
import { global } from 'src/app/__Utility/globalFunc';

export class MisFlag{
  public flag:string
  public type:string
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, IFileHelpHome {

  title:string = 'Transaction Report';
  fileType_tab:Partial<ISubmenu>[] = [];
  file_type_tab:string = 'T';  // for maintan parent tab
  rnt_type_tab:string; // for maintan third tab
  sub_tab:string; // for maintan second tab
  file_help: IFileHelpTab[] = fileHelp;
  rnt_mst_dt: Partial<ISubmenu>[] = [];
  trxnTypeMst:any = [];
  columns: Partial<{ field: string; header: string; isVisible: number[],width:string }>[] = [];

  @ViewChild('trxnType') trxnType:ElementRef<HTMLInputElement>;
  @ViewChild('_remarks') _remarks:ElementRef<HTMLInputElement>;

   mis_type:MisFlag[] = [{flag:"I",type:"Monthly Inflow"},{flag:"O",type:"Monthly Outflow"}]

  @ViewChild('pTableRef') pTableRef: Table;


  rntTrxnType = new FormGroup({
    rnt_id: new FormControl(''),
    id: new FormControl('0'),
    process_type: new FormControl(''),
    trans_type: new FormControl('', [Validators.required]),
    trans_sub_type: new FormControl('', [Validators.required]),
    c_trans_type_code: new FormControl(''),
    c_k_trans_type: new FormControl(''),
    c_k_trans_sub_type: new FormControl(''),
    k_divident_flag: new FormControl(''),
    freq_name:new FormControl(''),
    freq_code: new FormControl(''),
    remarks: new FormControl(''),
    tax_status:new FormGroup({
         code:new FormControl(''),
         status:new FormControl('')
    })
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
      this.title = ev?.tabDtls?.tab_name;
      this.file_type_tab = this.file_help.filter(item => item.id == ev.tabDtls.id)[0].flag;
      this.fileType_tab = this.file_help.filter(item => item.id == ev.tabDtls.id)[0].sub_menu;
      if(this.file_type_tab == 'S' || this.file_type_tab == 'F'){
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
      if(this.file_type_tab == 'S' || this.file_type_tab == 'F'){
        // this.sub_tab = this.fileType_tab[0].flag;
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
    this.rntTrxnType.get('process_type').setValue('');
    this.SetColumns(this.rnt_type_tab);
  }

  submitTransactionType(): void {
  console.log(this.sub_tab);
    let api_name:string;
    let formdata = new FormData();
    if(this.file_type_tab == 'T'){
      api_name = '/rntTransTypeSubtypeAddEdit';
      const frmDt = Object.assign({}, this.rntTrxnType.value, {
        id:this.rntTrxnType.value.id ? this.rntTrxnType.value.id : 0,
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
    else if(this.file_type_tab == 'S'){
      formdata.append('rnt_id',this.rntTrxnType.value.rnt_id);
      formdata.append('id',this.rntTrxnType.value.id ? this.rntTrxnType.value.id : 0);
      if(this.sub_tab == 'F'){
             api_name = '/rntSystematicFrequencyAddEdit';
             formdata.append('freq_name',this.rntTrxnType.value.freq_name);
             formdata.append('freq_code',this.rntTrxnType.value.freq_code);
      }
      else if(this.sub_tab == 'T'){
        api_name = '/rntSystematicTransTypeAddEdit';
        formdata.append('trans_type',this.rntTrxnType.value.trans_type);
        formdata.append('trans_sub_type',this.rntTrxnType.value.trans_sub_type);
        formdata.append('trans_type_code',this.rntTrxnType.value.c_k_trans_type);
      }
      else{
        api_name = '/rntSystematicUnregisterAddEdit';
        formdata.append('remarks',this.rntTrxnType.value.remarks);
      }
    }
    else{
      api_name = '/rntFolioDetailsAddEdit';
       formdata.append('rnt_id',this.rntTrxnType.value.rnt_id);
       formdata.append('id',this.rntTrxnType.value.id ? this.rntTrxnType.value.id : 0);
       formdata.append('status_code',this.rntTrxnType.value.tax_status.code ? this.rntTrxnType.value.tax_status.code : '');
       formdata.append('status',this.rntTrxnType.value.tax_status.status ? this.rntTrxnType.value.tax_status.status : '');
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
          res.suc == 1 ?
          (this.sub_tab == 'U' ? 'Remarks' : 'Transaction Type') + (this.rntTrxnType.value.id > 0 ? ' Updated ' : ' Saved ') +  'Successfully'
          : res.msg,
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


  /**** LOGIC FOR SETTING VALIDATORS  */
  setValidators = () =>{
    /*** For Transaction Report */
    if(this.file_type_tab == 'T'){
          this.rntTrxnType.get('trans_type').setValidators([Validators.required]);
          this.rntTrxnType.get('c_k_trans_type').removeValidators([Validators.required]);
          this.rntTrxnType.get('trans_sub_type').setValidators([Validators.required]);
          this.rntTrxnType.get('freq_name').removeValidators([Validators.required]);
          this.rntTrxnType.get('freq_code').removeValidators([Validators.required]);
          this.rntTrxnType.get('remarks').removeValidators([Validators.required]);
          this.rntTrxnType.get(['tax_status','status']).removeValidators([Validators.required]);
          this.rntTrxnType.get(['tax_status','code']).removeValidators([Validators.required]);
    }
    /*** End */
    /******** Systamatic transaction Report */
    else if(this.file_type_tab == 'S'){
      /***** For Transaction Report */
      if(this.sub_tab == 'T'){
        this.rntTrxnType.get('trans_sub_type').setValidators([Validators.required]);
        this.rntTrxnType.get('trans_type').setValidators([Validators.required]);
        this.rntTrxnType.get('c_k_trans_type').setValidators([Validators.required]);
        this.rntTrxnType.get('freq_name').removeValidators([Validators.required]);
        this.rntTrxnType.get('freq_code').removeValidators([Validators.required]);
        this.rntTrxnType.get('remarks').removeValidators([Validators.required]);
        this.rntTrxnType.get(['tax_status','status']).removeValidators([Validators.required]);
        this.rntTrxnType.get(['tax_status','code']).removeValidators([Validators.required]);
      }
      /**** End */
      /**** Frequency Report */
      else if(this.sub_tab == 'F'){
        this.rntTrxnType.get('trans_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('c_k_trans_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('freq_name').setValidators([Validators.required]);
        this.rntTrxnType.get('freq_code').setValidators([Validators.required]);
        this.rntTrxnType.get('trans_sub_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('remarks').removeValidators([Validators.required]);
        this.rntTrxnType.get(['tax_status','status']).removeValidators([Validators.required]);
          this.rntTrxnType.get(['tax_status','code']).removeValidators([Validators.required]);
      }
      /***** End */
      /***** Unregister Report */
      else{
        this.rntTrxnType.get('trans_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('c_k_trans_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('freq_name').removeValidators([Validators.required]);
        this.rntTrxnType.get('freq_code').removeValidators([Validators.required]);
        this.rntTrxnType.get('trans_sub_type').removeValidators([Validators.required]);
        this.rntTrxnType.get('remarks').setValidators([Validators.required]);
        this.rntTrxnType.get(['tax_status','status']).removeValidators([Validators.required]);
        this.rntTrxnType.get(['tax_status','code']).removeValidators([Validators.required]);
      }
      /***** End */
    }
    /*****End */
    /***** Folio Report */
    else{
      this.rntTrxnType.get('trans_type').removeValidators([Validators.required]);
      this.rntTrxnType.get('c_k_trans_type').removeValidators([Validators.required]);
      this.rntTrxnType.get('freq_name').removeValidators([Validators.required]);
      this.rntTrxnType.get('freq_code').removeValidators([Validators.required]);
      this.rntTrxnType.get('trans_sub_type').removeValidators([Validators.required]);
      this.rntTrxnType.get('remarks').removeValidators([Validators.required]);
      this.rntTrxnType.get(['tax_status','status']).setValidators([Validators.required]);
      this.rntTrxnType.get(['tax_status','code']).setValidators([Validators.required]);
    }
    /***** End */
    this.rntTrxnType.get('trans_type').updateValueAndValidity();
    this.rntTrxnType.get('c_k_trans_type').updateValueAndValidity();
    this.rntTrxnType.get('trans_sub_type').updateValueAndValidity();
    this.rntTrxnType.get('freq_name').updateValueAndValidity();
    this.rntTrxnType.get('freq_code').updateValueAndValidity();
    this.rntTrxnType.get('remarks').updateValueAndValidity();
    this.rntTrxnType.get(['tax_status','status']).updateValueAndValidity();
    this.rntTrxnType.get(['tax_status','code']).updateValueAndValidity();
  }
  /**** END */

  /**
   * For Update Row of Transaction Table
   * @param row_obj
   */
  updateRow = (row_obj) => {
     if(this.file_type_tab == 'T'){
    this.trxnTypeMst = this.trxnTypeMst.filter(
      (items: rntTrxnType, key: number) => {
        if (items.id == row_obj.id) {
          items.process_type  = row_obj.process_type;
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
      else if(this.sub_tab == 'F'){
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
      else if(this.sub_tab == 'U'){
        this.trxnTypeMst = this.trxnTypeMst.filter(
          (items: ISystematiceUnregisteredRemarks, key: number) => {
            if (items.id == row_obj.id) {
              items.remarks = row_obj.remarks;
            }
            return true;
          }
        )
      }
      else{
        this.trxnTypeMst = this.trxnTypeMst.filter(
          (items: IFolioTaxStatus, key: number) => {
            if (items.id == row_obj.id) {
              items.status_code = row_obj.status_code;
              items.status = row_obj.status;
            }
            return true;
          }
        )
      }

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
        console.log(SystamaticfileHelp[sub_tab_type]);
        // const api_name =  sub_tab_type == 'T' ? '/rntSystematicTransType' : '/rntSystematicFrequency';
        this.dbIntr.api_call(0,`/${SystamaticfileHelp[sub_tab_type]}`,'rnt_id=' + rnt_id)
          .pipe(pluck('data'))
          .subscribe((res) =>{
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


   /***
    *  auto filled up form after click on particular edit button
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
    if(this.file_type_tab == 'T')
    {
      this.rntTrxnType.patchValue({
      id: trxnType ? trxnType.id : 0,
      trans_type: trxnType ? (trxnType.trans_type ? trxnType.trans_type : '') : '',
      trans_sub_type: trxnType ? (trxnType?.trans_sub_type ? trxnType?.trans_sub_type : '') : '',
      c_trans_type_code: trxnType
        ? trxnType.rnt_id == 1
          ? (trxnType?.c_trans_type_code ? trxnType?.c_trans_type_code : '')
          : ''
        : '',
      c_k_trans_type: trxnType ? (trxnType.c_k_trans_type ? trxnType.c_k_trans_type : '') : '',
      c_k_trans_sub_type: trxnType ? (trxnType?.c_k_trans_sub_type ? trxnType?.c_k_trans_sub_type : '') : '',
      k_divident_flag: trxnType
        ? trxnType.rnt_id == 2
          ? (trxnType?.k_divident_flag ? trxnType?.k_divident_flag : '')
          : ''
        : '',
      process_type:  trxnType ? global.getActualVal(trxnType?.process_type) : ''
    });
  }
  else if(this.file_type_tab == 'S'){
    if(this.sub_tab == 'T'){
      this.rntTrxnType.patchValue({
        id: trxnType ? trxnType.id : 0,
        trans_type: trxnType ? (trxnType.trans_type ? trxnType.trans_type : '') : '',
        c_k_trans_type: trxnType ? (trxnType.trans_type_code ? trxnType.trans_type_code : '') : '',
        trans_sub_type: trxnType ? (trxnType.trans_sub_type ? trxnType.trans_sub_type : '') : '',
      })
    }
    else if(this.sub_tab == 'F'){
       this.rntTrxnType.patchValue({
        id: trxnType ? trxnType.id : 0,
        freq_name: trxnType ? (trxnType.freq_name ? trxnType.freq_name : '') : '',
        freq_code: trxnType ? (trxnType.freq_code ? trxnType.freq_code : '') : '',
      })
    }
    else{
      this.rntTrxnType.patchValue({
        id: trxnType ? trxnType.id : 0,
        remarks: trxnType ? (trxnType.remarks ? trxnType.remarks : '') : '',
      })
    }
  }
  else{
    console.log(trxnType);
    this.rntTrxnType.patchValue({
      id: trxnType ? trxnType.id : 0,
      tax_status:{
          code: trxnType ? (trxnType.status_code ? trxnType.status_code : '') : '',
          status: trxnType ? (trxnType.status ? trxnType.status : '') : '',
      }
    })
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
      else if(this.file_type_tab == 'S'){
          if(this.sub_tab == 'T'){
            this.columns = systamaticTransClmns.columns.filter((item) =>
            item.isVisible.includes(rnt_id)
          );
          }
          else if(this.sub_tab == 'F'){
            this.columns = systamaticFreqClmns.columns.filter((item) =>
            item.isVisible.includes(rnt_id)
          );
          }
          else{
            this.columns = systamaticUnregisteredRemarksClmns.columns.filter((item) =>
            item.isVisible.includes(rnt_id)
          );
          }
      }
      else{
        this.columns = FolioTaxStatus.columns.filter((item) =>
        item.isVisible.includes(rnt_id)
      );
      }
    };


    getColumns = () =>{
      return this.utility.getColumns(this.columns);
    }

}

export interface IFileHelpHome {


  file_type_tab:string;
  rnt_type_tab:string;



  columns: Partial<{ field: string; header: string; isVisible: number[] ,width:string}>[];

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
