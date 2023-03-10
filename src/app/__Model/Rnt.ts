
/****************GET RESPONSE OF RNT MASTER FROM BACKEND IN THE FOLLOWING FORMAT***********************/
export interface rnt {
     id: number;
     rnt_name: string;
     rnt_full_name: string;
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
/****************END***********************/
