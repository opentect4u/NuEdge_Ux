import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'filter'})
export class FilterByStatusPipe implements PipeTransform {

    transform(trxnRPT, flag: string): any[] {
        if (trxnRPT.length > 0) {
            return trxnRPT.filter((listing: any) => listing.process_type === flag);
        }
        else{
          return []
        }
    }
}
