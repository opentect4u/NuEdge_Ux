
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'liveMfChartSummary'})
export class LiveMfChartSummaryPipe implements PipeTransform {
    transform(summary:any[],title:string | undefined = '',
        name:string | undefined = '',
        name_type:string | undefined = '',
        y_axis_type:string){
            return{
                title:title,
                name:name,
                data:summary.map((el:any) => {
                    el.name= el[name_type],
                    el.y=el[y_axis_type]
                    return el
                })
            }
    }
}
