import { Pipe, PipeTransform } from '@angular/core';
import fileMstDtls from '../../assets/json/fileType.json';
@Pipe({
  name: 'mailBckfile'
})
export class MailBckfilePipe implements PipeTransform {
  transform(file_id:number,file_type_id:number): unknown {
    let file = fileMstDtls.filter(item => item.id == file_type_id)[0];
    return file.sub_menu.filter(file => file.id == file_id)[0].name;
  }

}
