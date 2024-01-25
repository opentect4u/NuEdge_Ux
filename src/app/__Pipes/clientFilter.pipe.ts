import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientFltr'
})
export class ClientFilterPipe implements PipeTransform {

  transform(client,filteredvalue, args?: any): any {
       if(filteredvalue && client.length > 0){
        return client.filter((item) => item.id != filteredvalue.id)
       }
       return client
  }
}
