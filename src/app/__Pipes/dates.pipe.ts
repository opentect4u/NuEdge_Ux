import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'dates'
})
export class DateArrayPipe implements PipeTransform {

  transform(value: string, args?: any):any{

    if(value){
      console.log(value)
      console.log(JSON.parse(value).map(x=> x.date))
       return JSON.parse(value).map(x=> x.date);
    }
    return [];

  }
}
