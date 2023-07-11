export class nfoClmns {
  public static SUMMARY_COPY = [
    { field: 'edit', header: 'Edit' },
    { field: 'app_frm_view', header: 'DOC View' },
    { field: 'entry_date', header: 'Entry Date' },
    { field: 'tin_no', header: 'TIN' },
    { field: 'branch_name', header: 'Branch' },
    { field: 'sub_brk_cd', header: 'Sub Broker Code' },
    { field: 'euin_no', header: 'EUIN' },
    { field: 'first_client_name', header: 'First Holder Name' },
    { field: 'first_client_code', header: 'First Holder Code' },
    { field: 'first_client_pan', header: 'First Holder PAN' },
    { field: 'trans_name', header: 'Transction Type' },
    { field: 'scheme_name', header: 'Scheme' },
    { field: 'application_no', header: 'Application No' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'amount', header: 'Amount' },
    { field: 'rnt_name', header: 'Form Submitted At' },
  ];
  public static SUMMARY_COPY_SIP = [
    { field: 'edit', header: 'Edit' },
    { field: 'app_frm_view', header: 'DOC View' },
    { field: 'entry_date', header: 'Entry Date' },
    { field: 'tin_no', header: 'TIN' },
    { field: 'branch_name', header: 'Branch' },
    { field: 'sub_brk_cd', header: 'Sub Broker Code' },
    { field: 'euin_no', header: 'EUIN' },
    { field: 'first_client_name', header: 'First Holder Name' },
    { field: 'first_client_code', header: 'First Holder Code' },
    { field: 'first_client_pan', header: 'First Holder PAN' },
    { field: 'trans_name', header: 'Transction Type' },
    { field: 'scheme_name', header: 'Scheme' },
    { field: 'application_no', header: 'Application No' },
    { field: 'folio_no', header: 'Folio No' },
    { field: 'amount', header: 'Amount' },
    { field: 'sip_amount', header: 'SIP Amount' },
    { field: 'rnt_name', header: 'Form Submitted At' },
  ];
public static COLUMN_SELECTOR=[
  {field:'edit',header:'Edit'},
  {field:'app_frm_view',header:'DOC View'},
   {field:'entry_date',header:'Entry Date'},
   {field:'tin_no',header:'TIN'},
   {field:'bu_type',header:'Business Type'},
   {field:'branch_name',header:'Branch'},
   {field:'arn_no',header:'RM Name'},
    {field:'sub_brk_cd',header:'Sub Broker Code'},
    {field:'euin_no',header:'EUIN'},
    {field:'first_client_name',header:'First Holder Name'},
    {field:'first_client_code',header:'First Holder Code'},
    {field:'first_client_pan',header:'First Holder PAN'},
    {field:'first_client_kyc_status',header:'First Holder KYC Status'},
    {field:'mode_of_holding',header:'Mode Of Holding'},
    {field:'second_client_name',header:'Second Holder Name'},
    {field:'second_client_code',header:'Second Holder Code'},
    {field:'second_client_pan',header:'Second Holder PAN'},
    {field:'second_client_kyc_status',header:'Second Holder KYC Status'},
    {field:'third_client_name',header:'Third Holder Name'},
    {field:'third_client_code',header:'Third Holder Code'},
    {field:'third_client_pan',header:'Third Holder PAN'},
    {field:'third_client_kyc_status',header:'Third Holder KYC Status'},
    {field:'trans_name',header:'Transaction Type'}
]
public static DETAILS_PIP=[
  {field:'scheme_name',header:'Scheme'},
  {field:'inv_type',header:'Investment Type'},
  {field:'application_no',header:'Application No'},
  {field:'folio_no',header:'Folio No'},
  {field:'plan_name',header:'Plan'},
  {field:'opt_name',header:'Option'},
  {field:'amount',header:'Amount'},
  {field:'chq_no',header:'Cheque No'},
  {field:'bank_name',header:'Bank'},
  {field:'rnt_name',header:'Form Submitted At'},
  {field:'remarks',header:'Remarks'}
]
public static DETAILS_SIP=[
  {field:'scheme_name',header:'Scheme'},
  {field:'inv_type',header:'Investment Type'},
  {field:'application_no',header:'Application No'},
  {field:'folio_no',header:'Folio No'},
  {field:'plan_name',header:'Plan'},
  {field:'opt_name',header:'Option'},
  {field:'sip_type_name',header:'SIP Type'},
  {field:'sip_frequency',header:'SIP Frequency'},
  {field:'sip_date',header:'SIP Date'},
  {field:'sip_start_date',header:'SIP Start Date'},
  {field:'sip_end_date',header:'SIP End Date'},
  {field:'sip_amount',header:'SIP Amount'},
  {field:'amount',header:'Amount'},
  {field:'chq_no',header:'Cheque No'},
  {field:'bank_name',header:'Bank'},
  {field:'rnt_name',header:'Form Submitted At'},
  {field:'remarks',header:'Remarks'}
]
public static DETAILS_SWITCH = [
  {field:'scheme_name',header:'Scheme Name (From Scheme)'},
  {field:'plan_name',header:'Plan (From Scheme)'},
  {field:'opt_name',header:'Option (From Scheme)'},
  {field:'scheme_name_to',header:'Scheme Name (To Scheme)'},
  {field:'plan_name_to',header:'Plan (To Scheme)'},
  {field:'opt_name_to',header:'Option (To Scheme)'},
  {field:'folio_no',header:'Folio No'},
  {field:'amount',header:'Amount/Unit'},
  {field:'rnt_name',header:'Form Submitted At'},
  {field:'remarks',header:'Remarks'}
]
public static DETAILS_NFOCOMBO=[
  {field:'scheme_name',header:'Scheme'},
  {field:'inv_type',header:'Investment Type'},
  {field:'application_no',header:'Application No'},
  {field:'folio_no',header:'Folio No'},
  {field:'plan_name',header:'Plan'},
  {field:'opt_name',header:'Option'},
  {field:'amount',header:'Amount'},
  {field:'chq_no',header:'Cheque No'},
  {field:'bank_name',header:'Bank'},
  {field:'scheme_name_to',header:'Scheme Name (To Scheme)'},
  {field:'switch_amt',header:'Switch Amount / Unit'},
  {field:'rnt_name',header:'Form Submitted At'},
  {field:'remarks',header:'Remarks'}
]
}
