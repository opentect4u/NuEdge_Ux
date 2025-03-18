import { Pipe, PipeTransform } from '@angular/core';
import { global } from '../__Utility/globalFunc';
@Pipe({
  name: 'XIRRCalc'
})
export class XIRRCalcPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const XIRRCalc = global.XIRR(value.xirr_amt_arr,value.xirr_date_arr,0);
    const actualXirr = XIRRCalc ? (isFinite(XIRRCalc) && XIRRCalc ? XIRRCalc : 0) : 0;
    return `${(Number(actualXirr) * 100).toFixed(2)}%`;
  }
}
