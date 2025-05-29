import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';
import buisnessType from '../../../../../../../../assets/json/buisnessType.json';
import moment from 'moment';
import { Calendar } from 'primeng/calendar';
import { global } from 'src/app/__Utility/globalFunc';
import { pluck } from 'rxjs/operators';
import { UtiliService } from 'src/app/__Services/utils.service';
@Component({
  selector: 'app-au-m-segment',
  templateUrl: './au-m-segment.component.html',
  styleUrls: ['./au-m-segment.component.css']
})
export class AuMSegmentComponent implements OnInit {

  aum_segment_Column:column[] = AumSegmentColumn.aum_segment_Column;

  md_aum_by_segment:any[] = [];
  
  md_buisnessType  = buisnessType;

  footerDT:Partial<ISegmentFooter>;
    @ViewChild('dateRng') daterRnge:Calendar;

  __formDate:any = moment().format('DD/MM/YYYY');
  aum_report_filter_frm = new FormGroup({
    date: new FormControl(new Date()),
    bu_type_id: new FormControl(""),
  })

  constructor(private dbIntr: DbIntrService,private utility:UtiliService) { }

  ngOnInit(): void {
    // this.getBranchMst();
  }

  clickToSend() {
    // console.log(this.aum_report_filter_frm.value);
    var formdata = new FormData();
    for(let key in this.aum_report_filter_frm.value){
      if(Array.isArray(this.aum_report_filter_frm.value[key])){
        formdata.append(key,JSON.stringify(this.aum_report_filter_frm.value[key]))
      }
      else if(key == 'date'){
        formdata.append('date',this.daterRnge.inputFieldValue)
      }
      else{
        console.log(key)
        formdata.append(key,this.aum_report_filter_frm.value[key]?.toString())
      }
    }
    this.__formDate = moment(this.aum_report_filter_frm.value.date).format('YYYY-MM-DD');
    this.dbIntr.api_call(1,'/clients/aumSegment',formdata).pipe(pluck('data')).subscribe((res:any) =>{
        console.log(res);
        this.md_aum_by_segment = [];
        this.footerDT = null;
        this.calculateAUMByBranch(res);
    })
  }


    calculateAUMByBranch = (res) =>{
                let originalDt = [];
                let filteredBySegment = [];
                filteredBySegment = res.filter(el => el.bu_type_id);
                if(this.aum_report_filter_frm.value?.bu_type_id){
                      filteredBySegment = filteredBySegment.filter(el => el.bu_type_id == this.aum_report_filter_frm.value?.bu_type_id)
                }
                if(filteredBySegment.length > 0){

                const groupBySegment = this.groupBy(filteredBySegment, 'bu_type_id');
                const totalInv = global.Total__Count(filteredBySegment, (x:any) => x?.inv_cost ? Number(x.inv_cost) : 0);
                console.log(totalInv);
                Object.keys(groupBySegment).forEach((key,index) =>{
                        /***** CALUCLATION OF UPPER TABLE */
                            const totInvCost = groupBySegment[key].map(el => Number(el.inv_cost)).reduce((totSum, a) => totSum + a, 0);
                            const totIdcwPaid = groupBySegment[key].map(el => Number(el.idcw_paid)).reduce((totSum, a) => totSum + a, 0);
                            const totIdcwReinv = groupBySegment[key].map(el => Number(el.idcw_reinv)).reduce((totSum, a) => totSum + a, 0);
                            const totAUM = groupBySegment[key].map(el => Number(el.curr_aum)).reduce((totSum, a) => totSum + a, 0);
                            // const totAbsRtn = groupBySegment[key].map(el => Number(el.abs_rtn)).reduce((totSum, a) => totSum + a, 0);
                            const totGainLoss = groupBySegment[key].map(el => Number(el.gain_loss)).reduce((totSum, a) => totSum + a, 0);
                            const totAbsRtn = (totGainLoss / totInvCost)*100;
                            const tot_segment_weightage = (totInvCost / totalInv) * 100;
                        /****** END */
            
                        /**** DISPLAY AMOUNT CATEGORY WISE */
                          originalDt.push({
                            segment_name:buisnessType.filter(el => el.id == groupBySegment[key][0].bu_type_id)[0]?.bu_type ,
                            inv_cost:totInvCost,
                            Investment:totInvCost,
                            idcwp:totIdcwPaid,
                            IDCWP:totIdcwPaid,
                            idcw_reinv:totIdcwReinv,
                            "IDCW Reinv.":totIdcwReinv,
                            gain_loss:totGainLoss,
                            curr_aum:totAUM,
                            AUM:totAUM,
                            ret_abs:totAbsRtn.toFixed(2),
                            "Abs. Return":totAbsRtn,
                            "Segment Weightage In(%)":tot_segment_weightage.toFixed(2),
                            segment_weightage_in:tot_segment_weightage.toFixed(2),
                            // schemes:groupBySegment[key],
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
                this.md_aum_by_segment = originalDt;
                this.createParentFooter(originalDt)
                }
                else{
                  this.utility.showSnackbar('No data available for this segment',3)
                }

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
      let obj = {}
      const dt = value.map(({total,schemes,cat_name,segment_weightage_in,idcwp,
        amc_name,amc_code,inv_cost,idcw_paid,idcw_reinv,gain_loss,segment_name,
        curr_aum,ret_abs,subcat_name,contri_to_aum,...rest}) => {return {...rest}})
      for(let object of dt) {Object.assign(obj, object)}
      Object.keys(obj).forEach(el =>{
        // console.log( el + ":" + obj[el])
        this.footerDT = {
          ...this.footerDT,
          [el]:el == "Abs. Return" ? tot_ret_abs.toFixed(2) : el == 'Contri. To AUM' ? '100%' :  global.Total__Count(value,((item) => item[el] ? Number(item[el]) : 0)),
        }
      })
      console.log(this.footerDT);
    }

}

export interface IAUMByBranch{
    segment_name:string;
    inv_cost:number;
    idcwp:number;
    idcwr:number;
    segment_weightage_in:number;
    cur_aum:number;
    abs_rtn:number;
}

export interface ISegmentFooter{
  Investment:number,
  IDCWP:number,
  "IDCW Reinv.":number,
  "AUM":number,
  "Abs. Return":number,
  "Segment Weightage In(%)":number,
}
export class AumSegmentColumn{
  public static aum_segment_Column:column[] = [
  {
    field:'segment_name',
    header:'Segment',
    width:'24rem'
  },
  {
    field:'inv_cost',
    header:'Investment',
    width:'10rem'
  },
  {
    field:'idcwp',
    header:'IDCWP',
    width:'8rem'
  },
  {
    field:'idcw_reinv',
    header:'IDCW Reinv.',
    width:'8rem'
  },
  {
    field:'curr_aum',
    header:'AUM',
    width:'10rem'
  },
  {
    field:'ret_abs',
    header:'Abs. Return',
    width:'6rem'
  },
  {
    field:'segment_weightage_in',
    header:'Segment Weightage In(%)',
    width:'8rem'
  }
]
}