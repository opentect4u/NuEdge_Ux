import { Pipe, PipeTransform } from '@angular/core';
import relationship from '../../assets/json/Master/relationShip.json';
@Pipe({
  name: 'relationship'
})
export class RelationshipPipe implements PipeTransform {

  transform(value: string | null = null): string {
     if(value){
       return relationship.filter(x => x.id == value)[0].relation
     }
    return 'N/A'
  }

}
