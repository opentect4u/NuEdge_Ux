import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(number: number, args?: any): any {
    // console.log(number);
    // if (isNaN(number)) return null; // will only work value is a number
    // if (number === null) return null;
    // if (number === 0) return null;
    // let abs = Math.abs(number);
    // // console.log(abs);
    // const rounder = Math.pow(10, 1);
    // // console.log(rounder);
    // const isNegative = number < 0; // will also work for Negative numbers
    // let key = '';

    // const powers = [
    //     {key: 'Q', value: Math.pow(10, 14)},
    //     {key: 'T', value: Math.pow(10, 11)},
    //     {key: 'Cr', value: Math.pow(10, 8)},
    //     {key: 'M', value: Math.pow(10, 5)},
    //     {key: 'K', value: 1000}
    // ];
    // let formatter = Intl.NumberFormat('en');
    // console.log(formatter.format(number));
    // for (let i = 0; i < powers.length; i++) {
    //     let reduced = abs / powers[i].value;
    //     console.log(`${powers[i].key} : ${reduced}`);
    //     reduced = Math.round(reduced * rounder) / rounder;
    //     console.log(`${number} ${powers[i].key} : ${reduced}`);
    //     if (reduced >= 1) {
    //         abs = reduced;
    //       console.log(`${number} ${powers[i].key} : ${abs}`);

    //         key = powers[i].key;
    //         break;
    //     }
    // }
    // return (isNegative ? '-' : '') + abs + key;

      // 2 decimal places => 100, 3 => 1000, etc
  let decPlaces = Math.pow(10, 2)

  // Enumerate number abbreviations
  var abbrev = ['k', 'm', 'b', 't']
  let abbr;
  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3)

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces

      // Handle special case where we round up to the next abbreviation
      if (number == 1000 && i < abbrev.length - 1) {
        number = 1
        i++
      }
      abbr= abbrev[i].toUpperCase();
      // Add the letter for the abbreviation
      // number += abbrev[i]

      // We are done... stop
      break
    }
  }

  return number+abbr;

}

}
