import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import filterOpt from '../../../../../../../../assets/json/filterOption.json';
import { pluck } from 'rxjs/operators';
import { column } from 'src/app/__Model/tblClmns';
import { Calendar } from 'primeng/calendar';
import { global } from 'src/app/__Utility/globalFunc';
import moment from 'moment';



@Component({
  selector: 'app-aum-branch',
  templateUrl: './aum-branch.component.html',
  styleUrls: ['./aum-branch.component.css']
})
export class AumBranchComponent implements OnInit {

    @ViewChild('dateRng') daterRnge:Calendar;

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

    var formdata = new FormData();
    for(let key in this.aum_report_filter_frm.value){
      if(Array.isArray(this.aum_report_filter_frm.value[key])){
        formdata.append(key,JSON.stringify(this.aum_report_filter_frm.value[key].map(el => el.id)))
      }
      else if(key == 'date'){
        formdata.append('date',this.daterRnge.inputFieldValue)
      }
      else{
        formdata.append(key,this.aum_report_filter_frm.value[key])
      }
    }
    this.__formDate = moment(this.aum_report_filter_frm.value.date).format('DD/MM/YYYY');
    this.dbIntr.api_call(1,'/clients/aumBranch',formdata).pipe(pluck('data')).subscribe((res:any) =>{
        this.calculateAUMByBranch(res)
    })
  }

  calculateAUMByBranch = (res) =>{
              let originalDt = [];
              const filteredByBranchId = res.filter(el => el.branch_id)
              const groupByBranch = this.groupBy(filteredByBranchId, 'branch_name');
              const totalInv = global.Total__Count(filteredByBranchId, (x:any) => x?.inv_cost ? Number(x.inv_cost) : 0);
              console.log(totalInv);
              Object.keys(groupByBranch).forEach((key,index) =>{
                      /***** CALUCLATION OF UPPER TABLE */
                          const totInvCost = groupByBranch[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                          const totIdcwPaid = groupByBranch[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                          const totIdcwReinv = groupByBranch[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                          const totAUM = groupByBranch[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                          // const totAbsRtn = groupByBranch[key].map(el => Number(el.abs_rtn)).reduce((totSum, a) => totSum + a, 0);
                          const totGainLoss = groupByBranch[key].map(el => Number(el.gain_loss)).reduce((totSum, a) => totSum + a, 0);
                          const totAbsRtn = (totGainLoss / totInvCost)*100;
                          const tot_branch_weightage = (totInvCost / totalInv) * 100;
                      /****** END */
          
                      /**** DISPLAY AMOUNT CATEGORY WISE */
                        originalDt.push({
                          branch_name:groupByBranch[key][0].branch_name,
                          inv_cost:totInvCost,
                          Investment:totInvCost,
                          idcw_paid:totIdcwPaid,
                          IDCWP:totIdcwPaid,
                          idcw_reinv:totIdcwReinv,
                          "IDCW Reinv.":totIdcwReinv,
                          gain_loss:totGainLoss,
                          curr_aum:totAUM,
                          AUM:totAUM,
                          ret_abs:totAbsRtn.toFixed(2),
                          "Abs. Return":totAbsRtn,
                          "Branch Weightage In(%)":tot_branch_weightage.toFixed(2),
                          branch_weightage_in:tot_branch_weightage.toFixed(2),
                          // schemes:groupByBranch[key],
                          total:{
                            inv_cost:totInvCost,
                            idcw_paid:totIdcwPaid,
                            curr_aum:totAUM,
                            abs_rtn:totAbsRtn,
                            branch_name:"TOTAL"
                          }
                        })
                      /**** END */
              })
              this.md_aum_by_branch = originalDt;
              this.createParentFooter(originalDt)
  }


  createParentFooter = (value) =>{
      const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
      const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
      // console.log((tot_gain_loss / tot_inv_cost) * 100);
      const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
      let obj = {}
      const dt = value.map(({total,schemes,cat_name,branch_weightage_in,
        amc_name,amc_code,inv_cost,idcw_paid,idcw_reinv,gain_loss,branch_name,
        curr_aum,ret_abs,subcat_name,contri_to_aum,...rest}) => {return {...rest}})
      for(let object of dt) {Object.assign(obj, object)}
      Object.keys(obj).forEach(el =>{
        // console.log( el + ":" + obj[el])
        this.footerDT = {
          ...this.footerDT,
          [el]:el == "Abs. Return" ? tot_ret_abs.toFixed(2) : el == 'Contri. To AUM' ? '100%' :  global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)),
        }
      })
      console.log(this.footerDT);
    }

  groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };


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