import { column } from "../tblClmns";

export class kycClm {
  public static Summary_copy:column[] = [
    {field:'edit',header:'Edit',width:'5rem'},
    {field:'app_form_view',header:'APP View',width:'5rem'},
    {field:'ack_form_view',header:'ACK View',width:'5rem'},
    // {field:'mu_frm_view',header:'Manual Update View'},
    {field:'tin_no',header:'TIN',width:'8rem'},
    {field:'bu_type',header:'Business Type',width:'8rem'},
    {field:'branch_name',header:'Branch',width:'10rem'},
    {field:'sub_brk_cd',header:'Sub Broker Code',width:'12rem'},
    {field:'client_name',header:'Client Name',width:'35rem'},
    {field:'client_code',header:'Client Code',width:'8rem'},
    {field:'pan',header:'PAN',width:'10rem'},
    {field:'trans_name',header:'KYC Type',width:'8rem'}
  ]

  public static Details:column[] = [
    {field:'edit',header:'Edit',width:'5rem'},
    {field:'app_form_view',header:'APP View',width:'5rem'},
    {field:'entry_dt',header:'Entry Date',width:'5rem'},
    {field:'ack_form_view',header:'ACK View',width:'5rem'},
    // {field:'mu_frm_view',header:'Manual Update View'},
    {field:'tin_no',header:'TIN',width:'8rem'},
    {field:'bu_type',header:'Business Type',width:'8rem'},
    {field:'branch_name',header:'Branch',width:'10rem'},
    {field:'rm_name',header:'RM Name',width:'10rem'},
    {field:'sub_brk_arn',header:'Sub Broker ARN',width:'10rem'},
    {field:'sub_brk_cd',header:'Sub Broker Code',width:'12rem'},
    {field:'euin_no',header:'EUIN',width:'10rem'},
    {field:'client_name',header:'Client Name',width:'35rem'},
    {field:'client_code',header:'Client Code',width:'8rem'},
    {field:'pan',header:'PAN',width:'10rem'},
    {field:'trans_name',header:'KYC Type',width:'8rem'},
    {field:'kyc_login_type',header:'KYC Login',width:'8rem'},
    {field:'login_at',header:'KYC Login At',width:'12rem'}

  ]

  public static clmSelector =[
    {id:'edit',text:'Edit',width:'5rem'},
    {id:'sl_no',text:'Sl No.',width:'5rem'},
    {id:'app_form_view',text:'APP View',width:'5rem'},
    {id:'entry_dt',text:'Entry Date',width:'5rem'},
    {id:'ack_form_view',text:'ACK View',width:'5rem'},
    {id:'tin_no',text:'TIN',width:'8rem'},
    {id:'bu_type',text:'Business Type',width:'8rem'},
    {id:'branch_name',text:'Branch',width:'10rem'},
    {id:'rm_name',text:'RM Name',width:'10rem'},
    {id:'sub_brk_arn',text:'Sub Broker ARN',width:'10rem'},
    {id:'sub_brk_cd',text:'Sub Broker Code',width:'12rem'},
    {id:'euin_no',text:'EUIN',width:'10rem'},
    {id:'client_name',text:'Client Name',width:'35rem'},
    {id:'client_code',text:'Client Code',width:'8rem'},
    {id:'pan',text:'PAN',width:'10rem'},
    {id:'trans_name',text:'KYC Type',width:'8rem'},
    {field:'kyc_login_type',header:'KYC Login',width:'8rem'},
    {field:'login_at',header:'KYC Login At',width:'12rem'}

  ]
}
