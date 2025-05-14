import { Component, OnInit } from '@angular/core';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import { UtiliService } from 'src/app/__Services/utils.service';
import { IAumFooterModel } from '../component/aum.model';
import { pluck } from 'rxjs/operators';
import { global } from 'src/app/__Utility/globalFunc';

@Component({
  selector: 'app-aum-city-wise',
  templateUrl: './aum-city-wise.component.html',
  styleUrls: ['./aum-city-wise.component.css']
})
export class AumCityWiseComponent implements OnInit {
constructor(private dbIntr:DbIntrService,private utility:UtiliService) { }

  md_aum_city_type = [];

  __formDate:string = new Date().toLocaleDateString();

  aum_client_Column:column[] = AumFamilyColumn.column;

  md_cityTtpe:Partial<{id:number,name:string}>[] = [];

  /*** Table Footer Details */
  footerDT:any
  /*** End */

  ngOnInit(): void {
    this.getCityType();
  }

  getFormData = (ev) => {
    console.log(ev);
    this.__formDate = ev.date;
    // console.log()
    var formdata = new FormData();
    for(let key in ev){
      if(Array.isArray(ev[key])){
        formdata.append(key,JSON.stringify(ev[key]))
      }
      else{
        formdata.append(key,ev[key])
      }
    }
      this.dbIntr.api_call(1,'/clients/aumCityType',ev).pipe(pluck('data')).subscribe((res:any) =>{
          console.log(res);
          this.calculateAUMByCityType(res);
      })
  }
  
  getCityType = () =>{
      this.dbIntr.api_call(0,'/cityType',null).pipe(pluck('data')).subscribe((res:Partial<{id:number,name:string}>[]) =>{
              this.md_cityTtpe = res
      })
  }

      calculateAUMByCityType = (res) =>{
                  let originalDt = [];
                  const filteredByCityType = res.filter(el => el.city_type_id)
                  const groupByCityType = this.groupBy(filteredByCityType, 'city_type_name');
                  const totalInv = global.Total__Count(filteredByCityType, (x:any) => x?.inv_cost ? Number(x.inv_cost) : 0);
                  console.log(totalInv);
                  Object.keys(groupByCityType).forEach((key,index) =>{
                          /***** CALUCLATION OF UPPER TABLE */
                              const totInvCost = groupByCityType[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                              const totIdcwPaid = groupByCityType[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                              const totIdcwReinv = groupByCityType[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                              const totAUM = groupByCityType[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                              // const totAbsRtn = groupByCityType[key].map(el => Number(el.abs_rtn)).reduce((totSum, a) => totSum + a, 0);
                              const totGainLoss = groupByCityType[key].map(el => Number(el.gain_loss)).reduce((totSum, a) => totSum + a, 0);
                              const totAbsRtn = (totGainLoss / totInvCost)*100;
                          /****** END */
              
                          /**** DISPLAY AMOUNT CATEGORY WISE */
                            originalDt.push({
                              city_type_name:groupByCityType[key][0]?.city_type_name,
                              inv_cost:totInvCost,
                              Investment:totInvCost,
                              idcw_paid:totIdcwPaid,
                              IDCWP:totIdcwPaid,
                              idcw_reinv:totIdcwReinv,
                              "IDCW Reinv.":totIdcwReinv,
                              gain_loss:totGainLoss,
                              curr_aum:totAUM,
                              AUM:totAUM,
                              ret_abs:totAbsRtn.toFixed(2),
                              "Abs. Return":totAbsRtn,
                              total:{
                                inv_cost:totInvCost,
                                idcwp:totIdcwPaid,
                                curr_aum:totAUM,
                                abs_rtn:totAbsRtn,
                                branch_name:"TOTAL"
                              }
                            })
                          /**** END */
                  })
                  console.log(originalDt)
                  this.md_aum_city_type = originalDt;
                  // this.md_aum_by_branch = originalDt;
                  this.createParentFooter(originalDt)
      }
      groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      createParentFooter = (value) =>{
        const tot_gain_loss = global.Total__Count(value,(x:any) => x?.gain_loss ? Number(x?.gain_loss) : 0);
        const tot_inv_cost = global.Total__Count(value,(x:any) => x?.inv_cost ? Number(x?.inv_cost) : 0);
        // console.log((tot_gain_loss / tot_inv_cost) * 100);
        const tot_ret_abs = ((tot_gain_loss / tot_inv_cost) * 100);
        this.footerDT = {
          AUM: global.Total__Count(value,((item:any) => item.curr_aum ? Number(item.curr_aum) : 0)),
          "Abs. Return":Number(tot_ret_abs.toFixed(2)),
          IDCWP:global.Total__Count(value,(x:any) => x?.idcwp ? Number(x?.idcwp) : 0),
          "IDCW Reinv.":global.Total__Count(value,(x:any) => x?.idcw_reinv ? Number(x?.idcw_reinv) : 0),
          Investment:tot_inv_cost
        }
        console.log(this.footerDT);
      }
}




export class AumFamilyColumn{
  public static column:column[] = [
    {
      field:'city_type_name',
      header:'City Type',
      width:'24rem'
    },
    // {
    //   field:'broker_name',
    //   header:'Broker Name',
    //   width:'8rem'
    // },
    {
      field:'inv_cost',
      header:'Investment',
      width:'8rem'
    },
    {
      field:'idcw_paid',
      header:'IDCWP',
      width:'8rem'
    },
    {
      field:'idcw_reinv',
      header:'IDCW Reinv.',
      width:'10rem'
    },
    {
      field:'curr_aum',
      header:'AUM',
      width:'6rem'
    },
    {
      field:'ret_abs',
      header:'Abs. Return',
      width:'6rem'
    }
  ];
}