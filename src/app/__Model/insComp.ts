export interface insComp {
  inst_type_id: number;
  id: number;
  ins_type: string;
  comp_short_name: string;
  comp_full_name: string;
  login_url: string;
  login_pass: string;
  login_id: string;
  security_qus_ans: any;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  ofc_addr?: any;
  website: any;
  cus_care_no?:number
  cus_care_email?:any,
  gstin:string;
  cus_care_whatsapp_no: string;
  head_ofc_contact_per: any
  head_contact_per_mob: any
  head_contact_per_email: any
  head_ofc_addr: any

  local_ofc_contact_per: any
  local_contact_per_mob: any
  local_contact_per_email: any
  local_ofc_addr: any

}
