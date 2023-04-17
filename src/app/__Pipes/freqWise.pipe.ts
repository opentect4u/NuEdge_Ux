import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'freqWiseamt'
})
export class FreqWiseAmtPipe implements PipeTransform {

  transform(value: string, args?: any,periods?: string,isFresh?:string): any {
       const arr = JSON.parse(value).filter(x => x.is_checked == 'true');
       console.log(arr);

       if(args == 1){
              console.log();
              if(isFresh == 'A'){
                return (arr.filter(x => x.id == periods)[0]?.sip_fresh_min_amt) ? (arr.filter(x => x.id == periods)[0].sip_add_min_amt) : 0;
              }
              else{
                return (arr.filter(x => x.id == periods)[0]?.sip_fresh_min_amt) ? (arr.filter(x => x.id == periods)[0].sip_fresh_min_amt) : 0;
              }
       }
       else{
            return (arr.filter(x => x.id == periods)[0]?.sip_fresh_min_amt) ? (arr.filter(x => x.id == periods)[0].sip_add_min_amt) : 0;
       }
  }
}
