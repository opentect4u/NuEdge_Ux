import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MstDataGetter'
})
export class MstDataGetterPipe implements PipeTransform {

  transform(object: any, keyName: string, ...args: unknown[]): unknown {
    console.log(object); 
    console.log(object[keyName]);
    
    return object[keyName];
  }

}
