import { DatePipe } from "@angular/common";
import { column } from "../__Model/tblClmns";
import * as XLSX from "xlsx";
import moment from "moment";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
  public static getMonthYears = ():Promise<{month:string,actual:string}[]> =>{
    let datePipe = new DatePipe('en-Us');
    let month_year:{month:string,actual:string}[] = []
    for(let i = 1980 ; i <= new Date().getFullYear();i++){
          for(let j=0;j<12;j++){
            if(new Date(i, j) > new Date()){
                break;
            }
            else{
                month_year.push({
                  month:datePipe.transform(new Date(i,j),'MMM-YYYY'),
                  actual:datePipe.transform(new Date(i,j),'MM-YYYY')
                });
            }
          }
    }
    return new  Promise((resolve, reject) => {
        resolve(month_year);
        reject('Error')
    })
 }

 public static getCurrenctMonth_year():{month:string,actual:string}{
    let datePipe = new DatePipe('en-Us');
    return {
      month:datePipe.transform(new Date(),'MMM-YYYY'),
      actual:datePipe.transform(new Date(),'MM-YYYY')
    }
 }


  // public static XIRR(values, dates, guess) {
  //   // Initialize guess and resultRate
  //   var guess = (typeof guess === 'undefined') ? 0.1 : guess;
  //   var resultRate = guess;

  //   // Set maximum epsilon for end of iteration
  //   var epsMax = 1e-10;

  //   // Set maximum number of iterations
  //   var iterMax = 20;

  //   // Implement Newton's method
  //   var newRate, epsRate, resultValue;
  //   var iteration = 0;
  //   var contLoop = true;
  //   do {
  //     resultValue = this.irrResult(values, dates, resultRate);
  //     newRate = resultRate - resultValue / this.irrResultDeriv(values, dates, resultRate);
  //     epsRate = Math.abs(newRate - resultRate);
  //     resultRate = newRate;
  //     contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
  //   } while(contLoop && (++iteration < iterMax));
  //   if(contLoop)return 0;

  //   // Return internal rate of return
  //   return resultRate ;
  // }

  // private static irrResult = (values, dates, rate) => {
  //   var r = rate + 1;
  //   var result = values[0];
  //   values.forEach((el,i) =>{
  //     result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
  //   })
  //   return result;
  // }


  // private static irrResultDeriv = (values, dates, rate) => {
  //   var r = rate + 1;
  //   var result = 0;
  //   values.forEach((el,i) =>{
  //     var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
  //     result -= frac * values[i] / Math.pow(r, frac + 1);
  //   })
  //   return result;
  // }

   public static XIRR(values, dates, guess) {
    var irrResult = function(values, dates, rate) {
      var r = rate + 1;
      var result = values[0];
      values.forEach((el,i) =>{
        if(i>0){
         result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
       }
      })
      return result;
    }

    // Calculates the first derivation
    var irrResultDeriv = function(values, dates, rate) {
      var r = rate + 1;
      var result = 0;
      values.forEach((el,i) =>{
        if(i>0){
        var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      })
      return result;
    }

    var guess = (typeof guess === 'undefined') ? 0.1 : guess;
    var resultRate = guess;
    var epsMax = 1e-10;
    var iterMax = 20;
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    } while(contLoop && (++iteration < iterMax));
    if(contLoop)return 0;
    return resultRate;
  }

    /**
   * For Counting Number of locked and unlocked transactions
   * @param arr
   * @param predicate
   * @returns
   */
    public static Total__Count<T>(arr: T[], predicate: (elem: T, idx: number) => number) {
      return arr.reduce((prev, curr, idx) => prev + (predicate(curr, idx)), 0)
      }

    public static getAllFinancialYears():string[]{
      try{
        const thisYear = (new Date()).getFullYear();
        let fiscal_year = (new Date().getMonth() + 1 >= 4) ? (thisYear + 1) : thisYear
        const financial_year = [0, 1, 2, 3, 4,5,6,7,8,9,10,11].map((count) =>{
          return `${(fiscal_year - count - 1).toString()}-${fiscal_year - count}`
        }
      );
        return financial_year;
      }
      catch(err){
        console.log(err)
         return []
      }

      // return yearArray.join();
    }

    /*** Get Current Funnacial Year */
    public static getCurrentFinancialYear():string {
      var fiscalyear = "";
      var today = new Date();
      if ((today.getMonth() + 1) <= 4) {
        fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
      } else {
        fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
      }
      return fiscalyear
    }
    /*** End */

    /*** Get Last date of every month from year range */
    public static getLastDate = (month:number,range:number):Promise<string[]> =>{
      return new Promise((resolve, reject) =>{
        try{
            let start_year = new Date().getFullYear();
            let end_year = start_year - range;
            let date = [];
            for(let i = start_year;i >= end_year;i--){
                for(let j = month; j >= 0;j--){
                  var dt = new Date();  
                  if(i == end_year){
                    if(j > 2){
                      date.push(moment(new Date(i,(j + 1),0)).format('YYYY-MM-DD'));
                    }
                  }
                  else{
                    var actual_date = new Date(i,(j+1),0) 
                    if(dt > actual_date){
                      date.push(moment(new Date(i,(j + 1),0)).format('YYYY-MM-DD'));
                    }
                    else{
                      if(actual_date.getMonth() == month){
                        date.push(moment(new Date()).format('YYYY-MM-DD'));
                      }
                    }
                  }
                }
            }
            resolve(date);

        }
        catch(err){
            console.log(err);
            reject([])
        }
        
      })
      
    }

    /**** End */
    static exportExcel = (disclaimer,column,dataSource,fileName,exportFileName,footerDetails:any | undefined = []) =>{
      console.log(footerDetails)
      let workbook = new ExcelJS.Workbook();
      let worksheet= workbook.addWorksheet(fileName,
        {
          views:[
            {state: 'frozen', xSplit: 0, ySplit: 1}
          ]
        }
      );

      let to_be_matured_header_row = worksheet.addRow(column);
      to_be_matured_header_row.eachCell((cell) =>{
        cell.fill={
          type:'pattern',
          pattern:'solid',
          fgColor:{argb:'FFFFFF00'},
          bgColor:{argb:'FF0000FF'},
        }
      })
      worksheet.addRows(dataSource);
      if(footerDetails){
        let footerRow = worksheet.addRow(footerDetails);
        footerRow.eachCell((cell) =>{
          cell.fill={
            type:'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFFFF00'},
            bgColor:{argb:'FF0000FF'},
          }
        })
      }
      const currentRowIdx = worksheet.rowCount; // Find out how many rows are there currently
      const endColumnIdx = worksheet.columnCount; // Find out how many columns are in the worksheet
      let disclaimerRow_to_be_matured = worksheet.addRow([
        `Disclaimer - ${disclaimer.dis_des}`
      ]);
      disclaimerRow_to_be_matured.eachCell((cell) =>{
      cell.font = {
          color :{argb:disclaimer.color_code}
      }
      cell.font.size= disclaimer.font_size
      })
      worksheet.mergeCells((currentRowIdx + 1), 1, (currentRowIdx + 1), endColumnIdx,fileName);
      workbook.xlsx.writeBuffer().then((data)=>{
        let blob = new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
        saveAs(blob, exportFileName);

      })
    }
}
