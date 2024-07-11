import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnfilter'
})
export class ColumnfilterPipe implements PipeTransform {

  transform(value: any[], tab_id:string) {
    return value.filter(el => el.isVisible.includes(tab_id));
  }

}
