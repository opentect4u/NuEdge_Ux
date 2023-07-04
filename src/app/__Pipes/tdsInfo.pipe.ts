import { Pipe, PipeTransform } from '@angular/core';
import tdsInfo from '../../assets/json/TDSInfo.json'
@Pipe({
  name: 'tdsInfo'
})
export class TdsInfoPipe implements PipeTransform {
  transform(value: number, args?: any): any {
       if(value){
        return tdsInfo.filter(x => x.id == value)[0]?.name
       }
       return 'N/A';
  }
}
