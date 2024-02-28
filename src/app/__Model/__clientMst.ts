import { docs } from "./docs"

export interface client {
    client_name: string
    client_code: string
    dob?: number
    pan?: string
    mobile?: number
    sec_mobile?: number
    email?: string
    sec_email?: string
    add_line_1?: string
    add_line_2?: string
    city?: string
    city_name?:string;
    dist?: string;
    district_name?:string;
    state_name?:string;
    state?: string
    pincode?: number
    id: number
    created_by?:number
    created_at?:string
    updated_by?:number
    updated_at?:string
    gurdians_name?: string
    gurdians_pan?: string
    relation?: string;
    client_doc?:docs[]
    client_type?: string,
    anniversary_date?: string,
    dob_actual?: string;
    client_type_mode?: string;
    valuation_as_on?:Date | null,
    proprietor_name?:string;
    date_of_incorporation?:string;
    karta_name?:string;
    inc_date?:string;
    pertner_dtls?:any;
    identification_number?:string;
    country?:any;
    family_count?:number;
    client_addr?:string;
    relationship?:string;
  }
