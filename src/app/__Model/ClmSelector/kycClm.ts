import { column } from "../tblClmns";

export class kycClm {
  public static summary = [
    'edit',
    'sl_no',
    'app_form_view',
    'ack_form_view',
    'mu_frm_view',
    'branch',
    'tin_no',
    'bu_type',
    'sub_brk_cd',
    'client_name',
    'client_code',
    'pan',
    'kyc_type'
  ];

  public static Summary_copy:column[] = [
    {field:'edit',header:'Edit'},
    {field:'app_form_view',header:'DOC View'},
    {field:'ack_form_view',header:'ACK View'},
    // {field:'mu_frm_view',header:'Manual Update View'},
    {field:'tin_no',header:'TIN'},
    {field:'bu_type',header:'Business Type'},
    {field:'branch',header:'Branch'},
    {field:'sub_brk_cd',header:'Sub Broker Code'},
    {field:'client_name',header:'Client Name'},
    {field:'client_code',header:'Client Code'},
    {field:'pan',header:'PAN'},
    {field:'kyc_type',header:'KYC Type'}
  ]

  public static Details:column[] = [
    {field:'edit',header:'Edit'},
    {field:'app_form_view',header:'DOC View'},
    {field:'entry_dt',header:'Entry Date'},
    {field:'ack_form_view',header:'ACK View'},
    // {field:'mu_frm_view',header:'Manual Update View'},
    {field:'tin_no',header:'TIN'},
    {field:'bu_type',header:'Business Type'},
    {field:'branch',header:'Branch'},
    {field:'arn_no',header:'RM Name'},
    {field:'sub_brk_arn',header:'Sub Broker ARN'},
    {field:'sub_brk_cd',header:'Sub Broker Code'},
    {field:'euin_no',header:'EUIN'},
    {field:'client_name',header:'Client Name'},
    {field:'client_code',header:'Client Code'},
    {field:'pan',header:'PAN'},
    {field:'kyc_type',header:'KYC Type'},
    {field:'login_at',header:'KYC Login At'}
  ]

  public static details = [
    'edit',
    'sl_no',
    'app_form_view',
    'ack_form_view',
    'mu_frm_view',
    'branch',
    'entry_dt',
    'tin_no',
    'bu_type',
    'arn_no',
    'sub_brk_arn',
    'sub_brk_cd',
    'euin_no',
    'client_name',
    'client_code',
    'pan',
    'kyc_type',
    'login_at'
  ];
  public static clmSelector =[
    {id:'edit',text:'Edit'},
    {id:'sl_no',text:'Sl No.'},
    {id:'app_form_view',text:'DOC View'},
    {id:'entry_dt',text:'Entry Date'},
    {id:'ack_form_view',text:'ACK View'},
    // {id:'mu_frm_view',text:'Manual Update View'},
    {id:'tin_no',text:'TIN'},
    {id:'bu_type',text:'Business Type'},
    {id:'branch',text:'Branch'},
    {id:'arn_no',text:'RM Name'},
    {id:'sub_brk_arn',text:'Sub Broker ARN'},
    {id:'sub_brk_cd',text:'Sub Broker Code'},
    {id:'euin_no',text:'EUIN'},
    {id:'client_name',text:'Client Name'},
    {id:'client_code',text:'Client Code'},
    {id:'pan',text:'PAN'},
    {id:'kyc_type',text:'KYC Type'},
    {id:'login_at',text:'KYC Login At'}
  ]
}
