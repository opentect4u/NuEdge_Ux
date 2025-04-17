import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { column } from 'src/app/__Model/tblClmns';
import { DbIntrService } from 'src/app/__Services/dbIntr.service';

@Component({
  selector: 'app-au-m-segment',
  templateUrl: './au-m-segment.component.html',
  styleUrls: ['./au-m-segment.component.css']
})
export class AuMSegmentComponent implements OnInit {

  aum_segment_Column:column[] = AumSegmentColumn.aum_segment_Column;

  md_aum_by_segment:any[] = [];
  

  footerDT:Partial<ISegmentFooter> = {
        Investment:0.00,
        "IDCW Paid":0.00,
        "IDCW Reinv.":0.00,
        "AUM":0.00,
        "Abs. Return":0.00,
        "Segment Weightage In(%)":0.00,
  }

  __formDate:any = new Date().toLocaleDateString();
  aum_report_filter_frm = new FormGroup({
    date: new FormControl(new Date()),
    bu_type_id: new FormControl(""),
  })

  constructor(private dbIntr: DbIntrService) { }

  ngOnInit(): void {
    // this.getBranchMst();
  }

  clickToSend() {
    console.log(this.aum_report_filter_frm.value);
    // var formdata = new FormData();
    // for(let key in this.aum_report_filter_frm.value){
    //   if(Array.isArray(this.aum_report_filter_frm.value[key])){
    //     formdata.append(key,JSON.stringify(this.aum_report_filter_frm.value[key]))
    //   }
    //   else{
    //     formdata.append(key,this.aum_report_filter_frm.value[key])
    //   }
    // }
    this.__formDate = this.aum_report_filter_frm.value.date
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
  "IDCW Paid":number,
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
    header:'IDCW Paid',
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