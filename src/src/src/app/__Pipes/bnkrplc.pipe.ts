import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bnkrplc'
})
export class BnkrplcPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if(value == '&laquo; Previous'){
      return value.replace('&laquo; Previous','P');

    }
    else if(value == 'Next &raquo;'){
      return value.replace('Next &raquo;','N');
    }
    return value;
  }
}
