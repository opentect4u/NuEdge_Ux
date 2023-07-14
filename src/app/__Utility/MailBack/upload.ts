import { column } from "src/app/__Model/tblClmns";

export class uploadManual{
        public static columns:column[] =[
                          {field:'rnt_name',header:'R&T'},
                          {field:'file_type_id',header:'File Type'},
                          {field:'file_name',header:'File Name'},
                          {field:'process_date',header:'Process Date'},
                          {field:'upload_file',header:'DOC'}
        ]
}
