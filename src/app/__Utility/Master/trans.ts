import { column } from "src/app/__Model/tblClmns";

export class transClmns{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'trns_type',header:'Transaction Type'},
    {field:'trns_name',header:'Transaction'},
  ]
}

export class trnsTypeClmns{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'trns_type',header:'Transaction Type'}
  ]
}

export class sipTypeClmns{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'sip_type_name',header:'SIP Type'}
  ]
}

export class swpTypeClmns{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'swp_type_name',header:'SWP Type'}
  ]
}


export class stpTypeClmns{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'stp_type_name',header:'STP Type'}
  ]
}
