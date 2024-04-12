export interface rntTrxnType {
  c_k_trans_sub_type: string | null;
  c_k_trans_type: string | null;
  c_trans_type_code?: string | null;
  id: number;
  k_divident_flag?: string | null;
  rnt_id: number;
  trans_sub_type: string | null;
  trans_type: string | null;
  rnt_name: string;
  process_type:string;
  xirr_process_type:string;
  lmf_pl:string;
}

export interface ISystematicTransaction {
  id: number;
  rnt_id: number;
  rnt_name: string;
  trans_type: string;
  trans_sub_type:string;
  trans_type_code: string;
}

export interface ISystematiceFrequency {
  freq_code: string;
  freq_name: string;
  id: number;
  rnt_id: number;
  rnt_name: string;
}


export interface ISystematiceUnregisteredRemarks {
  id: number;
  rnt_id: number;
  rnt_name: string;
  remarks:string;
}

export interface IFolioTaxStatus{
  id: number;
  rnt_id: number;
  status_code: string;
  status:string;
}

