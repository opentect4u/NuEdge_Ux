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
}
