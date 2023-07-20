import { column } from "src/app/__Model/tblClmns";

export class planClms{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'delete',header:'Delete'},
    {field:'sl_no',header:'Sl No'},
    {field:'plan_name',header:'Plan'}
  ]
}
