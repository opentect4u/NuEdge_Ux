import { Component, Input, OnInit } from '@angular/core';
import { IAumFooterModel } from '../aum.model';


// export interface IAumReportsTiles{
//       Ines:number | undefined;
//       div_paid: number | undefined;
//       div_reinv: number | undefined;
//       aum: number | undefined;
//       ret_abs: number | undefined;
//       equity: number | undefined;
//       debt: number | undefined;
//       hybrid: number | undefined;
//       sol_oriented: number | undefined;
//       others: number | undefined
// }

@Component({
  selector: 'aum-report-total-calc',
  templateUrl: './aum-report-total-calc.component.html',
  styleUrls: ['./aum-report-total-calc.component.css']
})
export class AumReportTotalCalcComponent implements OnInit {

  constructor() { }

  @Input() aum_report_for_date:string;

  // @Input() aum_reports_tiles: Partial<IAumFooterModel>;

  private _aum_reports_tiles: Partial<IAumFooterModel>;

  @Input()
  get aum_reports_tiles(): Partial<IAumFooterModel> {
    return this._aum_reports_tiles
  }

  set aum_reports_tiles(value) {
    if(value){
      this._aum_reports_tiles = value;
      setTimeout(() => {
        Object.keys(value).forEach(el =>{
          if(el != 'AMC Weightage in (%)'){
          const getElement = document.getElementById(el);
          getElement.style.border = this.generateBorderColor();
          getElement.style.borderRadius = "3px";
          getElement.style.padding = "3px";
          }

        })
      }, 500);
    }
      
       
  }

  @Input() aum_type: 'Fund House' | 'Families' | 'Clients' | 'Scheme' | 'Assets Allocation' | 'Registrar' | 'Branch' | 'Segment' | 'City Type' = 'Fund House';

  ngOnInit(): void {}

  generateBorderColor = () => {
      try{
        let r, g, b;

        // Ensure the color is not white or black by generating values between 1 and 254
        r = Math.floor(Math.random() * 151) + 50; // Range: 50-200
        g = Math.floor(Math.random() * 151) + 50; // Range: 50-200
        b = Math.floor(Math.random() * 151) + 50; // Range: 50-200
    
        // Return the color in RGB format
        return `1px solid rgb(${r}, ${g}, ${b})`;
      }
      catch(err){
        console.log(err);
        return '1px solid #dbdbdb'
      }
  }
}
