import { Pipe, PipeTransform } from '@angular/core';
import { IPLTrxn } from '../__Pages/__Main/Products/MutualFund/PortFolio/LiveMFPortFolio/pl-trxn-dtls/pl-trxn-dtls.component';

@Pipe({
  name: 'plFilter'
})
export class plFilterPipe implements PipeTransform {

  transform(value: Partial<IPLTrxn>[], args?: string): any {
      if(args === 'L'){
        // Live Folio
        return value.filter(el => Number(el.tot_units) > 0);
      }
      else if(args === 'N'){
        // Non Live folio
        return value.filter(el => Number(el.tot_units) <= 0)
      }
      return value
  }
}
