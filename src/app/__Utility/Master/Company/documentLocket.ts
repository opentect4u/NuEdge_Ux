import { column } from "src/app/__Model/tblClmns";

export class documentLockerClmns{
  public static columns: column [] =[
    {field:'edit',header:'Edit'},
    {field:'comp_name',header:'Company'},
    {field:'doc_name',header:'Document Name'},
    {field:'doc_no',header:'Document Number'},
    {field:'valid_from',header:'Valid From'},
    {field:'valid_to',header:'Valid To'},
    {field:'upload_file',header:'Document'}
  ]
}
