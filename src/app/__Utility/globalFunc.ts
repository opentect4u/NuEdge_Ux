import { DatePipe } from "@angular/common";
import { column } from "../__Model/tblClmns";
import * as XLSX from "xlsx";

export class global{

    public static randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
    public static  getActualVal(__item): any{
      return  __item ? __item : ''
    }
    public static containsSpecialChars(str) {
      const specialChars = /[ ]/;
      return specialChars.test(str);
    }

   public static getType(__str : string  | boolean | null = false){
   if(typeof(__str) == 'string'){
     return __str == 'true' ? true : false;
   }
    return __str ? __str : false;
   }

   public static concatURL(pathURL,fileName){
    return `${pathURL + fileName}`;
   }

   /*** For Getting Full Column List for NonFinancial for different Transaction */
   public static getColumnsAfterMerge = (columns,columnsTobeAdd):column[] =>{
    return  Array.from([...columns,...columnsTobeAdd]
      .reduce((m, o) => m.set(o.field, o), new Map)
      .values()
       );
   }

   public static getFrequencywiseAmt(freq_wiseAmt,freq_mode:string,periods:string){
    var freqdt;
    switch(freq_mode){
      case 'F':freqdt = JSON.parse(freq_wiseAmt).filter(x => this.getType(x.is_checked) && (x.id == periods))[0]?.sip_fresh_min_amt;
               break;
      default:freqdt = JSON.parse(freq_wiseAmt).filter(x => this.getType(x.is_checked) && (x.id == periods))[0]?.sip_add_min_amt;
            break;
    }
     return freqdt ? ('₹' + freqdt) : 'N/A'
   }
   private static  getFileName = (name: string) => {
    let timeSpan = new Date().toISOString();
    let sheetName = name || "Sample";
    let fileName = `${sheetName}-${timeSpan}`;
    return {
      sheetName,
      fileName
    };
  };

   static exportTableToExcel(tableId: string, name?: string) {
    let { sheetName, fileName } = this.getFileName(name);
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: sheetName
    });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  /**
   * calcular future year and populate in dropdown in SIP/STP/SWP Report
   */
  public static getYears = ():Promise<number[]> =>{
      let years:number[] = []
      const start_year = 1980;
      const dt = new Date();
      const year = dt.setFullYear(dt.getFullYear() + 76);
      for(let i = start_year ; i >= year;i++){
        years.push(i);
      }
      return new  Promise((resolve, reject) => {
          resolve(years);
      })
  }

  /**
   * calculate TOTAL AMOUNT FROM ARRAY
   */
  public static calculatAmt(arr): number{
    return arr.length > 0 ? Number(arr.map((item) => item.amount).reduce((prev,curr) => prev + curr)) : arr.length;
  }

  /**
   * calculat future year and month from Jan-1980 populate in dropdown in SIP/STP/SWP Report
   */
  public static getMonthYears = ():Promise<string[]> =>{
    let datePipe = new DatePipe('en-Us');
    let month_year:string[] = []
    for(let i = 1980 ; i <= new Date().getFullYear();i++){
          for(let j=0;j<12;j++){
            if(new Date(i, j) > new Date()){
                break;
            }
            else{
                month_year.push(datePipe.transform(new Date(i,j),'MMM-YYYY'));
            }
          }
    }
    return new  Promise((resolve, reject) => {
        resolve(month_year);
        reject('Error')
    })
}

}
