import { column } from "src/app/__Model/tblClmns";

export class schemeClmns{
  public static COLUMNFORNFODETAILS = [
    'edit',
    'delete',
    'sl_no',
    'scheme_name',
    'scheme_type',
    'amc_short_name',
    'cat_name',
    'subcate_name',
    'nfo_start_dt',
    'nfo_end_dt',
    'nfo_reopen_dt',
    'sip_dates',
    'pip_fresh_min_amt',
    'pip_add_min_amt',
    'special_sip',
    'swp_dates',
    'stp_dates',
    'daily_sip_fresh_min_amt',
    'daily_sip_add_min_amt',
    'weekly_sip_fresh_min_amt',
    'weekly_sip_add_min_amt',
    'fortnightly_sip_fresh_min_amt',
    'fortnightly_sip_add_min_amt',
    'monthly_sip_fresh_min_amt',
    'monthly_sip_add_min_amt',
    'quarterly_sip_fresh_min_amt',
    'quarterly_sip_add_min_amt',
    'semi_anually_sip_fresh_min_amt',
    'semi_anually_sip_add_min_amt',
    'anually_sip_fresh_min_amt',
    'anually_sip_add_min_amt',
    'daily_swp_amt',
    'weekly_swp_amt',
    'fortnightly_swp_amt',
    'monthly_swp_amt',
    'quarterly_swp_amt',
    'semi_anually_swp_amt',
    'anually_swp_amt',
    'daily_stp_amt',
    'weekly_stp_amt',
    'fortnightly_stp_amt',
    'monthly_stp_amt',
    'quarterly_stp_amt',
    'semi_anually_stp_amt',
    'anually_stp_amt'
  ];

