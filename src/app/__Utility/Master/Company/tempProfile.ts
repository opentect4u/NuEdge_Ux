import { column } from "src/app/__Model/tblClmns";

export class tempProfile{
  public static columns:column[] = [
    {field:'edit',header:'Edit'},
    // {field:'delete',header:'Delete'},
    {field:'name',header:'Name'},
    {field:'from_dt',header:'Displayed From'},
    {field:'to_dt',header:'Displayed To'},
    {field:'upload_logo',header:'Logo'},
  ]
}
