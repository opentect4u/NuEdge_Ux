import { Pipe, PipeTransform } from '@angular/core';
import { IDivHistory } from '../__Pages/__Main/Products/MutualFund/PortFolio/LiveMFPortFolio/div-history/div-history.component';

@Pipe({
  name: 'divHistory'
})
export class divHistoryPipe implements PipeTransform {

  transform(value:Partial<IDivHistory>[], args: string) {
       if(args === 'R'){
          return value.filter((item:Required<IDivHistory>) => item.transaction_subtype.includes('Dividend Reinvestment')).map(el =>{
             el.scheme_name =`${el.scheme_name}-${el.plan_name}-${el.option_name}`;
             return el;
          })
       }
       else if(args === 'P'){
        return value.filter((item:Required<IDivHistory>) => item.transaction_subtype.includes('Dividend Payout')).map(el =>{
          el.scheme_name =`${el.scheme_name}-${el.plan_name}-${el.option_name}`;
          return el;
       })
       }
       else{
        return value.map(el =>{
          el.scheme_name =`${el.scheme_name}-${el.plan_name}-${el.option_name}`;
          return el;
       })
       }
  }
}
