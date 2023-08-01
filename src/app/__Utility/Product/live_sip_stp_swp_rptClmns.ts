import { column } from "src/app/__Model/tblClmns";

 /**
  *  LIVE SIP => LS-1
  *  LIVE STP => LS-2
  *  LIVE SWP => LS-3
  *  Terminate SIP => TS-1
  *  Terminate STP => TS-2
  *  Terminate SWP => TS-3
  */

export class live_sip_stp_swp_rpt{
     public static columns = [
      {field:'sl_no',header:'Sl No',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'bu_type',header:'Business Type',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'branch_name',header:'Branch',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'rm_name',header:'RM',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'sub_brk_cd',header:'Sub Broker Code',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'euin_no',header:'EUIN',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'client_name',header:'Investor Name',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'pan_no',header:'PAN',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'reg_date',header:'Reg. Date',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'amc_name',header:'AMC',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'cat_name',header:'Category',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'subcat_name',header:'Sub Category',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'scheme_name_to',header:'To Scheme',isVisible:['LS-2','TS-2']},
      {field:'scheme_name',header:'From Scheme',isVisible:['LS-2','TS-2']},
      {field:'scheme_name',header:'Scheme',isVisible:['LS-3','TS-3']},
      {field:'product_code',header:'Scheme',isVisible:['LS-1','TS-1']},
      {field:'folio_no',header:'Folio',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'trans_type',header:'Transaction Type',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'trans_sub_type',header:'Transaction Sub Type',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'start_date',header:'Start Date',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'end_date',header:'End Date',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'sip_date',header:'SIP Date',isVisible:['LS-1','TS-1']},
      {field:'stp_date',header:'STP Date',isVisible:['LS-2','TS-2']},
      {field:'swp_date',header:'SWP Date',isVisible:['LS-3','TS-3']},
      {field:'amount',header:'Amount',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'freq',header:'Frequency',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'no_of_installment',header:'No. Of Installment',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3']},
      {field:'bank_name',header:'Bank',isVisible:['LS-1','TS-1']},
      {field:'acc_no',header:'Account No',isVisible:['LS-1','TS-1']},
      {field:'terminated_date',header:'Terminated Date',isVisible:['TS-1','TS-2','TS-3']},
     ]
}
