import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(number: number, args?: any): any {
  // let decPlaces = Math.pow(10, 2)
  // var abbrev = ['k', 'm', 'b']
  // let abbr;
  // for (var i = abbrev.length - 1; i >= 0; i--) {
  //   var size = Math.pow(10, (i + 1) * 3);
  //   if (size <= number) {

  //     number = Math.round((number * decPlaces) / size) / decPlaces
  //     if (number == 1000 && i < abbrev.length - 1) {
  //       number = 1
  //       i++
  //     }
  //     abbr= abbrev[i].toUpperCase();
  //     break
  //   }
  // }

  // return number+abbr;

  const val = Math.abs(number)
  if (val >= 10000000) return `${Number(number / 10000000).toLocaleString("en-IN", { maximumFractionDigits:2, minimumFractionDigits:2 })} Cr`
  if (val >= 100000) return `${(number / 100000).toLocaleString("en-IN", { maximumFractionDigits:2, minimumFractionDigits:2 })} Lac`
  if (val >= 1000) return `${(number / 1000).toLocaleString("en-IN", { maximumFractionDigits:2, minimumFractionDigits:2 })} K`

  return number;

}

}
