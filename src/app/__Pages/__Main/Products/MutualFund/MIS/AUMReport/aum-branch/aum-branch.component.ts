import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';



@Component({
  selector: 'app-aum-branch',
  templateUrl: './aum-branch.component.html',
  styleUrls: ['./aum-branch.component.css']
})
export class AumBranchComponent implements OnInit {

  aum_branch_Column:column[] = AumBranchColumn.aum_branch_Column;
  /**
   * Holding Branch Master Data
   */
  branchMst: any = [];

  /**
   * Holding Buisness type
   */
  bu_type: any = [];

  /**
   * Holding Relationship Manager
   */
  RmMst: any = [];

  /**
   * Holding Sub Broker Master Data
   */
  subbrkArnMst: any = [];

  /**
     * Holding EUIN Data
    */
  euinMst: any = [];


  /**
  * hold Button Type Advance Filter / Normal Filter
  */
  btn_type: 'R' | 'A' = 'R';

  /**
    * Holding Advance Filter / Normal Filter
  */
  selectBtn = filterOpt;

  md_aum_by_branch:any[] = [];

  footerDT:Partial<IBranchFooter> = {
        Investment:0.00,
        "IDCW Paid":0.00,
        "IDCW Reinv.":0.00,
        "AUM":0.00,
        "Abs. Return":0.00,
        "Branch Weightage In(%)":0.00,
  }

  settingsforBrnchDropdown = this.utility.settingsfroMultiselectDropdown('id', 'brn_name', 'Search Branch', 1, 90);
  settingsforBuTypeDropdown = this.utility.settingsfroMultiselectDropdown('bu_code', 'bu_type', 'Search Business Type', 1, 90);
  settingsforRMDropdown = this.utility.settingsfroMultiselectDropdown('euin_no', 'emp_name', 'Search Relationship Manager', 1);
  settingsforSubBrkDropdown = this.utility.settingsfroMultiselectDropdown('code', 'bro_name', 'Search Sub Broker', 1);
  settingsforEuinDropdown = this.utility.settingsfroMultiselectDropdown('euin_no', 'euin_no', 'Search Employee', 1);
  __formDate:any = new Date();
  aum_report_filter_frm = new FormGroup({
    date: new FormControl(new Date()),
    brn_cd: new FormControl([], { updateOn: 'change' }),
    bu_type_id: new FormControl([], { updateOn: 'change' }),
    rm_id: new FormControl([], { updateOn: 'change' }),
    sub_brk_cd: new FormControl([], { updateOn: 'change' }),
    euin_no: new FormControl([]),
  })

  constructor(private utility: UtiliService, private dbIntr: DbIntrService) { }

  ngOnInit(): void {
    this.getBranchMst();
  }

  ngAfterViewInit() {
    /**
      * Event Trigger after change Branch
      */
    this.aum_report_filter_frm.controls['brn_cd'].valueChanges.subscribe((res) => {
      console.log(res)
      if(this.btn_type == 'A'){
        this.getBusinessTypeMst(res);
      }
      else{
          this.bu_type = [];
          this.RmMst = [];
          this.subbrkArnMst = [];
          this.euinMst = [];
          this.aum_report_filter_frm.get('euin_no').setValue([],{emitEvent:false});
          this.aum_report_filter_frm.get('sub_brk_cd').setValue([],{emitEvent:false});
          this.aum_report_filter_frm.get('rm_id').setValue([],{emitEvent:false});
          this.aum_report_filter_frm.get('bu_type_id').setValue([],{emitEvent:false});
      }
    });

    /**
       * Event Trigger after Business Type
       */
    this.aum_report_filter_frm.controls['bu_type_id'].valueChanges.subscribe((res) => {
      if (res.length > 0) {
        this.disabledSubBroker(res);
        this.getRelationShipManagerMst(res, this.aum_report_filter_frm.value.brn_cd);
      }
      else {
        this.aum_report_filter_frm.controls['sub_brk_cd'].setValue([],{emitEvent:false});
        this.aum_report_filter_frm.controls['euin_no'].setValue([],{emitEvent:false});
        this.aum_report_filter_frm.controls['rm_id'].setValue([],{emitEvent:false});
        this.RmMst = [];
        this.subbrkArnMst = [];
        this.euinMst = [];
      }

    });

    /**
     * Event Trigger after Rlationship Manager
     */
    this.aum_report_filter_frm.controls['rm_id'].valueChanges.subscribe((res) => {
      if (
        this.aum_report_filter_frm.value.bu_type_id.findIndex(
          (item) => item.bu_code == 'B'
        ) != -1
      ) {
        this.getSubBrokerMst(res);
      } else {
        this.euinMst = [];
        this.euinMst = res;
      }
    });
  }

