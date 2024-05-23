import { Pipe, PipeTransform } from '@angular/core';
import { ILivePortFolio } from '../__Pages/__Main/Products/MutualFund/PortFolio/LiveMFPortFolio/live-mf-port-folio.component';

@Pipe({
  name: 'divHistory'
})
export class divHistoryPipe implements PipeTransform {

  transform(value:Partial<ILivePortFolio>[], args: string) {
       if(args === 'R'){
          return value.filter((item:Required<ILivePortFolio>) => Number(item.idcw_reinv) > 0);
       }
       else if(args === 'P'){
        return value.filter((item:Required<ILivePortFolio>) => Number(item.idcwp) > 0);
       }
       else{
        return value.filter((item:Required<ILivePortFolio>) => (Number(item.idcw_reinv) > 0 || Number(item.idcwp) > 0));
       }
  }
}
