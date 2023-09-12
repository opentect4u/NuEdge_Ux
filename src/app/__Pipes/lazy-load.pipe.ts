import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lazyLoad'
})
export class LazyLoadPipe implements PipeTransform {

  intervalFlag: number = 0;
  loadRows: number = 50;
  items = [];

  transform(
    items: any,
    intialLoadRows: number = 50,
    intervalLoadRows: number = 100,
    interval: number = 100
  ): any {
    this.items = items;
    if (this.intervalFlag == 0) {
      this.intervalFlag = 1;
      const that = this;
      this.loadRows = intialLoadRows;
      const inter = setInterval(function () {
        if (that.items && that.items?.length) {
          if (that.items?.length > that.loadRows) {
            that.loadRows = that.loadRows + intervalLoadRows;
          } else {
            if (inter) {
              clearInterval(inter);
            }
          }
        }
      }, interval);
    }
    if (items && items?.length) {
      console.log('counter', this.loadRows);
      return items.slice(0, this.loadRows);
    }
  }

}