  public static COLUMNFORONGOINGDETAILS = [
    'edit',
    'delete',
    'sl_no',
    'scheme_name',
    'scheme_type',
    'amc_short_name',
    'cat_name',
    'subcate_name',
    'sip_dates',
    'pip_fresh_min_amt',
    'pip_add_min_amt',
    'special_sip',
    'swp_dates',
    'stp_dates',
    'daily_sip_fresh_min_amt',
    'daily_sip_add_min_amt',
    'weekly_sip_fresh_min_amt',
    'weekly_sip_add_min_amt',
    'fortnightly_sip_fresh_min_amt',
    'fortnightly_sip_add_min_amt',
    'monthly_sip_fresh_min_amt',
    'monthly_sip_add_min_amt',
    'quarterly_sip_fresh_min_amt',
    'quarterly_sip_add_min_amt',
    'semi_anually_sip_fresh_min_amt',
    'semi_anually_sip_add_min_amt',
    'anually_sip_fresh_min_amt',
    'anually_sip_add_min_amt',
    'daily_swp_amt',
    'weekly_swp_amt',
    'fortnightly_swp_amt',
    'monthly_swp_amt',
    'quarterly_swp_amt',
    'semi_anually_swp_amt',
    'anually_swp_amt',
    'daily_stp_amt',
    'weekly_stp_amt',
    'fortnightly_stp_amt',
    'monthly_stp_amt',
    'quarterly_stp_amt',
    'semi_anually_stp_amt',
    'anually_stp_amt'

  ];
  public static COLUMN_SUMMARY = ['edit','delete','sl_no','scheme_name','scheme_type'];
  public static COLUMN_SELECTOR = [
    {id: "edit",text:"Edit"},
    {id: "delete",text:"Delete"},
    {id: "sl_no",text:"Sl No"},
    {id: "scheme_name",text:"Scheme"},
    {id: "scheme_type",text:"Scheme Type"},
    {id: "amc_short_name",text:"AMC"},
    {id: "cat_name",text:"Category"},
    {id: "subcate_name",text:"Sub Category"},
    {id: "nfo_start_dt",text:"NFO Start Date"},
    {id: "nfo_end_dt",text:"NFO End Date"},
    {id: "nfo_reopen_dt",text:"NFO Reopen Date"},
     {id:'sip_dates',text:'SIP Dates'},
    {id: "pip_fresh_min_amt",text:"Fresh Amount (PIP)"},
    {id: "pip_add_min_amt",text:"Additional Amount (PIP)"},
    {id:"special_sip",text:'Special SIP'},
    {id:"swp_dates",text:'SWP Dates'},
    {id:'stp_dates',text:'STP Dates'},
    {id:'daily_sip_fresh_min_amt',text:'Daily SIP Fresh Minimum Amount'},
    {id:'daily_sip_add_min_amt',text:'Daily SIP Additional Minimum Amount'},
    {id:'weekly_sip_fresh_min_amt',text:'Weekly SIP Fresh Minimum Amount'},
    {id:'weekly_sip_add_min_amt',text:'Weekly SIP Additional Minimum Amount'},
    {id:'fortnightly_sip_fresh_min_amt',text:'Fortnightly SIP Fresh Minimum Amount'},
    {id:'fortnightly_sip_add_min_amt',text:'Fortnightly SIP Additional Minimum Amount'},
    {id:'monthly_sip_fresh_min_amt',text:'Monthly SIP Fresh Minimum Amount'},
    {id:'monthly_sip_add_min_amt',text:'Monthly SIP Additional Minimum Amount'},
    {id:'quarterly_sip_fresh_min_amt',text:'Quarterly SIP Fresh Minimum Amount'},
    {id:'quarterly_sip_add_min_amt',text:'Quarterly SIP Additional Minimum Amount'},
    {id:'semi_anually_sip_fresh_min_amt',text:'Semi Anually SIP Fresh Minimum Amount'},
    {id:'semi_anually_sip_add_min_amt',text:'Semi Anually SIP Additional Minimum Amount'},
    {id:'anually_sip_fresh_min_amt',text:'Anually SIP Fresh Minimum Amount'},
    {id:'anually_sip_add_min_amt',text:'Anually SIP Additional Minimum Amount'},
    {id:'daily_swp_amt',text:'Daily SWP Amount'},
    {id:'weekly_swp_amt',text:'Weekly SWP Amount'},
    {id:'fortnightly_swp_amt',text:'Fortnightly SWP Amount'},
    {id:'monthly_swp_amt',text:'Monthly SWP Amount'},
    {id:'quarterly_swp_amt',text:'Quarterly SWP Amount'},
    {id:'semi_anually_swp_amt',text:'Semi Anually SWP Amount'},
    {id:'anually_swp_amt',text:'Anually SWP Amount'},
    {id:'daily_stp_amt',text:'Daily STP Amount'},
    {id:'weekly_stp_amt',text:'Weekly STP Amount'},
    {id:'fortnightly_stp_amt',text:'Fortnightly STP Amount'},
    {id:'monthly_stp_amt',text:'Monthly STP Amount'},
    {id:'quarterly_stp_amt',text:'Quarterly STP Amount'},
    {id:'semi_anually_stp_amt',text:'Semi Anually STP Amount'},
    {id:'anually_stp_amt',text:'Anually STP Amount'},
  ];
  public static column_selector:column[]=[
    {field: "edit",header:"Edit"},
    {field: "delete",header:"Delete"},
    {field: "scheme_name",header:"Scheme"},
    {field: "scheme_type",header:"Scheme Type"},
    {field: "amc_short_name",header:"AMC"},
    {field: "cat_name",header:"Category"},
    {field: "subcate_name",header:"Sub Category"},
    {field: "nfo_start_dt",header:"NFO Start Date"},
    {field: "nfo_end_dt",header:"NFO End Date"},
    {field: "nfo_reopen_dt",header:"NFO Reopen Date"},
     {field:'sip_date',header:'SIP Dates'},
    {field: "pip_fresh_min_amt",header:"Fresh Amount (PIP)"},
    {field: "pip_add_min_amt",header:"Additional Amount (PIP)"},
    {field:"special_sip_name",header:'Special SIP'},
    {field:"swp_date",header:'SWP Dates'},
    {field:'stp_date',header:'STP Dates'},
    {field:'daily_sip_fresh_min_amt',header:'Daily SIP Fresh Minimum Amount'},
    {field:'daily_sip_add_min_amt',header:'Daily SIP Additional Minimum Amount'},
    {field:'weekly_sip_fresh_min_amt',header:'Weekly SIP Fresh Minimum Amount'},
    {field:'weekly_sip_add_min_amt',header:'Weekly SIP Additional Minimum Amount'},
    {field:'fortnightly_sip_fresh_min_amt',header:'Fortnightly SIP Fresh Minimum Amount'},
    {field:'fortnightly_sip_add_min_amt',header:'Fortnightly SIP Additional Minimum Amount'},
    {field:'monthly_sip_fresh_min_amt',header:'Monthly SIP Fresh Minimum Amount'},
    {field:'monthly_sip_add_min_amt',header:'Monthly SIP Additional Minimum Amount'},
    {field:'quarterly_sip_fresh_min_amt',header:'Quarterly SIP Fresh Minimum Amount'},
    {field:'quarterly_sip_add_min_amt',header:'Quarterly SIP Additional Minimum Amount'},
    {field:'semi_anually_sip_fresh_min_amt',header:'Semi Anually SIP Fresh Minimum Amount'},
    {field:'semi_anually_sip_add_min_amt',header:'Semi Anually SIP Additional Minimum Amount'},
    {field:'anually_sip_fresh_min_amt',header:'Anually SIP Fresh Minimum Amount'},
    {field:'anually_sip_add_min_amt',header:'Anually SIP Additional Minimum Amount'},
    {field:'daily_swp_amt',header:'Daily SWP Amount'},
    {field:'weekly_swp_amt',header:'Weekly SWP Amount'},
    {field:'fortnightly_swp_amt',header:'Fortnightly SWP Amount'},
    {field:'monthly_swp_amt',header:'Monthly SWP Amount'},
    {field:'quarterly_swp_amt',header:'Quarterly SWP Amount'},
    {field:'semi_anually_swp_amt',header:'Semi Anually SWP Amount'},
    {field:'anually_swp_amt',header:'Anually SWP Amount'},
    {field:'daily_stp_amt',header:'Daily STP Amount'},
    {field:'weekly_stp_amt',header:'Weekly STP Amount'},
    {field:'fortnightly_stp_amt',header:'Fortnightly STP Amount'},
    {field:'monthly_stp_amt',header:'Monthly STP Amount'},
    {field:'quarterly_stp_amt',header:'Quarterly STP Amount'},
    {field:'semi_anually_stp_amt',header:'Semi Anually STP Amount'},
    {field:'anually_stp_amt',header:'Anually STP Amount'},
    {field:'benchmark',header:'Benchmark'}
  ]
  public static Summary:column[] = [
    {field: "edit",header:"Edit"},
    {field: "delete",header:"Delete"},
    {field: "scheme_name",header:"Scheme"},
    {field: "scheme_type",header:"Scheme Type"}
  ]
}

export class ISINClmns{
 public static Columns:column[] = [
  {field:'edit',header:'Edit'},
  {field:'delete',header:'Delete'},
  {field:'amc_short_name',header:'AMC'},
  {field:'cat_name',header:'Category'},
  {field:'subcategory_name',header:'Subcategory'},
  {field:'scheme_name',header:'Scheme'},
  {field:'plan_name',header:'Plan'},
  {field:'opt_name',header:'Option'},
  {field:'isin_no',header:'ISIN'},
  {field:'product_code',header:'Product Code'}

 ]
}
