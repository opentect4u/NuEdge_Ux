import { DOCUMENT} from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table/table';
import { pluck } from 'rxjs/operators';
import { rntTrxnType } from 'src/app/__Model/MailBack/rntTrxnType';
import { rnt } from 'src/app/__Model/Rnt';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { trxnTypeClmns } from 'src/app/__Utility/MailBack/trxnTypeClmns';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /**
   * Get Reference of Prime Ng Table
   */
  @ViewChild('pTableRef') pTableRef: Table;
  @ViewChild('trxnType') trxnType:ElementRef<HTMLInputElement>;

  rntTrxnType = new FormGroup({
    rnt_id: new FormControl(''),
    id: new FormControl('0'),
    trans_type: new FormControl('',[Validators.required]),
    trans_sub_type: new FormControl('',[Validators.required]),
    c_trans_type_code: new FormControl(''),
    c_k_trans_type: new FormControl(''),
    c_k_trans_sub_type: new FormControl(''),
    k_divident_flag: new FormControl(''),
  });

  trxnTypeMst: rntTrxnType[] = [];

  TabMenu: any = [];

  tabindex: number = 0;

  columns: { field: string; header: string; isVisible: number[] }[] = [];

  constructor(
    private dbIntr: DbIntrService,
    private util: UtiliService,
    @Inject(DOCUMENT) private dom: Document
    ) {
    }
  ngOnInit(): void {
    this.getrntMst();
  }
  /**
   * Getting R&T details from backend API and sent this to the tab section
   */
  getrntMst = () => {
    this.dbIntr
      .api_call(0, '/rnt', null)
      .pipe(pluck('data'))
      .subscribe((res: rnt[]) => {
        console.log(res);

        this.TabMenu = res
          .sort((a, b) => a.id - b.id)
          .filter((item) => item.id == 2 || item.id == 1)
          .map(({ id, rnt_name }) => ({ tab_name: rnt_name, img_src: '', id }));
      });
  };

  /**
   * Event fired after tab change and set the selected tab id inside the form
   * @param ev
   */
  onTabChange = (ev) => {
    this.rntTrxnType.get('rnt_id').setValue(ev.tabDtls.id);
    this.SetColumns(ev.tabDtls.id);
    this.geTrxnMst(ev.tabDtls.id);
    this.populateTrxnTypeinForm(null);
    this.pTableRef.reset();
  };

  /**
   * Function for Submitting Transaction Type
   */
  submitTransactionType = () => {
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
        this.util.convertFormData(this.rntTrxnType.value)
      )
      .subscribe((res: any) => {
        this.util.showSnackbar(
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
        }
      });
  };

  /**
   * Getting R&T Trxn Type details from backend API and sent this to the tab section
   * @param rnt_id
   */
  geTrxnMst = (rnt_id) => {
    this.dbIntr
      .api_call(0, '/rntTransTypeSubtype', 'rnt_id=' + rnt_id)
      .pipe(pluck('data'))
      .subscribe((res: rntTrxnType[]) => {
        console.log(res);
        this.trxnTypeMst = res;
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
  reset = () =>{
     this.populateTrxnTypeinForm(null);
  }
}
