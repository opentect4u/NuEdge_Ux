import { column } from "src/app/__Model/tblClmns";

export class licenceClmns{
  public static column: column[] = [
    {field:'edit',header:'Edit'},
    {field:'product_name',header:'Product'},
    {field:'licence_no',header:'Licence No.'},
    {field:'valid_from',header:'Valid From'},
    {field:'valid_to',header:'Valid To'},
    {field:'upload_file',header:'Document'}

  ]
}
