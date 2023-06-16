export class mfRcvClmns {
  public static INITIAL_CLMNS = [
    'edit',
    'delete',
    'sl_no',
    'temp_tin_no',
    'bu_type',
    'branch_name',
    'entry_dt',
    'euin_no',
    'client_name',
    'client_code',
    'rcv_datetime',
    'recv_from',
    'trans_type',
  ];
  public static DETAIL_CLMNS = [
    'edit',
    'delete',
    'sl_no',
    'temp_tin_no',
    'bu_type',
    'branch_name',
    'entry_dt',
    'arn_no',
    'sub_brk_cd',
    'euin_no',
    'client_name',
    'client_code',
    'rcv_datetime',
    'recv_from',
    'trans_type',
    'apl_no',
    'folio_no',
    'remarks',
  ];

  public static CLOUMN_SELECTOR = [
    { id: 'edit', text: 'Edit' },
    { id: 'delete', text: 'Delete' },
    { id: 'sl_no', text: 'Sl No' },
    { id: 'temp_tin_no', text: 'Temporary Tin Number' },
    { id: 'bu_type', text: 'Buisness type' },
    { id: 'branch_name', text: 'Branch' },
    { id: 'entry_dt', text: 'Entry Date' },
    { id: 'arn_no', text: 'ARN Number' },
    { id: 'sub_brk_cd', text: 'Sub Broker Code' },
    { id: 'euin_no', text: 'EUIN' },
    { id: 'client_name', text: 'First Holder Name' },
    { id: 'client_code', text: 'First Holder Code' },
    { id: 'rcv_datetime', text: 'Receive DateTime' },
    { id: 'recv_from', text: 'Reaceive From' },
    { id: 'trans_type', text: 'Transaction Type' },
    { id: 'apl_no', text: 'Application Number' },
    { id: 'folio_no', text: 'Folio Number' },
    { id: 'remarks', text: 'Remarks' },
  ];
}