  getBusinessTypeMst(brn_cd) {
    if (brn_cd.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/businessType',
          'arr_branch_id=' +
            JSON.stringify(
              brn_cd.map((item) => {
                return item['id'];
              })
            )
        )
        .pipe(pluck('data'))
        .subscribe((res) => {
          this.bu_type = res;
          const bu_code = this.bu_type.map(el => el.bu_code);
          const dt = this.aum_report_filter_frm.get('bu_type_id').value.filter(el => bu_code.includes( el.bu_code));
          this.aum_report_filter_frm.get('bu_type_id').setValue(dt,{emitEvent:false});
        });
    } else {
      this.aum_report_filter_frm.controls['bu_type_id'].setValue([], { emitEvent: true });
      this.bu_type = [];
    }
  }

  getSubBrokerMst(arr_euin_no) {
    if (arr_euin_no.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/subbroker',
          'arr_euin_no=' +
            JSON.stringify(
              arr_euin_no.map((item) => {
                return item['euin_no'];
              })
            )
        )
        .pipe(pluck('data'))
        .subscribe((res: any) => {
          this.subbrkArnMst = res.map(
            ({ code, bro_name, emp_euin_no, euin_no }) => ({
              code,
              emp_euin_no,
              euin_no,
              bro_name: bro_name + '-' + code,
            })
          );
          const code = this.subbrkArnMst.map(el => el.code);
          const dt = this.aum_report_filter_frm.get('sub_brk_cd').value.filter(el => code.includes( el.code));
          this.aum_report_filter_frm.get('sub_brk_cd').setValue(dt,{emitEvent:false});
        });
    } else {
      this.subbrkArnMst = [];
      this.aum_report_filter_frm.controls['sub_brk_cd'].setValue([]);
    }
  }

  getRelationShipManagerMst(bu_type_id, arr_branch_id) {
    if (bu_type_id.length > 0 && arr_branch_id.length > 0) {
      this.dbIntr
        .api_call(
          0,
          '/employee',
          'arr_bu_type_id=' +
            JSON.stringify(
              bu_type_id.map((item) => {
                return item['bu_code'];
              })
            ) +
            '&arr_branch_id=' +
            JSON.stringify(
              arr_branch_id.map((item) => {
                return item['id'];
              })
            )
        )
        .pipe(pluck('data'))
        .subscribe((res) => {
          this.RmMst = res;
          const euin_no = this.RmMst.map(el => el.euin_no);
          const dt = this.aum_report_filter_frm.get('rm_id').value.filter(el => euin_no.includes( el.euin_no));
          this.aum_report_filter_frm.get('rm_id').setValue(dt,{emitEvent:false});
        });
    } else {
      this.RmMst = [];
      this.aum_report_filter_frm.controls['rm_id'].setValue([],{emitEvent:true});
    }
  }

  disabledSubBroker(bu_type_ids) {
    if (bu_type_ids.findIndex((item) => item.bu_code == 'B') != -1) {
      this.aum_report_filter_frm.controls['sub_brk_cd'].enable();
    } else {
      this.aum_report_filter_frm.controls['sub_brk_cd'].disable();
      this.aum_report_filter_frm.controls['sub_brk_cd'].setValue([],{emitEvent:false});
      this.subbrkArnMst = [];
    }
  }

  clickToSend() {
    console.log(this.aum_report_filter_frm.value);
    // var formdata = new FormData();
    // for(let key in this.aum_report_filter_frm.value){
    //   if(Array.isArray(this.aum_report_filter_frm.value[key])){
    //     formdata.append(key,JSON.stringify(this.aum_report_filter_frm.value[key]))
    //   }
    //   else{
    //     formdata.append(key,this.aum_report_filter_frm.value[key])
    //   }
    // }
    this.__formDate = this.aum_report_filter_frm.value.date
  }

  onItemClick = (ev) => {
    if (ev.option.value == 'A') {
      console.log(this.aum_report_filter_frm.value.brn_cd)
      if(this.aum_report_filter_frm.value.brn_cd.length > 0){
        console.log(this.aum_report_filter_frm.value.brn_cd.length)
        this.getBusinessTypeMst(this.aum_report_filter_frm.value.brn_cd);
      }
    } else {
      this.bu_type = [];
      this.aum_report_filter_frm.controls['bu_type_id'].setValue([]);
    }
  };

  getBranchMst = () => {
    if (this.branchMst == 0) {
      this.dbIntr
        .api_call(0, '/branch', null)
        .pipe(pluck('data'))
        .subscribe((res) => {
          this.branchMst = res;
        });
    }

  }

}

export interface IAUMByBranch{
    branch_name:string;
    inv_cost:number;
    idcwp:number;
    idcwr:number;
    brn_weightage_in:number;
    cur_aum:number;
    abs_rtn:number;
}

export interface IBranchFooter{
  Investment:number,
  "IDCW Paid":number,
  "IDCW Reinv.":number,
  "AUM":number,
  "Abs. Return":number,
  "Branch Weightage In(%)":number,
}
export class AumBranchColumn{
  public static aum_branch_Column:column[] = [
  {
    field:'branch_name',
    header:'Branch',
    width:'24rem'
  },
  {
    field:'inv_cost',
    header:'Investment',
    width:'10rem'
  },
  {
    field:'idcwp',
    header:'IDCW Paid',
    width:'8rem'
  },
  {
    field:'idcw_reinv',
    header:'IDCW Reinv.',
    width:'8rem'
  },
  {
    field:'curr_aum',
    header:'AUM',
    width:'10rem'
  },
  {
    field:'ret_abs',
    header:'Abs. Return',
    width:'6rem'
  },
  {
    field:'branch_weightage_in',
    header:'Branch Weightage In(%)',
    width:'8rem'
  }
]
}