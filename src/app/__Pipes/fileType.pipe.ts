import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'fileType'
})
export class fileTypePipe implements PipeTransform {
  transform(id: number, mst: Partial<{id:number,name:string}[]>): string {
    return (mst.findIndex(item => item.id) != -1
    ?  mst.filter(item => item.id == id)[0]?.name : 'N/A');
  }

}
