export interface IStaticRpt {

  id: number
  rnt_id: number;
  bu_type:string;
  rm_name:string;
  branch_name:string;
  sub_brk_cd:string;
  euin_no:string;
  product_code: string
  amc_code: string
  folio_no: string
  first_client_name:string;
  cat_name:string;
  subcat_name:string;
  scheme_name:string;
  add_1:string;
  add_2:string;
  add_3:string;
  city:string;
  state:string;
  pincode:number;
  city_type_name:string;
  mode_of_holding:string;
  pan:string;
  ckyc_no_1st:string;
  ckyc_no_2nd:string;
  ckyc_no_3rd:string;
  dob: string;
  dob_2nd_holder: string;
  dob_3rd_holder: string;
  tax_status: string;
  tax_status_2_holder: string;
  tax_status_3_holder: string;
  occupation_des:string;
  occupation_des_2nd:string;
  occupation_des_3rd:string;
  mobile: string;
  mobile_2nd_holder: string;
  mobile_3rd_holder: string;
  email: string;
  email_2nd_holder: string;
  email_3rd_holder: string;
  guardian_name:string;
  guardian_pan:string;
  guardian_ckyc_no:string;
  guardian_dob:string;
  guardian_tax_status:string;
  guardian_occu_des:string;
  guardian_mobile: string;
  guardian_email: string;
  guardian_relation: string;
  pa_link_ststus_1st: string;
  pa_link_ststus_2nd: string;
  pa_link_ststus_3rd: string;
  guardian_pa_link_ststus:string;
  kyc_status_1st:string;
  kyc_status_2nd:string;
  kyc_status_3rd:string;
  guardian_kyc_status:string;
  bank_name:string;
  bank_acc_no:string;
  acc_type:string;
  bank_ifsc:string;
  bank_micr:string;
  bank_branch:string;
  nom_name_1:string;
  nom_relation_1:string;
  nom_per_1:number;
  nom_name_2:string;
  nom_relation_2:string;
  nom_per_2:number;
  nom_optout_status:string;
  nom_name_3:string;
  nom_relation_3: string,
  nom_per_3: number,
  folio_date:Date;
  folio_status:string;
}
