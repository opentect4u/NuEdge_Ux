import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'fundWisePercentage'
})
export class FundWiseInvestmentPercentage implements PipeTransform {
    transform(value, key?: string,total:number | undefined = 0): any {
  
         const filtered_data =  value.filter((el) =>{
                    el.percentage = (Number(el[key]) * 100) / total;
                    console.log(el.percentage)
                    return el
         });

         return filtered_data

    }
}
