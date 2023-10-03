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
      {field:'sl_no',header:'Sl No',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:'6rem'},
      {field:'bu_type',header:'Business Type',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:'10rem'},
      {field:'branch_name',header:'Branch',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:'16rem'},
      {field:'rm_name',header:'RM',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"16rem"},
      {field:'sub_brk_cd',header:'Sub Broker Code',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"16rem"},
      {field:'euin_no',header:'EUIN',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"16rem"},
      {field:'first_client_name',header:'Investor Name',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"18rem"},
      {field:'first_client_pan',header:'PAN',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"16rem"},
      {field:'reg_date',header:'Reg. Date',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"12rem"},
      {field:'amc_name',header:'AMC',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"22rem"},
      {field:'cat_name',header:'Category',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"15rem"},
      {field:'subcat_name',header:'Sub Category',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"21rem"},
      {field:'scheme_name_to',header:'Transferor Scheme',isVisible:['LS-2','TS-2','P2'],width:"28rem"},
      {field:'scheme_name',header:'Transferee Scheme',isVisible:['LS-2','TS-2','P2'],width:"28rem"},
      {field:'scheme_name',header:'Scheme',isVisible:['LS-1','TS-1','LS-3','TS-3','P','P3'],width:"28rem"},
      // {field:'product_code',header:'Scheme',isVisible:['LS-1','TS-1'],width:"28rem"},
      {field:'folio_no',header:'Folio',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"15rem"},
      {field:'trans_type',header:'Transaction Type',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"18rem"},
      {field:'trans_sub_type',header:'Transaction Sub Type',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"18rem"},
      {field:'from_date',header:'Start Date',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"12rem"},
      {field:'to_date',header:'End Date',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"12rem"},
      {field:'pause_start_date',header:'Pause Start Date',isVisible:['P','P2','P3'],width:"12rem"},
      {field:'pause_end_date',header:'Pause End Date',isVisible:['P','P2','P3'],width:"12rem"},
      {field:'sip_date',header:'SIP Date',isVisible:['LS-1','TS-1','P'],width:"12rem"},
      {field:'stp_date',header:'STP Date',isVisible:['LS-2','TS-2','P2'],width:"12rem"},
      {field:'swp_date',header:'SWP Date',isVisible:['LS-3','TS-3','P3'],width:"12rem"},
      {field:'amount',header:'Amount',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"12rem"},
      {field:'freq',header:'Frequency',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"18rem"},
      {field:'duration',header:'Duration (Monthly)',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"16rem"},
      {field:'bank_name',header:'Bank',isVisible:['LS-1','TS-1','P'],width:"22rem"},
      {field:'acc_no',header:'Account No',isVisible:['LS-1','TS-1','P'],width:"15rem"},
      {field:'terminated_date',header:'Terminated Date',isVisible:['TS-1','TS-2','TS-3'],width:"12rem"},
      {field:'remarks',header:'Remarks',isVisible:['LS-1','LS-2','LS-3','TS-1','TS-2','TS-3','P','P2','P3'],width:"15rem"}
     ]
}
