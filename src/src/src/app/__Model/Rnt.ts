
/****************GET RESPONSE OF RNT MASTER FROM BACKEND IN THE FOLLOWING FORMAT***********************/
export interface rnt {
     id: number;
     rnt_name: string;
     created_at: string;
     created_by: number;
     updated_at: string;
     updated_by: number;
     ofc_addr?: any;
     website: any;
     cus_care_no?:number
     cus_care_email?:any,

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
