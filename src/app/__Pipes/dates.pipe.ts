import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dates'
})
export class DateArrayPipe implements PipeTransform {

  transform(value: string, args?: any): any {

    if(value){
       return JSON.parse(value).map(x=> x.date);
    }
    return [];

  }
}
