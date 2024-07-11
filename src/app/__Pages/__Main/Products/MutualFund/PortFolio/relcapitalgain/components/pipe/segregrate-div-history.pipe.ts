import { Pipe, PipeTransform } from '@angular/core';
import { from, of, zip } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';

@Pipe({
  name: 'segregrateDivHistory'
})
export class SegregrateDivHistoryPipe implements PipeTransform {

  transform(value: any, tab_id) {
    if(tab_id == 'DD'){
      const dt =  value.map(el => ({
          ...el,
         idcw:el.transaction_subtype.includes('Dividend Payout') ?  el.amount : "0.00",
         idcw_reinv: el.transaction_subtype.includes('Dividend Reinvestment') ?  el.amount : "0.00"
      }));
      console.log(dt)
      return dt;
    }
    return this.getIDCWSegregratedReport(value)
  }

  getIDCWSegregratedReport(res){
    let div_history = [];
    from(res)
    .pipe(
      groupBy((data:any) => data['scheme_name']),
      mergeMap(group => zip(of(group.key), group.pipe(toArray())))
    ).subscribe((dt) =>{
        let idcwp = dt[1].filter(el => el.transaction_subtype.includes("Dividend Payout"));
        let idcw_reinv = dt[1].filter(el => el.transaction_subtype.includes("Dividend Reinvestment"));
        div_history.push(
          {
              scheme_name:dt[0],
              idcwp: global.Total__Count(idcwp,(item:any) => Number(item.amount)),
              idcw_reinv:global.Total__Count(idcw_reinv,(item:any) => Number(item.amount)),
              folio_no:dt[1][0].folio_no,
              idcw_sweep_in:0.00,
              idcw_sweep_out:0.00,
              tot_tds:global.Total__Count(idcwp,(item:any) => Number(item.tot_tds))
          }
        )
    })
    return div_history;
    
  }
}
