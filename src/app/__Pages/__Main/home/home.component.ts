import { Component, OnInit } from '@angular/core';
import { menuBodyList } from 'src/app/__Model/menuBody';
import { view } from 'src/app/__Model/view';
import  menu from '../../../../assets/json/menu.json';
import QuickView from '../../../../assets/json/quickView.json';
import EmployeeScores from '../../../../assets/json/EmployeeScores.json';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { pipe } from 'rxjs';
import { pluck } from 'rxjs/operators';
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
    __topValues:Partial<ITileValue>[] = [
      {title:"Current AUM",amount:0,class_name:"seeGreen_Gredient",flag:"C",is_pending:false},
      {title:"Live SIP",amount:0,class_name:"blue_Gredient",flag:"L",is_pending:true},
      {title:"Monthly MIS",amount:0,class_name:"red_Gredient",flag:"M",is_pending:false},
      {title:"Title-4",amount:0,class_name:"yellow_Gredient",flag:'T',is_pending:false}
    ]
    /*** End */
  constructor(private dbIntr:DbIntrService) {}
  ngOnInit() {this.Calculate_Live_SIP()}


  Calculate_Live_SIP(){
      console.log(this.__topValues)
      this.dbIntr.api_call(0,'/showLiveSIPAmount','flag=L',true)
      .pipe(pluck("data")).
      subscribe((res:Required<{total_amount:number,flag:string}>) =>{
        this.setAmountInTiles(res);
      },
      err => {
          const index = this.__topValues.findIndex(item => item.flag == 'L');
          this.checkStatusofTiles(false,index);
      }
      )
  }

  /**
   * set amount in the array of tiles
   * @param res
   */
  setAmountInTiles = (res:Required<{total_amount:number,flag:string}>) =>{
    const index = this.__topValues.findIndex(item => item.flag == res.flag);
    try{
      this.__topValues[index].amount = res.total_amount;
    }
    catch(ex){
        console.log(ex)
    }
    this.checkStatusofTiles(false,index);
  }

  checkStatusofTiles = (is_pending:boolean,index:number) =>{
    this.__topValues[index].is_pending = is_pending;
    console.log(this.__topValues)
  }
}

export interface ITileValue{
     title:string;
     amount:number;
     class_name:string;
     flag:string;
     is_pending:boolean;
}
