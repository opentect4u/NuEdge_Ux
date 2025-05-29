import { Pipe, PipeTransform } from '@angular/core';
import { global } from '../__Utility/globalFunc';
// import { global } from '../__Utility/globalFunc';
@Pipe({
  name: 'XIRRWithAum_DateParamsCalc'
})
export class XIRRWithAum_DateParamsCalcPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    console.log(value.all_amount_arr);
    console.log(value.all_amount_arr);
    let  all_amount_arr = value.all_amount_arr ? JSON.parse(value.all_amount_arr) : [];
    let  all_date_arr = value.all_date_arr ? JSON.parse(value.all_date_arr) : [];
    all_amount_arr.push(Number(value?.curr_aum));
    all_date_arr.push(args);
    const XIRRCalc = global.XIRR(all_amount_arr,all_date_arr,0);
    const actualXirr = XIRRCalc ? (isFinite(XIRRCalc) && XIRRCalc ? XIRRCalc : 0) : 0;
    return `${(Number(actualXirr) * 100).toFixed(2)}%`;
  }
}
