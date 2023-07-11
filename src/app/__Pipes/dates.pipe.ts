import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'dates'
})
export class DateArrayPipe implements PipeTransform {

  transform(value: string, args?: any): Observable<any> {

    if(value){
       return of(JSON.parse(value).map(x=> x.date));
    }
    return of([]);

  }
}
