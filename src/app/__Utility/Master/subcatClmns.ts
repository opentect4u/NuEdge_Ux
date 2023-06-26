import { column } from "src/app/__Model/tblClmns";

export class subcatClmns{
  public static COLUMN:column[] = [
    {field:'edit',header:'Edit'},
    {field:'delete',header:'Delete'},
    {field:'cat_name',header:'Category'},
    {field:'subcategory_name',header:'Sub Category'}
  ]
}
