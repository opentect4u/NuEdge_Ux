import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class elipsisPipe implements PipeTransform {

  transform(value: string, limit: number): any {
    console.log(value);
    if(value){


      if(limit && value.length > limit) {
        return value.substring(0, limit).concat('...');
      }
      return value;
    }
    return '';

  }
}
