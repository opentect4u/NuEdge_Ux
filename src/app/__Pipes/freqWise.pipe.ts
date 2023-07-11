import { Pipe, PipeTransform } from '@angular/core';
import { global } from '../__Utility/globalFunc';
@Pipe({
  name: 'freqWiseamt'
})
export class FreqWiseAmtPipe implements PipeTransform {

  transform(value: string, args?: any,periods?: string,isFresh?:string): any {
    console.log(value);

      //  const arr = JSON.parse(value).filter(x => global.getType(x.is_checked));
      //  if(args == 1){
      //         if(isFresh == 'A'){
      //           return (arr.filter(x => x.id == periods)[0]?.sip_add_min_amt) ? (arr.filter(x => x.id == periods)[0].sip_add_min_amt) : 'N/A';
      //         }
      //         else{
      //           return (arr.filter(x => x.id == periods)[0]?.sip_fresh_min_amt) ? (arr.filter(x => x.id == periods)[0].sip_fresh_min_amt) : 'N/A';
      //         }
      //  }
      //  else{
      //       return (arr.filter(x => x.id == periods)[0]?.sip_add_min_amt) ? (arr.filter(x => x.id == periods)[0].sip_add_min_amt) : 'N/A';
      //  }
      return '';
  }
}
