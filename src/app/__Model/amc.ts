
/****************GET RESPONSE OF AMC MASTER FROM BACKEND IN THE FOLLOWING FORMAT***********************/
export interface amc {
  amc_name: string
  created_at: string
  created_by: number
  id: number
  product_id: number
  rnt_id: number
  updated_at: string
  updated_by: any
  sip_start_date: Date;
  sip_end_date: Date;
  l1_contact_no: number
  l1_email: string
  l1_name: string
  l2_contact_no: number
  l2_email: string
  l2_name: string
  l3_contact_no: number
  l3_email: string
  l3_name: string
  l4_contact_no: number
  l4_email: string
  l4_name: string
  l5_contact_no: number
  l5_email: string
  l5_name: string
  l6_contact_no: number
  l6_email: string
  l6_name: string
  gstin: string;
  ofc_addr: string
  website: string
  cus_care_no:number
  cus_care_email:string,

  head_ofc_contact_per: any
  head_contact_per_mob: any
  head_contact_per_email: any
  head_ofc_addr: any

  local_ofc_contact_per: any
  local_contact_per_mob: any
  local_contact_per_email: any
  local_ofc_addr: any
}
/****************END***********************/
