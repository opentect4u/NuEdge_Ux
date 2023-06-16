import { column } from "src/app/__Model/tblClmns";

export class productMappingClmns{
  public static columns:column[] = [
         {field:'edit',header:'Edit'},
         {field:'cm_profile_name',header:'Company'},
         {field:'product_name',header:'Product'}
  ]
}
