import { Pipe, PipeTransform } from '@angular/core';
import modeOfPremium from '../../assets/json/Master/modeofPremium.json';
@Pipe({
  name: 'modeOfPre'
})
export class modeOfPrePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if(value){
      return value ? modeOfPremium.filter((x: any) => (x.id = value))[0].name : 'N/A';
    }
    return '';
  }
}
