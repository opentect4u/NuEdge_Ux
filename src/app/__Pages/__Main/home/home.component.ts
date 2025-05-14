import { Component, OnInit } from '@angular/core';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { view } from 'src/app/__Model/view';
import  menu from '../../../../assets/json/menu.json';
import QuickView from '../../../../assets/json/quickView.json';
import EmployeeScores from '../../../../assets/json/EmployeeScores.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pipe } from 'rxjs';
import { pluck } from 'rxjs/operators';
import moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /*** Holding left card menus i.e: Human resources,Admin etc */
  __menu:menuBodyList[] = menu;
  /*** End */
  /** For Holding data of Quick view In home page */
  __quickView:view[] = QuickView;
  /*** End */
  /** For Holding data of Employee scores in home Page */
  __employeeScores:view[] = EmployeeScores;
  /*** End */

  /*** For Showing Top Card Value */
  // __topValues:any = [
  //   {title:"Live SIP",value:999,class_name:"bg-gradient-dark",monthly_trend:-.20},
  //   {title:"Live STP",value:9999,class_name:"bg-gradient-pink",monthly_trend: 50.0},
  //   {title:"Live SWP",value:9999,class_name:"bg-gradient-success",monthly_trend:-.20},
  //   {title:"NAV",value:9999,class_name:"bg-gradient-info",monthly_trend:-.20}
  // ]
  /*** End */


    /*** For Showing Top Card Value */
    __topValues:Required<ITileValue>[] = [
      {title:"Current AUM",amount:0,class_name:"",flag:"C",is_pending:true,mom_percentage:0,route_url:'/main/product/mf/mis/aum/fund-house'},
      {title:"Live SIP",amount:0,class_name:"",flag:"L",is_pending:true,mom_percentage:0,route_url:'/main/product/mf/sipreport'},
      {title:"Monthly MIS (NS)",amount:0,class_name:"",flag:"M",is_pending:false,mom_percentage:0,route_url:'/main'},
      {title:"Monthly MIS (GS)",amount:0,class_name:"",flag:'T',is_pending:false,mom_percentage:0,route_url:'/main'}
    ]
    /*** End */
  constructor(private dbIntr:DbIntrService) {}
  ngOnInit() {
    this.Calculate_Live_SIP();
    this.CalculateLive_Aum();
  }


   /**
   * For Calculating Live SIP
   */
  Calculate_Live_SIP(){
      this.dbIntr.api_call(0,'/showLiveSIPAmount','flag=L',true)
      .pipe(pluck("data")).
      subscribe((res:Required<ITilesAPIResonse>) =>{
        this.setAmountInTiles(res);
      },
      err => {
          const index = this.__topValues.findIndex(item => item.flag == 'L');
          this.checkStatusofTiles(false,index);
      }
      )
  }


  /**
   * For Calculating Current AUM
   */
  CalculateLive_Aum(){
    this.dbIntr.api_call(0,'/showCurrAum','flag=C',true)
    .pipe(pluck("data")).
    subscribe((res:any) =>{
      try{
        const sorted_date_arr = Object.keys(res?.data).sort((a, b) => moment(b).diff(moment(a)));
        const mainObj = {
          curr_total_amount: res?.data ? res?.data[sorted_date_arr[0]] : 0,
          flag: res?.flag,
          prev_total_amount:  res?.data ? res?.data[sorted_date_arr[sorted_date_arr.length - 1]] : 0,
          total_amount: res?.data ? res?.data[sorted_date_arr[0]] : 0
        } 
        this.setAmountInTiles(mainObj);
      }
      catch(err){
        const index = this.__topValues.findIndex(item => item.flag == 'C');
        this.checkStatusofTiles(false,index);
      }

    },
    err => {
        const index = this.__topValues.findIndex(item => item.flag == 'C');
        this.checkStatusofTiles(false,index);
    }
    )
  }

  /**
   * set amount in the array of tiles
   * @param res
   */
  setAmountInTiles = (res:Required<ITilesAPIResonse>) =>{
    const index = this.__topValues.findIndex(item => item.flag == res.flag);
    try{
      console.log(res);
      this.__topValues[index].amount = res.total_amount;
      const momPercentage__calculation = ((res.total_amount - res.prev_total_amount) / res.prev_total_amount) * 100
      this.__topValues[index].mom_percentage = momPercentage__calculation;
      console.log(momPercentage__calculation)
    }
    catch(ex){
        console.log(ex)
    }
    this.checkStatusofTiles(false,index);
  }

  checkStatusofTiles = (is_pending:boolean,index:number) =>{
    this.__topValues[index].is_pending = is_pending;
  }
}

export interface ITileValue{
     title:string;
     amount:number;
     class_name:string;
     flag:string;
     is_pending:boolean;
     mom_percentage:number,
     route_url:string;
}

export interface ITilesAPIResonse{
  curr_total_amount: number;
  flag: string;
  prev_total_amount: number;
  total_amount: number;
}
