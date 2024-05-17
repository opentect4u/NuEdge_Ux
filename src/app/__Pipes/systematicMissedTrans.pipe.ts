

import { Pipe, PipeTransform } from '@angular/core';
import { ISystematicMissedTrxn } from '../__Pages/__Main/Products/MutualFund/PortFolio/LiveMFPortFolio/systematic-missed-trxn/systematic-missed-trxn.component';

@Pipe({
  name: 'systamaticMissedTransFilter'
})
export class systamaticMissedTransFilterPipe implements PipeTransform {

  transform(value: Partial<ISystematicMissedTrxn>[], args?: string): any {
      if(args === 'P'){
        // Live Folio
        return value.filter((el:ISystematicMissedTrxn) => el.transaction_type.toLowerCase().includes('sip'));
      }
      else if(args === 'SO'){
        // Non Live folio
        return value.filter((el:ISystematicMissedTrxn) => el.transaction_type.toLowerCase().includes('stp'))
      }
      return value.filter((el:ISystematicMissedTrxn) => el.transaction_type.toLowerCase().includes('swp'))
  }
}
